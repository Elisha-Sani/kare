"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function RequestEvent() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    eventType: "",
    details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!formData.firstName || !formData.email || !formData.eventType) {
      toast("Missing fields ⚠️", {
        description:
          "Please fill in at least First Name, Email, and Event Type.",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Placeholder for backend API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      toast("Request submitted 🎉", {
        description: "Our team will contact you shortly to discuss your event.",
      });

      // ✅ Clear form after success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        eventType: "",
        details: "",
      });
    } catch (err) {
      console.error(err);
      toast("Something went wrong ❌", {
        description: "Please try again later or contact us directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="request-event"
      className="px-4 py-20 bg-[var(--color-bg-light)] scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2
          className="text-3xl md:text-4xl tracking-wide mb-6"
          style={{ fontFamily: "Didot, serif" }}
        >
          Request an Event Consultation
        </h2>
        <p
          className="text-base md:text-lg text-gray-600 leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Tell us about your vision and event requirements. Our team will review
          your request and connect with you to craft an unforgettable
          experience.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card
          className="p-10 border-0 shadow-xl rounded-sm"
          style={{ backgroundColor: "var(--color-bg-secondary)" }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First & Last Name */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleChange}
                className="rounded-sm border-0 shadow-md py-6"
                style={{
                  backgroundColor: "var(--color-bg-light)",
                  fontFamily: "Montserrat, sans-serif",
                }}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="rounded-sm border-0 shadow-md py-6"
                style={{
                  backgroundColor: "var(--color-bg-light)",
                  fontFamily: "Montserrat, sans-serif",
                }}
              />
            </div>

            {/* Email */}
            <Input
              name="email"
              placeholder="Email Address *"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-sm border-0 shadow-md py-6"
              style={{
                backgroundColor: "var(--color-bg-light)",
                fontFamily: "Montserrat, sans-serif",
              }}
            />

            {/* Event Type */}
            <Input
              name="eventType"
              placeholder="Event Type (e.g. Wedding, Conference...) *"
              value={formData.eventType}
              onChange={handleChange}
              className="rounded-sm border-0 shadow-md py-6"
              style={{
                backgroundColor: "var(--color-bg-light)",
                fontFamily: "Montserrat, sans-serif",
              }}
            />

            {/* Event Details */}
            <Textarea
              name="details"
              placeholder="Describe your vision and requirements..."
              value={formData.details}
              onChange={handleChange}
              className="rounded-sm border-0 min-h-40 shadow-md"
              style={{
                backgroundColor: "var(--color-bg-light)",
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
              {loading ? "Submitting..." : "Request Consultation"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
