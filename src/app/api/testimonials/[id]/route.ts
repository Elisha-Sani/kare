// src/app/api/testimonials/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, TestimonialStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid testimonial ID" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid testimonial ID" },
        { status: 400 }
      );
    }

    // Only allow status updates
    const updates: { status?: TestimonialStatus } = {};

    if (body.status !== undefined) {
      if (!Object.values(TestimonialStatus).includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }
      updates.status = body.status as TestimonialStatus;
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({
      message: `Testimonial ${
        updates.status?.toLowerCase() || "updated"
      } successfully`,
      testimonial: updatedTestimonial,
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Testimonial not found" },
          { status: 404 }
        );
      }
    }

    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid testimonial ID" },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Testimonial deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Testimonial not found" },
          { status: 404 }
        );
      }
    }

    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
