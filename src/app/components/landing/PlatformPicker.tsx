"use client";
 
import { useState } from "react";
import { Globe, Download, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import Link from "next/link";
import { WindowsIcon, AppleIcon } from "@/app/components/icons/BrandIcons";
 
export default function PlatformPicker() {
  const [activePlatform, setActivePlatform] = useState<"web" | "windows" | "mac">("windows");
  const [macWaitlistOpen, setMacWaitlistOpen] = useState(false);
  const [macEmail, setMacEmail] = useState("");
  const [macSuccess, setMacSuccess] = useState(false);
 
  const platforms = [
    {
      id: "web" as const,
      name: "Web Copilot",
      icon: Globe,
      tag: "Instant Access",
      color: "bg-slate-100 text-slate-700 border border-slate-200",
      description: "Launch instantly in your browser without downloading anything. Evaluates your coding and system design skills on the fly.",
      features: [
        "Zero setup - starts in under 60 seconds",
        "Works on any device with Chrome, Edge, or Brave",
        "Ideal for quick evaluation and practice sessions",
        "Standard low-latency voice capture"
      ],
      ctaText: "Start Web Copilot",
      ctaLink: "/copilot",
      isDownload: false
    },
    {
      id: "windows" as const,
      name: "Windows Desktop App",
      icon: WindowsIcon,
      tag: "Flagship Stealth",
      color: "bg-(--accent-soft) text-(--accent) border border-(--accent)/20",
      description: "Our flagship desktop application. Deep system-level security integration delivers 100% invisible stealth overlay and local-first privacy.",
      features: [
        "Zoom, Teams, & Google Meet invisibility (Stealth HUD)",
        "Advanced WASAPI loopback audio capture",
        "High-performance native processing engine",
        "Zero audio driver footprints detected on device"
      ],
      ctaText: "For Windows (.exe)",
      ctaLink: "/cracktheloop-desktop_0.1.0_x64-setup.exe",
      isDownload: true
    },
    {
      id: "mac" as const,
      name: "Mac Desktop App",
      icon: AppleIcon,
      tag: "Native App",
      color: "bg-slate-100 text-slate-700 border border-slate-200",
      description: "Fully optimized for macOS. Natively compiled for Apple M1/M2/M3 chips and Intel processors with modern Metal graphics rendering.",
      features: [
        "System-wide hotkeys and overlay controls",
        "CoreAudio system integration (no audio leak)",
        "Ultra-low memory footprint (<45MB RAM)",
        "Supports dual-screen and sidecar setups"
      ],
      ctaText: "For macOS (.dmg)",
      ctaLink: "#",
      isDownload: true
    }
  ];

  const handleCtaClick = (e: React.MouseEvent, platformId: "web" | "windows" | "mac", link: string) => {
    if (platformId === "mac") {
      e.preventDefault();
      setMacWaitlistOpen(true);
    }
  };
 
  return (
    <section id="platform-picker" className="section-mist relative py-14 md:py-16 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="orb orb-peach w-[500px] h-[500px] -top-20 -left-20 opacity-40 pointer-events-none animate-float-orb" />
      <div className="orb orb-slate w-[400px] h-[400px] -bottom-20 -right-20 opacity-30 pointer-events-none animate-float-orb-slow" />
 
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
 
      <div className="max-w-7xl mx-auto px-6 relative z-10">
 
        {/* Section Title */}
        <ScrollReveal>
          <div className="text-center mb-10 flex flex-col items-center">
 
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary) max-w-3xl leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              One Product. <span className="text-gradient-coral">Every Platform</span> You Use.
            </h2>
            <p className="text-(--text-muted) text-base max-w-xl mt-3 leading-relaxed">
              CrackTheLoop works wherever you do. Choose the web copilot for instant access, or download the desktop app for ironclad stealth privacy.
            </p>
          </div>
        </ScrollReveal>
 
        {/* 3 Cards */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isFeatured = platform.id === activePlatform;
 
              return (
                <div
                  key={platform.id}
                  onClick={() => setActivePlatform(platform.id)}
                  className={`bg-white/85 backdrop-blur-md border rounded-[12px] p-6 md:p-8 flex flex-col justify-between shadow-xs transition-all duration-300 relative cursor-pointer select-none group ${isFeatured
                      ? "border-(--accent) shadow-md bg-white"
                      : "border-(--border-light) hover:border-(--accent)/40 hover:-translate-y-1.5 hover:shadow-md"
                    }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-700 transition-colors duration-300 ${isFeatured ? "border-(--accent) text-(--accent) bg-(--accent-soft)" : "group-hover:border-(--accent)/40 group-hover:text-(--accent)"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${isFeatured ? "bg-(--accent-soft) text-(--accent) border border-(--accent)/20" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                        {platform.tag}
                      </span>
                    </div>
 
                    <h3 className="text-lg font-bold text-(--text-primary) group-hover:text-(--accent) transition-all duration-300" style={{ fontFamily: "var(--font-display)" }}>
                      {platform.name}
                    </h3>
 
                    <p className="text-xs text-(--text-muted) mt-3 leading-relaxed min-h-[50px]">
                      {platform.description}
                    </p>
 
                    <div className="border-t border-slate-100 my-6" />
 
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">
                      Features Included
                    </h4>
                    <ul className="flex flex-col gap-3 mb-8">
                      {platform.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-(--text-secondary) font-medium">
                          <Check className="w-3.5 h-3.5 text-(--accent) shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
 
                  <div>
                    <Link
                      href={platform.ctaLink}
                      onClick={(e) => handleCtaClick(e, platform.id, platform.ctaLink)}
                      className={`w-full py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 select-none ${isFeatured
                          ? "btn-primary shadow-sm active:scale-97"
                          : "btn-ghost-dark active:scale-97"
                        }`}
                    >
                      {platform.isDownload ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          {platform.ctaText}
                        </>
                      ) : (
                        <>
                          {platform.ctaText}
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Link>
 
                    {platform.isDownload && (
                      <p className="text-[10px] text-(--text-muted) text-center mt-3 font-medium">
                        {platform.id === "mac" ? "Roadmapped for native Q3 2026 release." : "Setup is quick and lightweight. Double-click to install."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>

      {/* macOS Waitlist Modal */}
      {macWaitlistOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-6 md:p-8 max-w-md w-full flex flex-col gap-5 relative animate-scale-up">
            <button
              onClick={() => {
                setMacWaitlistOpen(false);
                setMacSuccess(false);
                setMacEmail("");
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1.5 rounded-full hover:bg-slate-50 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {!macSuccess ? (
              <>
                <div className="w-12 h-12 rounded-full bg-(--accent-soft) flex items-center justify-center border border-(--accent)/15 shadow-sm mb-1">
                  <AppleIcon className="w-5 h-5 text-(--accent)" />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
                    macOS Stealth HUD Waitlist
                  </h3>
                  <p className="text-xs text-(--text-muted) leading-relaxed">
                    Our native macOS client with CoreAudio and Metal rendering is roadmapped for release in <strong>Q3 2026</strong>. Enter your email to join our early beta testing circle.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (macEmail.trim()) {
                      setMacSuccess(true);
                    }
                  }}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="email"
                    required
                    value={macEmail}
                    onChange={(e) => setMacEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-(--accent)/10 focus:border-(--accent) transition-all duration-300 font-semibold"
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full text-center justify-center cursor-pointer !py-3.5 !px-6 !text-xs uppercase tracking-wider"
                  >
                    Get Notified
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-slate-850" style={{ fontFamily: "var(--font-display)" }}>
                    You're registered!
                  </h3>
                  <p className="text-xs text-(--text-muted) leading-relaxed max-w-xs">
                    We'll email you at <strong>{macEmail}</strong> as soon as the first beta builds of the macOS app become available.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMacWaitlistOpen(false);
                    setMacSuccess(false);
                    setMacEmail("");
                  }}
                  className="btn-ghost-dark w-full !text-xs !py-3.5 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
