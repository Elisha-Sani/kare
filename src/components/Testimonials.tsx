"use client";

import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

// Fallback testimonials if database is empty or unavailable
const fallbackTestimonials = [
  {
    id: "1",
    name: "Jane Doe",
    comment:
      "The team brought my vision to life in a way I never imagined possible. Truly unforgettable.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Michael Smith",
    comment:
      "Professional, creative, and flawless execution. Our gala was a huge success thanks to them.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Aisha Khan",
    comment:
      "Their sense of detail and creativity elevated our product launch to a world-class level.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Keep fallback testimonials
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section
        id="testimonials"
        className="scroll-mt-24 px-4 py-20 bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-16 tracking-wide font-serif">
            Client Testimonials
          </h2>
          <div className="text-center">
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 px-4 py-20 bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl text-center mb-16 tracking-wide font-serif">
          Client Testimonials
        </h2>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.slice(0, 6).map((testimonial) => (
              <Card
                key={testimonial.id}
                className="p-8 border-0 shadow-md rounded-sm bg-[var(--color-bg-light)] hover:shadow-lg transition-all duration-300"
              >
                {renderStars(testimonial.rating)}
                <p className="italic font-light mb-6 text-gray-700 leading-relaxed">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div>
                  <h3 className="font-serif text-lg tracking-wide text-[var(--color-text)]">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-8">
              Be the first to share your experience with Events By Kare!
            </p>
            <a
              href="#testimonial-form"
              className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-sm hover:opacity-90 transition-all tracking-wider uppercase font-medium"
            >
              Leave a Review
            </a>
          </div>
        )}

        {/* Show more link if there are many testimonials */}
        {testimonials.length > 6 && (
          <div className="text-center mt-12">
            <p className="text-gray-600">And many more satisfied clients...</p>
          </div>
        )}
      </div>
    </section>
  );
}
