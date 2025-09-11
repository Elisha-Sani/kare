"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // ✅ Sonner toast

type Testimonial = {
  id: number;
  name: string;
  email?: string;
  comment: string;
  rating: number;
  status: string;
  createdAt: string;
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "9",
          approved: "false", // admin mode
        });
        if (statusFilter !== "ALL") query.set("status", statusFilter);

        const res = await fetch(`/api/testimonials?${query}`);
        if (!res.ok) throw new Error("Failed to fetch testimonials");

        const json = await res.json();
        setTestimonials(json.data?.testimonials ?? []);
        setTotalPages(json.data?.pagination?.totalPages ?? 1);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [statusFilter, page]);

  // Update status
  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
      if (selected?.id === id) setSelected({ ...selected, status });

      toast.success(`Marked as ${status}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Badge colors
  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Testimonials</h1>

        {/* Filter dropdown */}
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Testimonials grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/4" />
            </Card>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <p>No testimonials found for this filter.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="p-4 space-y-2 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelected(t)}
            >
              <h2 className="text-lg font-semibold">{t.name}</h2>
              {t.email && <p className="text-sm text-gray-600">{t.email}</p>}
              <p className="line-clamp-3">{t.comment}</p>
              <p>⭐ {t.rating}</p>
              <Badge className={statusColor(t.status)}>{t.status}</Badge>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  disabled={updatingId === t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(t.id, "APPROVED");
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={updatingId === t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(t.id, "REJECTED");
                  }}
                  className="bg-red-400 hover:bg-red-500 text-white"
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="self-center">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          <p className="mb-2">{selected?.email}</p>
          <p className="mb-4">{selected?.comment}</p>
          <p className="mb-2">⭐ {selected?.rating}</p>
          <Badge className={statusColor(selected?.status ?? "")}>
            {selected?.status}
          </Badge>
        </DialogContent>
      </Dialog>
    </div>
  );
}
