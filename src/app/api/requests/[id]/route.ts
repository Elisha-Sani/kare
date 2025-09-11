// ...existing/modified code...
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED"
  | "ON_HOLD";

interface RequestUpdateBody {
  status?: RequestStatus;
}

function isPrismaNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2025"
  );
}

/**
 * Safely extract an integer id from the second handler arg.
 * The handler second arg has different shapes depending on Next's internal types,
 * so we accept `unknown` and narrow it here.
 */
function getIdFromContext(context: unknown): number | null {
  try {
    // Narrow to an object that MAY have { params: { id?: string } }
    const maybe = context as { params?: { id?: unknown } } | undefined;
    const rawId = maybe?.params?.id;

    if (typeof rawId === "string") {
      const id = parseInt(rawId, 10);
      return Number.isFinite(id) ? id : null;
    }

    // If it's a number already (unlikely) coerce
    if (typeof rawId === "number" && Number.isFinite(rawId)) {
      return Math.floor(rawId);
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, context: unknown) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;
    // now you have a guaranteed admin user

    const id = getIdFromContext(context);
    if (id === null) {
      return NextResponse.json(
        { error: "Invalid request ID", status: 400 },
        { status: 400 }
      );
    }

    const requestData = await prisma.request.findFirst({
      where: { id, deletedAt: null },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: "Request not found", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: requestData });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Failed to fetch request", status: 500 },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: unknown) {
  try {
    const id = getIdFromContext(context);
    if (id === null) {
      return NextResponse.json(
        { error: "Invalid request ID", status: 400 },
        { status: 400 }
      );
    }

    const body: RequestUpdateBody = await request.json();

    if (body.status) {
      const validStatuses: RequestStatus[] = [
        "PENDING",
        "APPROVED",
        "IN_PROGRESS",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
        "ON_HOLD",
      ];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value", status: 400 },
          { status: 400 }
        );
      }
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { ...body },
    });

    return NextResponse.json({
      message: "Request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      return NextResponse.json(
        { error: "Request not found", status: 404 },
        { status: 404 }
      );
    }

    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request", status: 500 },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: unknown) {
  try {
    const id = getIdFromContext(context);
    if (id === null) {
      return NextResponse.json(
        { error: "Invalid request ID", status: 400 },
        { status: 400 }
      );
    }

    await prisma.request.update({
      where: { id },
      data: { deletedAt: new Date() }, // soft delete
    });

    return NextResponse.json({ message: "Request deleted (soft delete)" });
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      return NextResponse.json(
        { error: "Request not found", status: 404 },
        { status: 404 }
      );
    }

    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Failed to delete request", status: 500 },
      { status: 500 }
    );
  }
}
