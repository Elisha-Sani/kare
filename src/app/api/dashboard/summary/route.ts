// src/app/api/dashboard/summary/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient, auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    if (user.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Fetch all counts in parallel for better performance
    const [
      totalRequests,
      completedRequests,
      pendingRequests,
      totalTestimonials,
      approvedTestimonials,
      pendingTestimonials,
      recentRequests,
      recentTestimonials,
    ] = await Promise.all([
      prisma.request.count(),
      prisma.request.count({ where: { status: "COMPLETED" } }),
      prisma.request.count({ where: { status: "PENDING" } }),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { status: "APPROVED" } }),
      prisma.testimonial.count({ where: { status: "PENDING" } }),
      prisma.request.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          eventType: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.testimonial.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          rating: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate percentages
    const completionRate =
      totalRequests > 0
        ? Math.round((completedRequests / totalRequests) * 100)
        : 0;

    const approvalRate =
      totalTestimonials > 0
        ? Math.round((approvedTestimonials / totalTestimonials) * 100)
        : 0;

    // Prepare AI insights structure (for future implementation)
    const aiInsights = {
      enabled: false,
      recommendations: [],
      trends: {
        requestsGrowth: null,
        testimonialsGrowth: null,
        popularEventTypes: null,
      },
      message: "AI insights will be available in a future update",
    };

    return NextResponse.json({
      summary: {
        requests: {
          total: totalRequests,
          completed: completedRequests,
          pending: pendingRequests,
          completionRate,
        },
        testimonials: {
          total: totalTestimonials,
          approved: approvedTestimonials,
          pending: pendingTestimonials,
          approvalRate,
        },
      },
      recent: {
        requests: recentRequests,
        testimonials: recentTestimonials,
      },
      aiInsights,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
