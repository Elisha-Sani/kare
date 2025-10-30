"use client";

import React from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  const palette = {
    bgSecondary: "var(--color-bg-secondary)",
    text: "var(--color-text)",
  };

  return (
    <footer
      className="px-4 py-16"
      style={{ backgroundColor: palette.bgSecondary }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Brand */}
        <div
          className="text-3xl mb-6 tracking-wide"
          style={{ fontFamily: "Didot, serif" }}
        >
          EVENTS BY KARE
        </div>

        {/* Navigation */}
        <div
          className="flex justify-center space-x-6 md:text-lg text-sm md:space-x-12 mb-8 tracking-wider uppercase"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "400" }}
        >
          <a href="#portfolio" className="hover:opacity-70 transition-opacity">
            Portfolio
          </a>
          <a href="#services" className="hover:opacity-70 transition-opacity">
            Services
          </a>
          <a href="#press" className="hover:opacity-70 transition-opacity">
            Press
          </a>
          <a
            href="#request-event"
            className="hover:opacity-70 transition-opacity"
          >
            Request Event
          </a>
        </div>

        {/* Contact Info */}
        <div
          className="space-y-2 mb-8 text-sm opacity-80"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}
        >
          <p>
            Email:{" "}
            <a
              href="mailto:eventsbykare@gmail.com"
              className="hover:opacity-70"
            >
              eventsbykare@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="" className="hover:opacity-70">
              +2540000000
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="#"
            aria-label="Instagram"
            className="hover:opacity-70 transition-opacity"
          >
            <Instagram size={24} />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="hover:opacity-70 transition-opacity"
          >
            <Facebook size={24} />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="hover:opacity-70 transition-opacity"
          >
            <Linkedin size={24} />
          </a>
        </div>

        {/* Copyright */}
        <p
          className="opacity-70 tracking-wide"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}
        >
          © {new Date().getFullYear()} Events By Kare. Elevating experiences.
        </p>
      </div>
    </footer>
  );
}
