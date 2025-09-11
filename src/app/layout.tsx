// src/app/layout.tsx
import "./globals.css";
import { Toaster } from "sonner";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events By Kare",
  description:
    "Events with runway elegance - sophisticated experiences with style, precision, and unforgettable details.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--color-bg-light)] text-[var(--color-text)]">
        {/* Wrap only inside body */}
        <ClerkProvider>
          {/* Global Header */}
          <header className="flex justify-between items-center px-6 py-4 shadow-lg bg-[var(--color-bg-light)]">
            <h1 className="text-lg font-semibold tracking-wide text-[var(--color-text)]">
              Events By Kare
            </h1>

            <div className="flex items-center gap-4">
              {/* Show when NOT signed in */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-md text-white bg-[var(--color-primary)] hover:opacity-90 transition">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              {/* Show when signed in */}
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>

          {/* Toast Notifications */}
          <Toaster position="top-right" expand={true} richColors closeButton />
        </ClerkProvider>
      </body>
    </html>
  );
}
