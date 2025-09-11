"use client";

import { useState, useEffect, useRef } from "react";
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
    phone: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus(); // Auto-focus first input
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.comment.trim()) newErrors.comment = "Comment is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct the highlighted fields.");
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
      if (!response.ok)
        throw new Error(data.error || "Failed to submit testimonial");

      toast.success(
        data.data?.message || "Testimonial submitted successfully!"
      );
      setFormData({ name: "", email: "", comment: "", rating: 5, phone: "" });
      setErrors({});
    } catch (error: unknown) {
      console.error("Submit error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit testimonial. Try again.";
      toast.error(message);
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
        <h2 className="text-3xl md:text-4xl tracking-wide mb-6 font-serif font-bold">
          Share Your Experience
        </h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed font-sans">
          We&apos;d love to hear about your event experience. Your testimonial
          helps us continue creating exceptional moments for our clients.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-10 border-0 shadow-xl rounded-2xl bg-[var(--color-bg-light)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Input
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className={`rounded-md border-0 shadow-md py-4 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  ref={nameInputRef}
                  required
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className={`rounded-md border-0 shadow-md py-4 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <Input
              name="phone"
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="rounded-md border-0 shadow-md py-4"
            />

            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Rating *</label>
              <div className="flex gap-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="transition-transform hover:scale-110 duration-200 focus:outline-none"
                    aria-label={`${star} Star${star > 1 ? "s" : ""}`}
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
            <div className="flex flex-col">
              <Textarea
                name="comment"
                placeholder="Share your experience... *"
                value={formData.comment}
                onChange={handleChange}
                className={`rounded-md border-0 min-h-[120px] shadow-md ${
                  errors.comment ? "border-red-500" : ""
                }`}
                required
              />
              {errors.comment && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.comment}
                </span>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-5 text-white rounded-md bg-[var(--color-primary)] hover:opacity-90 transition-all font-medium tracking-wide uppercase"
            >
              {loading ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
