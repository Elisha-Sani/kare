// src/app/api/testimonials/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  validateTestimonial,
  sanitizeString,
  checkRateLimit,
} from "@/lib/validation";
import { Prisma, TestimonialStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const approved = searchParams.get("approved") === "true"; // normalize to boolean
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Build where clause with proper type
    const where: Prisma.TestimonialWhereInput = {};

    // For public display, only show approved
    if (approved) {
      where.status = TestimonialStatus.APPROVED;
    } else if (
      status &&
      Object.values(TestimonialStatus).includes(status as TestimonialStatus)
    ) {
      where.status = status as TestimonialStatus;
    }

    const totalCount = await prisma.testimonial.count({ where });

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: !approved, // Only show email in admin view
        comment: true,
        rating: true,
        status: !approved, // Hide status in public view
        createdAt: true,
      },
    });

    return NextResponse.json({
      testimonials,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    // Rate limiting
    if (!checkRateLimit(`testimonial_${clientIp}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Validate input
    const validation = validateTestimonial(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize
    const sanitizedData = {
      name: sanitizeString(body.name),
      email: sanitizeString(body.email).toLowerCase(),
      comment: sanitizeString(body.comment),
      rating: Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5)),
    };

    // Prevent duplicate submissions within 24h
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: {
        email: sanitizedData.email,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingTestimonial) {
      return NextResponse.json(
        {
          error:
            "You have already submitted a testimonial recently. Please wait before submitting another.",
        },
        { status: 400 }
      );
    }

    // Create testimonial
    const newTestimonial = await prisma.testimonial.create({
      data: sanitizedData,
    });

    return NextResponse.json(
      {
        message: "Thank you for your testimonial! It will be reviewed shortly.",
        testimonial: {
          id: newTestimonial.id,
          name: newTestimonial.name,
          rating: newTestimonial.rating,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}
