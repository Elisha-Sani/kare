"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

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

  const { user } = useUser(); // <-- useUser hook
  const isAdmin = user?.publicMetadata.role === "admin";

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "-100px 0px -40% 0px",
      threshold: Array.from({ length: 11 }, (_, i) => i / 10),
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries.filter((entry) => entry.isIntersecting);
      if (visibleSections.length > 0) {
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
    <nav className="fixed top-0 left-0 z-50 w-full backdrop-blur-lg shadow-md bg-white/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo2.png"
            alt="Events By Kare"
            width={180}
            height={60}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
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

          {isAdmin && (
            <Link
              href="/admin"
              className="text-blue-500 text-lg pl-3 font-semibold hover:text-blue-700"
            >
              See Admin Page
            </Link>
          )}
        </div>

        {/* Right CTA and User */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#request-event"
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
          >
            Request an Event
          </a>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
            >
              Sign In
            </Link>
          </SignedOut>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--color-text)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 shadow-lg flex flex-col gap-4 px-6 py-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`cursor-pointer transition-colors hover:text-[var(--color-primary)] ${
                active === item.id
                  ? "text-[var(--color-primary)] font-semibold"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className="text-[var(--color-primary)] font-semibold hover:text-[var(--color-secondary)]"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}

          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </SignedOut>

          <a
            href="#request-event"
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
            onClick={() => setIsOpen(false)}
          >
            Request an Event
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
