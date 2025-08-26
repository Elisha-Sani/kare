"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Star } from "lucide-react";

export default function TestimonialForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    rating: 5,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.comment) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit testimonial");
      }

      toast.success(data.message || "Testimonial submitted successfully!");

      setFormData({
        name: "",
        email: "",
        comment: "",
        rating: 5,
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="px-4 py-20 bg-[var(--color-bg-secondary)]"
      id="testimonial-form"
    >
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2
          className="text-3xl md:text-4xl tracking-wide mb-6"
          style={{ fontFamily: "Didot, serif" }}
        >
          Share Your Experience
        </h2>
        <p
          className="text-base md:text-lg text-gray-600 leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          We&apos;d love to hear about your event experience. Your testimonial
          helps us continue creating exceptional moments for our clients.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card
          className="p-10 border-0 shadow-xl rounded-sm"
          style={{ backgroundColor: "var(--color-bg-light)" }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name and Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className="rounded-sm border-0 shadow-md py-6"
                style={{
                  backgroundColor: "var(--color-bg-secondary)",
                  fontFamily: "Montserrat, sans-serif",
                }}
              />
              <Input
                name="email"
                placeholder="Email Address *"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-sm border-0 shadow-md py-6"
                style={{
                  backgroundColor: "var(--color-bg-secondary)",
                  fontFamily: "Montserrat, sans-serif",
                }}
              />
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <label
                className="block text-sm font-medium"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="transition-colors hover:scale-110 duration-200"
                  >
                    <Star
                      size={32}
                      className={
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <Textarea
              name="comment"
              placeholder="Share your experience with us... *"
              value={formData.comment}
              onChange={handleChange}
              className="rounded-sm border-0 min-h-40 shadow-md"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                fontFamily: "Montserrat, sans-serif",
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-white rounded-sm hover:opacity-90 transition-all tracking-wider uppercase"
              style={{
                backgroundColor: "var(--color-primary)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "500",
                letterSpacing: "1px",
              }}
            >
              {loading ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
