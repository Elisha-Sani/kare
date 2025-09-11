"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/testimonials?page=${page}&limit=9`);
        const json = await res.json();
        if (!mounted) return;
        setTestimonials(json.data?.testimonials ?? []);
        setTotalPages(json.data?.pagination?.totalPages ?? 1);
      } catch (err) {
        // optionally show toast
        console.error("Failed to load testimonials", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [page]);

  const renderStars = (rating: number) => (
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={18}
          className={
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        What Our Clients Say
      </h1>

      {/* Testimonials grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/4" />
            </Card>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <p className="text-center text-gray-600">
          No testimonials yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              {renderStars(t.rating)}
              <p className="italic mb-4">&quot;{t.comment}&quot;</p>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(t.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-12">
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
    </section>
  );
}
