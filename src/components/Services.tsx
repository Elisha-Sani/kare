"use client";

import { Card } from "./ui/card";
import { Sparkles, Award, Zap } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Luxury Events",
    desc: "High-end experiences crafted with editorial sophistication.",
  },
  {
    icon: Award,
    title: "Corporate Galas",
    desc: "Professional excellence brought to life with cutting-edge design.",
  },
  {
    icon: Zap,
    title: "Fashion Events",
    desc: "Runway-inspired celebrations and unforgettable launches.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-24 px-4 py-20 bg-[var(--color-bg-light)] text-[var(--color-text)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl text-center mb-16 tracking-wide font-serif">
          Signature Services
        </h2>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, i) => (
            <Card
              key={i}
              className="p-10 text-center border-0 shadow-md rounded-sm hover:shadow-2xl hover:-translate-y-1 bg-[var(--color-bg-secondary)] transition-all duration-300"
            >
              {/* Icon */}
              <service.icon className="w-12 h-12 mx-auto mb-6 text-[var(--color-primary)]" />

              {/* Title */}
              <h3 className="text-xl mb-4 tracking-wide font-serif">
                {service.title}
              </h3>

              {/* Description */}
              <p className="tracking-wide font-light font-sans">
                {service.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
