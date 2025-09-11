"use client";

import { Card } from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import renderStars from "./RenderStars";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/testimonials?limit=6");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch testimonials");
        }

        const { data } = await response.json();
        setTestimonials(data?.testimonials ?? []);
      } catch (err: unknown) {
        console.error("Failed to fetch testimonials:", err);
        let message = "An error occurred while fetching testimonials";
        if (err instanceof Error) {
          message = err.message || message;
        } else if (typeof err === "string") {
          message = err;
        }
        setError(message);
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 px-6 py-20 bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.h2
          className="text-3xl md:text-4xl text-center mb-14 font-serif font-bold tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Client Testimonials
        </motion.h2>

        {/* Loader */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="p-8 border-0 shadow-sm rounded-2xl bg-white"
              >
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <Skeleton className="h-4 w-1/3" />
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-500 mb-8">{error}</div>
        )}

        {/* Testimonials Grid */}
        {!loading && !error && testimonials.length > 0 && (
          <>
            <div
              className={`grid gap-8 justify-center ${
                testimonials.length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : testimonials.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="p-8 border border-gray-100 shadow-sm rounded-2xl bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                    <div>
                      {renderStars(t.rating)}
                      <p className="italic font-light mb-6 text-gray-700 leading-relaxed line-clamp-5">
                        “{t.comment}”
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-medium text-lg"
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-[var(--color-text)]">
                          {t.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="text-center mt-12 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/testimonials"
                className="inline-block px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium tracking-wide hover:opacity-90 transition-all"
              >
                See All Testimonials
              </Link>
              <Link
                href="/submittestimonial"
                className="inline-block px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium tracking-wide hover:opacity-90 transition-all"
              >
                Leave a Review
              </Link>
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && testimonials.length === 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 mb-8">
              Be the first to share your experience with Events By Kare!
            </p>
            <Link
              href="/submittestimonial"
              className="inline-block px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium tracking-wide hover:opacity-90 transition-all"
            >
              Leave a Review
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
