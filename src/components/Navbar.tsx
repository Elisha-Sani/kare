"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
};

const navItems: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "testimonials", label: "Testimonials" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "-100px 0px -40% 0px",
      threshold: Array.from({ length: 11 }, (_, i) => i / 10),
    };

    const observer = new IntersectionObserver((entries) => {
      // 🔥 Always recalc visible sections on every callback
      const visibleSections = entries.filter((entry) => entry.isIntersecting);

      if (visibleSections.length > 0) {
        // Pick the one with the largest intersection ratio
        const mostVisible = visibleSections.reduce((max, entry) =>
          entry.intersectionRatio > max.intersectionRatio ? entry : max
        );

        if (mostVisible.target instanceof HTMLElement) {
          setActive(mostVisible.target.id);
        }
      }
    }, options);

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full backdrop-blur-3xl shadow-md bg-[var(--color-bg-light)] text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl">
          Events By Kare
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`cursor-pointer transition-colors hover:text-[var(--color-primary)] ${
                active === item.id
                  ? "text-[var(--color-primary)] font-semibold"
                  : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#request-event"
          className="hidden md:inline-block px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
        >
          Request an Event
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--color-text)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-[var(--color-bg-secondary)]">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`cursor-pointer transition-colors hover:text-[var(--color-primary)] ${
                active === item.id
                  ? "text-[var(--color-primary)] font-semibold"
                  : ""
              }`}
              onClick={() => setIsOpen(false)} // close on click
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
