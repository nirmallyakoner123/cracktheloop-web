"use client";

import { ArrowRight, Shield, Users, Sparkles, Star } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CtaFooter() {
  const pathname = usePathname();

  const getHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }
    return href;
  };

  const productLinks = [
    { label: "Pricing & Plans", href: "/pricing" },
    { label: "Demo Simulator", href: "/demo" },
    { label: "Live Audio Transcription", href: "/features/live-transcription" },
    { label: "Resume & JD Alignment", href: "/features/resume-jd-alignment" },
    { label: "Stealth Overlay HUD", href: "/features/stealth-overlay" },
  ];

  const platformLinks = [
    { label: "Web Copilot", href: "/pricing" },
    { label: "Windows Desktop App (.exe)", href: "#platform-picker" },
    { label: "macOS Desktop App (.dmg)", href: "#platform-picker" },
    { label: "Referral Program (Give 20%, Get 50%)", href: "#referral-program" },
  ];

  const resourcesLegalLinks = [
    { label: "Contact Support", href: "/contact" },
    { label: "Ethics Charter", href: "/#ethics" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Responsible Use Policy", href: "/responsible-use" },
  ];

  return (
    <section id="cta-footer" className="relative flex flex-col justify-between overflow-hidden">
      {/* CTA Block - Light Theme */}
      <div className="section-mist relative overflow-hidden">
        {/* Background orbs */}
        <div className="orb orb-peach w-[600px] h-[600px] -top-40 left-1/4 animate-float-orb" />
        <div className="orb orb-slate w-[400px] h-[400px] bottom-0 -right-20 animate-float-orb-slow" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 py-24 md:py-32">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2
                className="text-3xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-(--text-primary) mb-6 leading-[1.12]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your Next Interview Could{" "}
                <span className="text-gradient-coral">Happen This Week.</span>
              </h2>
              <p className="text-(--text-muted) text-base md:text-lg mb-4 max-w-xl mx-auto leading-relaxed">
                Get 15 free credits the moment you sign up. No credit card. One full mock session included - set up in under 3 minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Link
                  href="/pricing"
                  className="btn-primary-glow cursor-pointer !py-4 !px-8 !rounded-lg !text-base"
                >
                  Start Free (15 Credits Included)
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="btn-ghost-light cursor-pointer bg-white !py-4 !px-8 !rounded-lg !text-base !font-semibold"
                >
                  Watch Demo First
                </Link>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-(--text-muted) font-medium">
                <span>✓ No card required</span>
                <span>✓ Setup in 3 min</span>
                <span>✓ Works on Zoom, Teams & Meet</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Footer - remains light */}
      <footer className="border-t border-(--border-light) py-16 bg-(--bg-mist)/90 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
            {/* Logo and Tagline Column */}
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer select-none"
              >
                <img
                  src="/logo.png"
                  className="h-9 w-auto select-none object-contain"
                  alt="CrackTheLoop Logo Icon"
                />
                <span className="font-bold tracking-tight text-lg md:text-xl text-(--text-primary)" style={{ fontFamily: "var(--font-display)" }}>
                  Crack<span className="text-gradient-coral font-black">TheLoop</span>
                </span>
              </Link>
              <p className="text-sm text-(--text-muted) leading-relaxed max-w-xs">
                CrackTheLoop is the ultimate real-time confidence companion for technical interviews. Tailor answers, transcribe audio live, and stay perfectly aligned with target roles, privately.
              </p>
              {/* <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs uppercase tracking-wider">Privacy Guard Active</span>
              </div> */}
            </div>

            {/* Column 2: Product */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Product</span>
              <div className="flex flex-col gap-2">
                {productLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={getHref(link.href)}
                    className="text-sm text-(--text-muted) hover:text-(--text-primary) transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Platforms & Apps */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Platforms & Apps</span>
              <div className="flex flex-col gap-2">
                {platformLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={getHref(link.href)}
                    onClick={(e) => {
                      if (link.href.startsWith("#") && pathname === "/") {
                        e.preventDefault();
                        const el = document.getElementById(link.href.substring(1));
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-sm text-(--text-muted) hover:text-(--text-primary) transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 4: Resources & Legal */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Resources & Legal</span>
              <div className="flex flex-col gap-2">
                {resourcesLegalLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={getHref(link.href)}
                    onClick={(e) => {
                      const hashIndex = link.href.indexOf("#");
                      const hash = hashIndex !== -1 ? link.href.substring(hashIndex + 1) : "";
                      if (hash && pathname === "/") {
                        e.preventDefault();
                        const el = document.getElementById(hash);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-sm text-(--text-muted) hover:text-(--text-primary) transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-(--border-light) pt-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-sm text-(--text-muted) font-medium">
                © 2026 CrackTheLoop. All rights reserved.
              </span>
              {/* <span className="flex items-center gap-1.5 text-(--text-secondary) text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Privacy Engine: Active & Secured
              </span> */}
            </div>

            {/* <div className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-4.5 text-left">
              <p className="text-xs text-(--text-muted) max-w-4xl leading-relaxed">
                <strong className="text-slate-700 font-semibold">Disclaimer & Responsible Use:</strong> CrackTheLoop is designed exclusively for interview prep, mock simulations, coding confidence, and communication practice. All users are expected to verify rules, policies, and honor codes of their target recruiting environments before utilization during live examinations.
              </p>
            </div> */}
          </div>
        </div>
      </footer>
    </section>
  );
}
