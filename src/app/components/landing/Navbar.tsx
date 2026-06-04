"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      id="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer select-none"
        >
          <img
            src="/logo-horizontal-dark.svg"
            className="h-10 w-auto select-none"
            alt="CrackTheLoop Logo"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Demo", "Pricing"].map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
            >
              {link}
            </a>
          ))}
          <a
            href="/copilot"
            className="btn-primary !py-2.5 !px-6 !text-sm !rounded-full cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            Launch Copilot
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-[var(--text-primary)]" />
          ) : (
            <Menu className="w-5 h-5 text-[var(--text-primary)]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-light mx-4 mb-4 rounded-2xl p-6 flex flex-col gap-4"
        >
          {["Features", "Demo", "Pricing"].map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-sm font-medium text-[var(--text-primary)] py-2 cursor-pointer"
            >
              {link}
            </a>
          ))}
          <a href="/copilot" className="btn-primary !text-sm !rounded-full justify-center cursor-pointer">
            <Globe className="w-3.5 h-3.5" />
            Launch Copilot
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
