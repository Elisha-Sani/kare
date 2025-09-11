"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";

/**
 * Safely extract an email string from Clerk's `user` object.
 * We accept `unknown` and use runtime narrowing to avoid `any`.
 */
function extractEmailFromClerkUser(u: unknown): string | null {
  if (!u || typeof u !== "object") return null;
  const obj = u as Record<string, unknown>;

  // primaryEmailAddress?.emailAddress
  const primary = obj.primaryEmailAddress;
  if (primary && typeof primary === "object") {
    const prim = primary as Record<string, unknown>;
    const email = prim.emailAddress;
    if (typeof email === "string") return email;
  }

  // emailAddresses[0]?.emailAddress
  const emails = obj.emailAddresses;
  if (Array.isArray(emails) && emails.length > 0) {
    const first = emails[0];
    if (first && typeof first === "object") {
      const firstObj = first as Record<string, unknown>;
      const email = firstObj.emailAddress;
      if (typeof email === "string") return email;
    }
  }

  // fallback: user.email (some Clerk versions)
  if (typeof obj.email === "string") return obj.email;

  return null;
}

export default function RequestEvent() {
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    eventType: "",
    details: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const firstNameRef = useRef<HTMLInputElement>(null);

  // Auto-focus first input
  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  // When Clerk `user` becomes available/changes, hydrate the form with Clerk values
  useEffect(() => {
    if (!user) return;

    const emailFromClerk = extractEmailFromClerkUser(user);
    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName ?? prev.firstName,
      lastName: user.lastName ?? prev.lastName,
      // only overwrite email if Clerk provides one; otherwise keep existing (or empty)
      email: emailFromClerk ?? prev.email,
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.eventType.trim())
      newErrors.eventType = "Event type is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to submit request");

      toast.success("Request submitted successfully! We'll contact you soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        eventType: "",
        details: "",
      });
      setErrors({});
    } catch (error: unknown) {
      console.error("Submit error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again.";
      toast.error(message);
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
        <h2 className="text-3xl md:text-4xl tracking-wide mb-6 font-serif font-bold">
          Request an Event Consultation
        </h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed font-sans">
          Tell us about your vision and event requirements. Our team will review
          your request and connect with you to craft an unforgettable
          experience.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-10 border-0 shadow-xl rounded-2xl bg-[var(--color-bg-secondary)]">
          <SignedIn>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First & Last Name */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Input
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleChange}
                    ref={firstNameRef}
                    className={`rounded-sm border-0 shadow-md py-6 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="rounded-sm border-0 shadow-md py-6"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className={`rounded-sm border-0 shadow-md py-6 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  required
                  readOnly
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Event Type */}
              <div className="flex flex-col">
                <Input
                  name="eventType"
                  placeholder="Event Type (e.g. Wedding, Conference...) *"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`rounded-sm border-0 shadow-md py-6 ${
                    errors.eventType ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.eventType && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.eventType}
                  </span>
                )}
              </div>

              {/* Event Details */}
              <div className="flex flex-col">
                <Textarea
                  name="details"
                  placeholder="Describe your vision and requirements..."
                  value={formData.details}
                  onChange={handleChange}
                  className="rounded-sm border-0 shadow-md min-h-40 py-4"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-white rounded-sm bg-[var(--color-primary)] hover:opacity-90 transition-all tracking-wider uppercase"
              >
                {loading ? "Submitting..." : "Request Consultation"}
              </Button>
            </form>
          </SignedIn>

          <SignedOut>
            <p>Please sign in to request an event.</p>
            <SignInButton mode="modal">
              <button className="px-3 py-1 bg-[var(--color-primary)] text-white rounded">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </Card>
      </div>
    </section>
  );
}
