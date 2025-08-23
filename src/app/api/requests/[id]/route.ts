import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH: toggle approval (admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approved } = await req.json();

    const updated = await prisma.eventRequest.update({
      where: { id: params.id },
      data: { approved },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

// DELETE: optional, remove request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.eventRequest.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
