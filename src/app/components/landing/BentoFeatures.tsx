"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, EyeOff, BrainCircuit, Eye, FileText, MonitorSmartphone, Upload } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const features = [
  {
    icon: <EyeOff className="w-5 h-5" />,
    iconBg: "bg-[var(--accent-soft)]",
    iconColor: "text-[var(--accent-bright)]",
    title: "Invisible Shield",
    desc: "The overlay uses system-level display properties to become completely invisible to screen recording, Zoom, Google Meet, and Teams. Your interviewer sees nothing.",
    inner: (
      <div className="bg-[var(--bg-ink)] rounded-xl p-4 border border-[var(--glass-dark-border)]">
        <div className="flex items-center gap-2 mb-3">
          <MonitorSmartphone className="w-3.5 h-3.5 text-[var(--text-muted-dark)]" />
          <span className="text-[10px] font-bold text-[var(--text-muted-dark)] uppercase tracking-widest">
            Screen Share Feed
          </span>
        </div>
        <div className="bg-[var(--bg-ink-surface)] rounded-lg h-16 flex items-center justify-center">
          <span className="text-[11px] text-emerald-600 font-semibold">✓ No overlay visible</span>
        </div>
      </div>
    ),
  },
  {
    icon: <BrainCircuit className="w-5 h-5" />,
    iconBg: "bg-[var(--bg-ink-surface)]",
    iconColor: "text-[var(--text-secondary-dark)]",
    title: "Framework Engine",
    desc: "Built-in support for STAR method, McKinsey case structures, product design frameworks, and behavioral formulas — adapts to your interview type automatically.",
    inner: (
      <div className="flex gap-2 flex-wrap">
        {["STAR Method", "Case Study", "Product Design", "Behavioral"].map((fw) => (
          <span key={fw} className="text-[10px] font-semibold px-3 py-1.5 rounded-full bg-[var(--bg-ink-surface)] text-[var(--text-muted-dark)] border border-[var(--glass-dark-border)]">
            {fw}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: <Eye className="w-5 h-5" />,
    iconBg: "bg-[var(--bg-ink-surface)]",
    iconColor: "text-[var(--text-secondary-dark)]",
    title: "Natural Eye Contact",
    desc: "The overlay is strategically placed near your camera lens, so you can read suggestions while maintaining natural, direct eye contact with the interviewer.",
    inner: (
      <div className="bg-[var(--bg-ink)] rounded-xl p-4 border border-[var(--glass-dark-border)] flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-bright)] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-bright)]" />
          </div>
          <span className="text-[9px] text-[var(--text-muted-dark)]">Camera</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-bright)] to-transparent" />
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-6 rounded border border-[var(--glass-dark-border)] bg-[var(--bg-ink-surface)] flex items-center justify-center">
            <span className="text-[7px] text-[var(--accent-bright)]">HUD</span>
          </div>
          <span className="text-[9px] text-[var(--text-muted-dark)]">Overlay</span>
        </div>
      </div>
    ),
  },
  {
    icon: <FileText className="w-5 h-5" />,
    iconBg: "bg-[var(--bg-ink-surface)]",
    iconColor: "text-[var(--text-secondary-dark)]",
    title: "Resume Preloader",
    desc: "Upload your resume, key metrics, and prepared answers. The AI uses this context to generate personalized, data-backed responses unique to your experience.",
    inner: (
      <div className="bg-[var(--bg-ink)] rounded-xl p-4 border border-dashed border-[var(--glass-dark-border)] flex items-center gap-3">
        <Upload className="w-5 h-5 text-[var(--text-muted-dark)]" />
        <div>
          <span className="text-xs font-semibold text-[var(--text-secondary-dark)]">resume_2026.pdf</span>
          <span className="text-[10px] text-emerald-600 block">✓ Loaded &amp; indexed</span>
        </div>
      </div>
    ),
  },
];

export default function BentoFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle scale effect on the heading as user scrolls through
  const headingScale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section-ink py-24 md:py-32 relative overflow-hidden"
    >
      {/* Orbs */}
      <div className="orb orb-peach w-[450px] h-[450px] -top-40 right-0 animate-float-orb opacity-60" />
      <div className="orb orb-slate w-[350px] h-[350px] bottom-0 -left-40 animate-float-orb-slow opacity-60" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          style={{ scale: headingScale, opacity: headingOpacity }}
        >
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
            <span className="text-xs font-semibold text-[var(--text-secondary-dark)]">
              Core Capabilities
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary-dark)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built to Be <span className="text-gradient-coral">Invisible</span>
          </h2>
          <p className="text-[var(--text-muted-dark)] text-base mt-3 max-w-2xl mx-auto">
            Four core pillars that make CrackTheLoop the most undetectable interview companion ever built.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
          {features.map((f, i) => (
            <StaggerItem key={i}>
              <div className="glass-card-dark p-8 h-full">
                <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center mb-5 border border-[var(--glass-dark-border)] ${f.iconColor}`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary-dark)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted-dark)] leading-relaxed mb-5">{f.desc}</p>
                {f.inner}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
