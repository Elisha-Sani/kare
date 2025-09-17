// src/app/api/testimonials/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  validateTestimonial,
  sanitizeString,
  checkRateLimit,
} from "@/lib/validation";
import { TestimonialStatus, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";

// GET testimonials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isAdminMode = searchParams.get("approved") === "false";

    if (isAdminMode) {
      const { error } = await requireAdmin();
      if (error) return error;
    }

    const page = isAdminMode
      ? parseInt(searchParams.get("page") ?? "1", 10)
      : 1;
    const limit = parseInt(
      searchParams.get("limit") ?? (isAdminMode ? "9" : "6"),
      10
    );
    const skip = (page - 1) * limit;
    const statusParam = searchParams.get("status");

    const where: Prisma.TestimonialWhereInput = {};
    if (isAdminMode && statusParam && statusParam !== "ALL") {
      if (
        !Object.values(TestimonialStatus).includes(
          statusParam as TestimonialStatus
        )
      ) {
        return NextResponse.json(
          { error: "Invalid status filter" },
          { status: 400 }
        );
      }
      where.status = statusParam as TestimonialStatus;
    } else if (!isAdminMode) {
      where.status = TestimonialStatus.APPROVED;
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: isAdminMode ? skip : undefined,
        take: limit,
        select: {
          id: true,
          name: true,
          comment: true,
          rating: true,
          createdAt: true,
          ...(isAdminMode ? { email: true, status: true } : {}),
        },
      }),
      isAdminMode ? prisma.testimonial.count({ where }) : Promise.resolve(0),
    ]);

    const responseData: {
      testimonials: typeof testimonials;
      pagination?: { totalPages: number };
    } = { testimonials };
    if (isAdminMode) {
      responseData.pagination = { totalPages: Math.ceil(total / limit) };
    }

    return NextResponse.json({ data: responseData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials." },
      { status: 500 }
    );
  }
}

// POST testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(`testimonial_${clientIp}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const validation = validateTestimonial(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const sanitizedData = {
      name: sanitizeString(body.name),
      email: sanitizeString(body.email).toLowerCase(),
      comment: sanitizeString(body.comment),
      rating: Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5)),
    };

    const clientExists = await prisma.request.findFirst({
      where: { email: sanitizedData.email, status: "COMPLETED" },
    });

    if (!clientExists) {
      return NextResponse.json(
        {
          error:
            "Only clients who have received a service can post a testimonial.",
        },
        { status: 403 }
      );
    }

    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { email: sanitizedData.email },
    });

    if (existingTestimonial) {
      return NextResponse.json(
        { error: "You have already submitted a testimonial for this service." },
        { status: 400 }
      );
    }

    const newTestimonial = await prisma.testimonial.create({
      data: { ...sanitizedData, status: TestimonialStatus.PENDING },
    });

    return NextResponse.json(
      {
        data: {
          message:
            "Thank you for your testimonial! It will be reviewed shortly.",
          testimonial: {
            id: newTestimonial.id,
            name: newTestimonial.name,
            rating: newTestimonial.rating,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial. Please try again later." },
      { status: 500 }
    );
  }
}
