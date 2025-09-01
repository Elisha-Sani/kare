// src/app/api/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  validateEventRequest,
  sanitizeString,
  checkRateLimit,
} from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Properly type the filter
    const where: Prisma.RequestWhereInput = {};
    if (status && ["PENDING", "COMPLETED"].includes(status)) {
      where.status = status as Prisma.EnumRequestStatusFilter["equals"];
    }

    // Get total count for pagination
    const totalCount = await prisma.request.count({ where });

    // Get requests with pagination
    const requests = await prisma.request.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      requests,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
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

    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (!checkRateLimit(`request_${clientIp}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Validate input
    const validation = validateEventRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedData = {
      firstName: sanitizeString(body.firstName),
      lastName: sanitizeString(body.lastName),
      email: sanitizeString(body.email).toLowerCase(),
      eventType: sanitizeString(body.eventType),
      details: body.details ? sanitizeString(body.details) : null,
    };

    // Create request
    const newRequest = await prisma.request.create({
      data: sanitizedData,
    });

    return NextResponse.json(
      {
        message: "Request submitted successfully",
        request: newRequest,
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
