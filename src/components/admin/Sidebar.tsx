// src/components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/requests", label: "Requests", icon: ClipboardList },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-secondary)] transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-secondary)]">
          <h1 className="text-lg font-bold tracking-wide text-[var(--color-text)]">
            Admin Panel
          </h1>
          <button
            aria-label="Close sidebar"
            className="md:hidden text-[var(--color-text)] hover:opacity-80"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-[var(--color-secondary)]">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2 justify-center text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
