"use client";

import { Card } from "./ui/card";

const testimonials = [
  {
    name: "Jane Doe",
    role: "Fashion Influencer",
    feedback:
      "The team brought my vision to life in a way I never imagined possible. Truly unforgettable.",
  },
  {
    name: "Michael Smith",
    role: "CEO, EventCorp",
    feedback:
      "Professional, creative, and flawless execution. Our gala was a huge success thanks to them.",
  },
  {
    name: "Aisha Khan",
    role: "Luxury Brand Manager",
    feedback:
      "Their sense of detail and creativity elevated our product launch to a world-class level.",
  },
];

export default function Testimonials() {
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
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, i) => (
            <Card
              key={i}
              className="p-8 border-0 shadow-md rounded-sm bg-[var(--color-bg-light)] hover:shadow-lg transition-all duration-300"
            >
              <p className="italic font-light mb-6">“{testimonial.feedback}”</p>
              <h3 className="font-serif text-lg tracking-wide">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
