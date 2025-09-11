"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Clock,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardSummary {
  summary: {
    requests: {
      total: number;
      completed: number;
      pending: number;
      completionRate: number;
    };
    testimonials: {
      total: number;
      approved: number;
      pending: number;
      approvalRate: number;
    };
  };
  recent: {
    requests: Array<{
      id: number;
      firstName: string;
      lastName: string;
      eventType: string;
      status: string;
      createdAt: string;
    }>;
    testimonials: Array<{
      id: number;
      name: string;
      rating: number;
      status: string;
      createdAt: string;
    }>;
  };
  aiInsights: {
    enabled: boolean;
    message: string;
  };
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch("/api/dashboard/summary");
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
          Admin Dashboard
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl shadow-md bg-[var(--color-bg-light)]"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle
            className="h-12 w-12 mb-4"
            style={{ color: "var(--color-secondary)" }}
          />
          <p className="text-lg text-[var(--color-text)]">
            Failed to load dashboard data
          </p>
          <Button onClick={fetchSummary} className="mt-4 rounded-xl">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { requests, testimonials } = summary.summary;

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Dashboard Overview
        </h1>
        <div className="flex gap-3">
          <Link href="/admin/requests">
            <Button
              variant="outline"
              className="rounded-xl shadow-sm border-[var(--color-secondary)] text-[var(--color-text)]"
            >
              Manage Requests
            </Button>
          </Link>
          <Link href="/admin/testimonials">
            <Button
              variant="outline"
              className="rounded-xl shadow-sm border-[var(--color-secondary)] text-[var(--color-text)]"
            >
              Manage Testimonials
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Requests Summary */}
        {[
          {
            title: "Total Requests",
            value: requests.total,
            desc: `${requests.completed} completed`,
            icon: (
              <ListChecks className="h-5 w-5" style={{ color: "#2563eb" }} />
            ),
          },
          {
            title: "Completed Requests",
            value: requests.completed,
            desc: `${requests.completionRate}% completion rate`,
            icon: (
              <CheckCircle2 className="h-5 w-5" style={{ color: "#16a34a" }} />
            ),
          },
          {
            title: "Pending Requests",
            value: requests.pending,
            desc: "Awaiting completion",
            icon: <Clock className="h-5 w-5" style={{ color: "#eab308" }} />,
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all bg-[var(--color-bg-light)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--color-text)]">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--color-text)]">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Testimonials Summary */}
        {[
          {
            title: "Total Testimonials",
            value: testimonials.total,
            desc: `${testimonials.pending} pending approval`,
            icon: (
              <MessageSquare
                className="h-5 w-5"
                style={{ color: "var(--color-secondary)" }}
              />
            ),
          },
          {
            title: "Approved Testimonials",
            value: testimonials.approved,
            desc: `${testimonials.approvalRate}% approval rate`,
            icon: <ThumbsUp className="h-5 w-5" style={{ color: "#16a34a" }} />,
          },
          {
            title: "Pending Testimonials",
            value: testimonials.pending,
            desc: "Awaiting review",
            icon: <Clock className="h-5 w-5" style={{ color: "#eab308" }} />,
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all bg-[var(--color-bg-light)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--color-text)]">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--color-text)]">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* AI Insights */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="sm:col-span-2 lg:col-span-3"
        >
          <Card
            className={`relative rounded-2xl shadow-md overflow-hidden ${
              summary.aiInsights.enabled
                ? "bg-[var(--color-bg-light)] border-2 border-[var(--color-primary)] animate-pulse-slow"
                : "bg-[var(--color-bg-light)]"
            }`}
          >
            {summary.aiInsights.enabled && (
              <div className="absolute inset-0 rounded-2xl border-2 border-[var(--color-primary)] blur-md opacity-30 animate-pulse-slow pointer-events-none" />
            )}

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-[var(--color-text)]">
                AI Insights
              </CardTitle>
              <TrendingUp
                className="h-5 w-5"
                style={{ color: "var(--color-secondary)" }}
              />
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-[var(--color-text)]">
                {summary.aiInsights.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.aiInsights.enabled ? "Powered by AI" : "Coming soon"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity (Requests + Testimonials) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Requests */}
        {/* Requests */}
        <Card className="rounded-2xl shadow-md bg-[var(--color-bg-light)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[var(--color-text)]">
              Recent Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {summary.recent.requests.length > 0 ? (
                summary.recent.requests.map((request) => (
                  <motion.div
                    key={request.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 border rounded-xl bg-[var(--color-bg-secondary)]"
                  >
                    <div>
                      <p className="font-medium text-[var(--color-text)]">
                        {request.firstName} {request.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.eventType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          request.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent requests
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="rounded-2xl shadow-md bg-[var(--color-bg-light)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[var(--color-text)]">
              Recent Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {summary.recent.testimonials.length > 0 ? (
                summary.recent.testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 border rounded-xl bg-[var(--color-bg-secondary)]"
                  >
                    <div>
                      <p className="font-medium text-[var(--color-text)]">
                        {testimonial.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < testimonial.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          testimonial.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : testimonial.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {testimonial.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent testimonials
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
