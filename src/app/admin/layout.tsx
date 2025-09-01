// src/app/admin/layout.tsx
"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-light)] text-[var(--color-text)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full bg-[var(--color-bg-secondary)] border-b border-[var(--color-secondary)] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm">
          {/* Left Section: Mobile Menu + Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              aria-label="Open sidebar"
              className="md:hidden text-[var(--color-text)] hover:opacity-80"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <h2 className="text-base md:text-lg font-semibold tracking-wide">
              Admin Dashboard
            </h2>
          </div>

          {/* Right Section: Action Button */}
          <Button
            className="bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md whitespace-nowrap"
            size="sm"
          >
            <span className="hidden sm:inline">New Action</span>
            <span className="sm:hidden">+</span>
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
