"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, MessageCircle, Briefcase, LayoutGrid } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const useCases = [
  {
    icon: <Code className="w-6 h-6" />,
    title: "Technical Interviews",
    subtitle: "Software Engineering, Data Science, DevOps",
    points: [
      "Real-time code problem analysis",
      "System design pattern suggestions",
      "Complexity analysis and edge cases",
      "Language-specific best practices",
    ],
    accent: "from-blue-500/20 to-cyan-500/20",
    borderAccent: "hover:border-blue-500/20",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Behavioral Interviews",
    subtitle: "Leadership, Teamwork, Conflict Resolution",
    points: [
      "STAR method structured responses",
      "Metrics and impact highlighting",
      "Personalized stories from your resume",
      "Emotional intelligence cues",
    ],
    accent: "from-emerald-500/20 to-green-500/20",
    borderAccent: "hover:border-emerald-500/20",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Consulting & Case Studies",
    subtitle: "McKinsey, BCG, Bain, Strategy Roles",
    points: [
      "McKinsey 7S / Porter's Five Forces",
      "Market sizing frameworks",
      "Profitability analysis structures",
      "Hypothesis-driven problem solving",
    ],
    accent: "from-amber-500/20 to-orange-500/20",
    borderAccent: "hover:border-amber-500/20",
  },
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: "Product Management",
    subtitle: "Product Sense, Execution, Analytics",
    points: [
      "Product design frameworks",
      "Prioritization matrices (RICE, ICE)",
      "Metric definition and goal setting",
      "User journey analysis templates",
    ],
    accent: "from-purple-500/20 to-pink-500/20",
    borderAccent: "hover:border-purple-500/20",
  },
];

export default function UseCases() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // The cards shift subtly upward as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={containerRef}
      id="use-cases"
      className="section-ink py-24 md:py-32 relative overflow-hidden"
    >
      <div className="orb orb-peach w-[500px] h-[500px] top-1/4 -right-40 animate-float-orb opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary-dark)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Works for <span className="text-gradient-coral">Every</span> Interview Type
            </h2>
            <p className="text-[var(--text-muted-dark)] text-base mt-3 max-w-2xl mx-auto">
              CrackTheLoop adapts its framework engine to match the specific type of interview you&apos;re in.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ y }}
        >
          {useCases.map((uc, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className={`glass-card-dark p-6 h-full group ${uc.borderAccent}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${uc.accent} flex items-center justify-center text-[var(--text-primary-dark)] mb-4`}>
                  {uc.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary-dark)] mb-1">
                  {uc.title}
                </h3>
                <p className="text-[11px] font-medium text-[var(--text-muted-dark)] mb-4">
                  {uc.subtitle}
                </p>
                <ul className="flex flex-col gap-2">
                  {uc.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-[var(--text-secondary-dark)]">
                      <span className="text-[var(--accent-bright)] mt-0.5 shrink-0">✦</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
