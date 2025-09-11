// src/app/api/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  validateEventRequest,
  sanitizeString,
  checkRateLimit,
} from "@/lib/validation";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;
    // now you have a guaranteed admin user

    // ✅ At this point, only admins can continue
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.RequestWhereInput = { deletedAt: null };

    if (
      status &&
      [
        "PENDING",
        "APPROVED",
        "IN_PROGRESS",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
        "ON_HOLD",
      ].includes(status)
    ) {
      where.status = status as Prisma.EnumRequestStatusFilter["equals"];
    }

    if (search.trim()) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { eventType: { contains: search, mode: "insensitive" } },
        { details: { contains: search, mode: "insensitive" } },
      ];
    }

    const totalCount = await prisma.request.count({ where });

    const requests = await prisma.request.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: {
        requests,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(`request_${clientIp}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const validation = validateEventRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const sanitizedData = {
      firstName: sanitizeString(body.firstName),
      lastName: sanitizeString(body.lastName),
      email: sanitizeString(body.email).toLowerCase(),
      eventType: sanitizeString(body.eventType),
      details: body.details ? sanitizeString(body.details) : null,
    };

    const newRequest = await prisma.request.create({
      data: sanitizedData,
    });

    return NextResponse.json(
      {
        data: {
          message: "Request submitted successfully",
          request: newRequest,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
