"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sparkles, Menu, X, ChevronDown, ArrowRight, Download } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { WindowsIcon, AppleIcon } from "@/app/components/icons/BrandIcons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      label: "Features",
      href: "#features",
      dropdown: [
        { label: "Live Audio Transcription", href: "/features/live-transcription", desc: "Understands questions in real-time." },
        { label: "Resume & JD Alignment", href: "/features/resume-jd-alignment", desc: "Tailor answers to target roles." },
        { label: "Stealth Overlay HUD", href: "/features/stealth-overlay", desc: "Zoom-invisible desktop window." },
      ]
    },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Referrals", href: "#referral-program" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const getHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }
    return href;
  };

  return (
    <motion.header
      id="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-4 left-4 right-4 z-50 transition-[background-color,border-color,box-shadow] duration-300 border max-w-7xl mx-auto ${
        mobileOpen
          ? "rounded-3xl bg-white border-slate-200 shadow-xl"
          : scrolled 
            ? "rounded-full bg-white/95 backdrop-blur-md border-slate-200/80 shadow-md shadow-slate-100/40" 
            : "rounded-full bg-white/70 backdrop-blur-md border-slate-200/40 shadow-xs"
      }`}
    >
      <div className="px-6 py-2.5 md:py-3 flex justify-between items-center w-full">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer select-none"
        >
          <img
            src="/logo.png"
            className="h-10 w-auto select-none object-contain"
            alt="CrackTheLoop Logo Icon"
          />
          <span className="font-bold tracking-tight text-xl md:text-2xl text-(--text-primary)" style={{ fontFamily: "var(--font-display)" }}>
            Crack<span className="text-gradient-coral font-black">TheLoop</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => {
            if (item.dropdown) {
              return (
                <div
                  key={item.label}
                  className="relative group py-2"
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-(--text-muted) hover:text-(--text-primary) transition cursor-pointer select-none">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  
                  {/* Dropdown Wrapper */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 flex flex-col z-50">
                    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl p-3 shadow-lg flex flex-col gap-1.5">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="flex flex-col px-3 py-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-800">{subItem.label}</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">{subItem.desc}</span>
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 mt-1.5 pt-2">
                        <Link
                          href={getHref(item.href)}
                          className="text-[10px] font-bold text-(--accent) hover:underline px-3 flex items-center gap-1 cursor-pointer"
                        >
                          View All Features <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={getHref(item.href)}
                className="text-sm font-medium text-(--text-muted) hover:text-(--text-primary) transition cursor-pointer"
              >
                {item.label}
              </Link>
            );
          })}
          <div className="relative group py-2">
            <button className="btn-primary !py-2 !px-5 !text-sm !rounded-full cursor-pointer flex items-center gap-1.5 select-none">
              <Download className="w-3.5 h-3.5" />
              <span>Download App</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            
            {/* Dropdown Wrapper for Download */}
            <div className="absolute top-full right-0 pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 flex flex-col z-50">
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl p-2 shadow-lg flex flex-col gap-1">
                <Link
                  href={getHref("#platform-picker")}
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      const el = document.getElementById("platform-picker");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition cursor-pointer text-xs font-bold text-slate-800"
                >
                  <WindowsIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Windows (.exe)</span>
                </Link>
                <Link
                  href={getHref("#platform-picker")}
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      const el = document.getElementById("platform-picker");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition cursor-pointer text-xs font-bold text-slate-800"
                >
                  <AppleIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>macOS (.dmg)</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-(--text-primary)" />
          ) : (
            <Menu className="w-5 h-5 text-(--text-primary)" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
        >
          {menuItems.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.label} className="flex flex-col gap-1 py-1">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 px-2 mb-1">
                    {item.label}
                  </span>
                  <div className="flex flex-col gap-2 pl-3 border-l border-slate-200">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="text-sm font-semibold text-slate-700 hover:text-(--accent) py-1.5 cursor-pointer"
                        onClick={() => setMobileOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                    <Link
                      href={getHref(item.href)}
                      className="text-xs font-bold text-(--accent) py-1.5 cursor-pointer"
                      onClick={() => setMobileOpen(false)}
                    >
                      View All Features →
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={getHref(item.href)}
                className="text-sm font-medium text-(--text-primary) py-2 cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-100">
            <Link
              href={getHref("#platform-picker")}
              className="btn-primary !text-sm !rounded-full justify-center cursor-pointer !py-2.5 flex items-center gap-1.5"
              onClick={(e) => {
                setMobileOpen(false);
                if (pathname === "/") {
                  e.preventDefault();
                  const el = document.getElementById("platform-picker");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Download Windows App
            </Link>
            <Link
              href={getHref("#platform-picker")}
              className="btn-ghost-dark !text-sm !rounded-full justify-center cursor-pointer !py-2.5 flex items-center gap-1.5"
              onClick={(e) => {
                setMobileOpen(false);
                if (pathname === "/") {
                  e.preventDefault();
                  const el = document.getElementById("platform-picker");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Download macOS App
            </Link>
          </div>
        </motion.div>
      )}

      {/* Sticky Scroll Progress Bar nested in a rounded wrapper to avoid corner clipping */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-(--accent) origin-left z-20"
          style={{ scaleX }}
        />
      </div>
    </motion.header>
  );
}

