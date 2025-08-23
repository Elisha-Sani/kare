"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="px-4 py-20 md:py-32 min-h-[80vh] flex items-center bg-[var(--color-bg-light)] text-[var(--color-text)]"
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl mb-6 leading-relaxed tracking-wide font-serif">
          Events With Runway Elegance
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed tracking-wide font-sans">
          We curate sophisticated experiences with style, precision, and
          unforgettable details.
        </p>

        {/* CTA */}
        <Link href="#request" scroll={false}>
          <Button className="px-10 py-4 rounded-sm text-white bg-[var(--color-primary)] hover:opacity-90 tracking-wider transition-all uppercase font-medium">
            Discover Our Style
          </Button>
        </Link>
      </div>
    </section>
  );
}
