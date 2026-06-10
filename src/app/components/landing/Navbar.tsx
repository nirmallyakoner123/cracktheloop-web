"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Sparkles, Menu, X, ChevronDown, ArrowRight, Download, Gift } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { WindowsIcon, AppleIcon } from "@/app/components/icons/BrandIcons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const pathname = usePathname();

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  useEffect(() => {
    if (getCookie("ctl_banner_dismissed") !== "true") {
      setBannerOpen(true);
    }
  }, []);

  const dismissBanner = () => {
    setBannerOpen(false);
    document.cookie = "ctl_banner_dismissed=true; path=/; max-age=604800; SameSite=Lax";
  };

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
    <>
      <AnimatePresence>
        {bannerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -48 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 h-12 bg-slate-50/95 border-b border-slate-200/80 z-55 flex items-center justify-between px-4 sm:px-6 select-none shadow-xs"
          >
            <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-xs md:text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Gift className="w-4 h-4 text-[#E8503A] shrink-0" />
                <span className="hidden sm:inline font-medium text-slate-600">
                  <strong>Launch Offer:</strong> First 100 signups get <strong className="text-slate-900">50 free credits</strong> + <strong className="text-slate-900">20% purchase bonus</strong> on referral. Only <strong className="text-[#E8503A] font-extrabold">18 spots left</strong> today!
                </span>
                <span className="inline sm:hidden font-medium text-slate-650">
                  <strong>First 100:</strong> Get <strong className="text-slate-900">50 free credits</strong>! (<strong className="text-[#E8503A] font-extrabold">18 left</strong>)
                </span>
              </div>
              <Link
                href="/login?mode=signup&plan=Free%20Trial"
                className="relative inline-flex items-center gap-1 bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 active:scale-95 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-md transition-all duration-200 group/btn border border-slate-900 whitespace-nowrap ml-1 cursor-pointer"
              >
                Claim Credits
                <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
            <button
              onClick={dismissBanner}
              className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-full hover:bg-slate-200/60 ml-2"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        id="navbar"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, top: bannerOpen ? "64px" : "16px" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed left-4 right-4 z-50 transition-[background-color,border-color,box-shadow,top] duration-300 border max-w-7xl mx-auto ${
          mobileOpen
            ? "rounded-3xl bg-white border-slate-200 shadow-xl"
            : scrolled 
              ? "rounded-full bg-white/95 backdrop-blur-md border-slate-200/80 shadow-md shadow-slate-100/40" 
              : "rounded-full bg-white/70 backdrop-blur-md border-slate-200/40 shadow-xs"
        }`}
      >
      <div className="px-6 py-2 md:py-1 flex justify-between items-center w-full">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer select-none"
        >
          <img
            src="/logo.png"
            className="h-8 w-auto select-none object-contain"
            alt="CrackTheLoop Logo Icon"
          />
          <span className="font-bold tracking-tight text-xl md:text-2xl text-(--text-primary)" style={{ fontFamily: "var(--font-display)" }}>
            Crack<span className="text-gradient-coral font-black">TheLoop</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={getHref(item.href)}
              className="text-sm font-medium text-(--text-muted) hover:text-(--text-primary) transition cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
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
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={getHref(item.href)}
              className="text-sm font-medium text-(--text-primary) py-2 cursor-pointer"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
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
    </>
  );
}

