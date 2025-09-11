// src/app/admin/layout.tsx
"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_WIDTH = "w-64"; // 16rem = 256px

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-light)] text-[var(--color-text)]">
      {/* Sidebar (Desktop) */}
      <div
        className={`hidden md:block fixed inset-y-0 left-0 ${SIDEBAR_WIDTH} z-30`}
      >
        <Sidebar isOpen={true} setIsOpen={setSidebarOpen} />
      </div>

      {/* Sidebar (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              className={`fixed inset-y-0 left-0 ${SIDEBAR_WIDTH} z-50`}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header */}
        <header
          className="
            fixed top-0 left-0 right-0 z-40
            h-16 flex items-center justify-between
            px-4 md:px-6
            bg-[var(--color-bg-secondary)]/80 backdrop-blur-md
            border-b border-[var(--color-secondary)]
            shadow-sm
            md:ml-64
          "
        >
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
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

          {/* Right Section */}
          <Button
            className="bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md whitespace-nowrap"
            size="sm"
          >
            <span className="hidden sm:inline">New Action</span>
            <span className="sm:hidden">+</span>
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 mt-6 pt-16">{children}</main>
      </div>
    </div>
  );
}
