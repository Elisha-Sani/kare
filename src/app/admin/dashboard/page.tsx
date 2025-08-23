"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface EventRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  eventType: string;
  message: string | null;
  approved: boolean;
  createdAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  email: string;
  comment: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [reqRes, testRes] = await Promise.all([
        fetch("/api/admin/requests"),
        fetch("/api/admin/testimonials"),
      ]);

      if (!reqRes.ok || !testRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const reqData = await reqRes.json();
      const testData = await testRes.json();

      setRequests(reqData);
      setTestimonials(testData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleRequestAction = async (
    id: string,
    action: "approve" | "delete"
  ) => {
    try {
      const response = await fetch(`/api/admin/requests/${id}`, {
        method: action === "approve" ? "PATCH" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body:
          action === "approve" ? JSON.stringify({ approved: true }) : undefined,
      });

      if (!response.ok) {
        throw new Error("Action failed");
      }

      toast.success(`Request ${action}d successfully`);
      fetchData();
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Action failed");
    }
  };

  const handleTestimonialAction = async (
    id: string,
    action: "approve" | "delete"
  ) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: action === "approve" ? "PATCH" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body:
          action === "approve" ? JSON.stringify({ approved: true }) : undefined,
      });

      if (!response.ok) {
        throw new Error("Action failed");
      }

      toast.success(`Testimonial ${action}d successfully`);
      fetchData();
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Event Requests Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif mb-6">Event Requests</h2>
          {requests.length === 0 ? (
            <p>No event requests yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map((req) => (
                <Card key={req.id} className="p-6">
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">
                      {req.firstName} {req.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{req.email}</p>
                    <p>Event Type: {req.eventType}</p>
                    {req.message && (
                      <p className="text-sm">Message: {req.message}</p>
                    )}
                    <p className="text-sm">
                      Status: {req.approved ? "✅ Approved" : "⏳ Pending"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!req.approved && (
                      <Button
                        size="sm"
                        onClick={() => handleRequestAction(req.id, "approve")}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRequestAction(req.id, "delete")}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        <section>
          <h2 className="text-2xl font-serif mb-6">Testimonials</h2>
          {testimonials.length === 0 ? (
            <p>No testimonials yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((test) => (
                <Card key={test.id} className="p-6">
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">{test.name}</p>
                    <p className="text-sm text-gray-600">{test.email}</p>
                    <p className="text-sm">
                      Rating: {"⭐".repeat(test.rating)}
                    </p>
                    <p className="italic">{test.comment}</p>
                    <p className="text-sm">
                      Status: {test.approved ? "✅ Approved" : "⏳ Pending"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!test.approved && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleTestimonialAction(test.id, "approve")
                        }
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleTestimonialAction(test.id, "delete")}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
