"use client";

import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
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
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, testRes] = await Promise.all([
        fetch("/api/admin/requests").then((r) => r.json()),
        fetch("/api/admin/testimonials").then((r) => r.json()),
      ]);
      setRequests(reqRes);
      setTestimonials(testRes);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Approve or delete
  const handleAction = async (
    type: "request" | "testimonial",
    id: string,
    action: "approve" | "delete"
  ) => {
    try {
      await fetch(`/api/admin/${type}/${id}`, {
        method: action === "approve" ? "PATCH" : "DELETE",
      });
      toast.success(`${type} ${action}d successfully`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto space-y-16">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-8">
        Admin Dashboard
      </h1>

      {/* Event Requests */}
      <section>
        <h2 className="text-2xl font-serif mb-4">Event Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No event requests yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-6 border rounded-md shadow hover:shadow-lg transition"
              >
                <p>
                  <strong>
                    {req.firstName} {req.lastName}
                  </strong>{" "}
                  ({req.email})
                </p>
                <p>Type: {req.eventType}</p>
                {req.message && <p>Message: {req.message}</p>}
                <p>Approved: {req.approved ? "Yes" : "No"}</p>
                <div className="flex gap-4 mt-4">
                  {!req.approved && (
                    <Button
                      size="sm"
                      onClick={() => handleAction("request", req.id, "approve")}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleAction("request", req.id, "delete")}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-2xl font-serif mb-4">Testimonials</h2>
        {loading ? (
          <p>Loading...</p>
        ) : testimonials.length === 0 ? (
          <p>No testimonials yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 border rounded-md shadow hover:shadow-lg transition"
              >
                <p>
                  <strong>{t.name}</strong> - Rating: {t.rating}/5
                </p>
                <p>{t.comment}</p>
                <p>Approved: {t.approved ? "Yes" : "No"}</p>
                <div className="flex gap-4 mt-4">
                  {!t.approved && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleAction("testimonial", t.id, "approve")
                      }
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleAction("testimonial", t.id, "delete")}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
