// src/app/api/requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RequestStatus = "PENDING" | "COMPLETED";

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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const requestData = await prisma.request.findUnique({ where: { id } });

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(requestData);
  } catch (error: unknown) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Failed to fetch request" },
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
    const body: RequestUpdateBody = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const updates: Partial<RequestUpdateBody> = {};

    if (body.status !== undefined) {
      if (!["PENDING", "COMPLETED"].includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({
      message: "Request updated successfully",
      request: updatedRequest,
    });
  } catch (error: unknown) {
    if (isPrismaNotFoundError(error)) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
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
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    await prisma.request.delete({ where: { id } });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error: unknown) {
    if (isPrismaNotFoundError(error)) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
