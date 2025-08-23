import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all event requests (for admin)
export async function GET() {
  try {
    const requests = await prisma.eventRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

// POST new event request (public form submission)
export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, eventType, message } = await req.json();

    const newRequest = await prisma.eventRequest.create({
      data: { firstName, lastName, email, eventType, message },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
