"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Headphones, Video, Mic, BrainCircuit, EyeOff, Sparkles } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const steps = [
  {
    icon: <Headphones className="w-5 h-5" />,
    title: "Prepare",
    desc: "Upload your resume, key metrics, and interview prep notes. CrackTheLoop indexes everything for personalized responses.",
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "Join",
    desc: "Enter your interview on Zoom, Meet, or Teams as usual. CrackTheLoop starts listening silently in the background.",
  },
  {
    icon: <Mic className="w-5 h-5" />,
    title: "Listen",
    desc: "Both the interviewer's voice and yours are captured in real-time. Questions are detected the moment the interviewer pauses.",
  },
  {
    icon: <BrainCircuit className="w-5 h-5" />,
    title: "Answer",
    desc: "A cutting-edge AI generates structured, interview-ready responses using your resume context and the right framework.",
  },
  {
    icon: <EyeOff className="w-5 h-5" />,
    title: "Deliver",
    desc: "The answer appears on a floating overlay only you can see. Your interviewer sees only you — calm, confident, in control.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Animate the connector line width as user scrolls through
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.5], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-mist py-24 md:py-32 relative overflow-hidden"
    >
      <div className="orb orb-frost w-[400px] h-[400px] top-0 right-0 animate-float-orb" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">How It Works</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Five Steps to Your <span className="text-gradient-coral">Dream Offer</span>
            </h2>
            <p className="text-[var(--text-muted)] text-base mt-3 max-w-2xl mx-auto">
              From preparation to delivery — everything happens automatically in under a second.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Animated connector line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-0 right-0 h-px bg-[var(--bg-cloud)]">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)]"
              style={{ width: lineWidth }}
            />
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4" staggerDelay={0.1}>
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className={`w-[72px] h-[72px] rounded-2xl flex flex-col items-center justify-center gap-1 glass-card-light relative z-10 ${
                      i === steps.length - 1 ? "!border-[var(--accent-glow)] !bg-[var(--accent-soft)]" : ""
                    }`}
                  >
                    <div className={i === steps.length - 1 ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}>
                      {step.icon}
                    </div>
                    <span className="text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
