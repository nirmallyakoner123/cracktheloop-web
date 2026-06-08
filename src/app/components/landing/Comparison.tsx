"use client";

import { Sparkles, Check, X, Minus } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const comparisonPoints = [
  {
    feature: "General interview tips & advice",
    generic: true,
    cracktheloop: true,
    detail: "Both provide general guidance - but only one is personalized.",
  },
  {
    feature: "Uses your actual resume for context",
    generic: false,
    cracktheloop: true,
    detail: "Maps answers to your real projects, metrics, and achievements.",
  },
  {
    feature: "Understands the target job description",
    generic: false,
    cracktheloop: true,
    detail: "Extracts required skills and keywords to align your responses.",
  },
  {
    feature: "Gives role-specific talking points",
    generic: "partial",
    cracktheloop: true,
    detail: "Generic AI gives surface-level tips. CrackTheLoop tailors to title and seniority.",
  },
  {
    feature: "Assists smoothly during live interview flow",
    generic: false,
    cracktheloop: true,
    detail: "No complex prompting - answers appear automatically as questions are asked.",
  },
  {
    feature: "Works free with no credit card required",
    generic: false,
    cracktheloop: true,
    detail: "Free tier includes 15 credits - a full 15-minute AI interview session, no card needed.",
  },
  {
    feature: "Generates AI interview suggestions during the live call",
    generic: false,
    cracktheloop: true,
    detail: "Real-time response suggestions during your sessions - not just pre-interview prep.",
  },
  {
    feature: "Completely undetectable on Zoom, Teams, Meet",
    generic: false,
    cracktheloop: true,
    detail: "Win32 Display Affinity makes the overlay invisible to all screen-sharing software.",
  },
  {
    feature: "Structures answers in STAR/CAR format",
    generic: false,
    cracktheloop: true,
    detail: "Automatically maps questions to behavioral frameworks with your experience.",
  },
  {
    feature: "Keeps answers natural & conversational",
    generic: false,
    cracktheloop: true,
    detail: "Suggests talking points - not scripts - so answers sound like you.",
  },
];

export default function Comparison() {
  return (
    <section id="comparison" className="section-mist relative py-20 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="orb orb-peach w-[500px] h-[500px] -top-40 -left-40 animate-float-orb" />
      <div className="orb orb-slate w-[400px] h-[400px] bottom-0 -right-20 animate-float-orb-slow" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Best AI Interview Helper 2025{" "}
              <span className="text-gradient-coral">- CrackTheLoop vs the Rest</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto">
              Why a dedicated AI interview helper that works during live interviews outperforms ChatGPT, Final Round AI, and generic prep tools - every time.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="w-full">
          <div className="text-right mb-2 md:hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-(--text-muted) inline-flex items-center gap-1 select-none">
              Swipe to compare ➔
            </span>
          </div>
          <div className="overflow-hidden rounded-[12px] border border-(--border-light) shadow-xs bg-white/85 backdrop-blur-md w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[580px] text-sm text-left">
                <thead>
                  <tr className="border-b border-(--border-light)">
                    <th className="px-6 py-4 text-(--text-muted) font-bold uppercase tracking-wider text-xs w-[50%]">
                      Comparison Point
                    </th>
                    <th className="px-6 py-4 text-center text-(--text-muted) font-bold uppercase tracking-wider text-xs">
                      Generic AI
                    </th>
                    <th className="px-6 py-4 text-center text-(--accent) font-bold uppercase tracking-wider text-xs bg-(--accent-soft)">
                      <div className="flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        CrackTheLoop
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border-light)">
                  {comparisonPoints.map((point, i) => (
                    <tr key={i} className="hover:bg-(--bg-mist) transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-(--text-primary) block text-xs md:text-sm">
                          {point.feature}
                        </span>
                        <span className="text-xs text-(--text-muted) mt-0.5 block">
                          {point.detail}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {point.generic === true ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto opacity-80" />
                        ) : point.generic === "partial" ? (
                          <Minus className="w-4 h-4 text-amber-600 mx-auto opacity-80" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 mx-auto opacity-60" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-(--accent-soft)/20">
                        {point.cracktheloop ? (
                          <Check className="w-5 h-5 text-(--accent) mx-auto stroke-[3]" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto opacity-60" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Price Anchoring Block */}
        <ScrollReveal className="mt-10">
          <div className="bg-white/80 backdrop-blur-md border border-(--border-light) rounded-[12px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-xs">
            <div className="flex-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-(--accent) mb-3 block">Value Comparison</span>
              <h3 className="text-xl md:text-2xl font-extrabold text-(--text-primary) leading-snug mb-1"
                style={{ fontFamily: "var(--font-display)" }}>
                Your next job pays $10,000+ per month.<br />
                <span className="text-gradient-coral">Investing $39 to secure it is a 256× return.</span>
              </h3>
              <p className="text-sm text-(--text-muted) mt-2 max-w-md leading-relaxed">
                Compare the real cost of alternatives. CrackTheLoop isn&apos;t an expense - it&apos;s the most efficient interview investment you can make.
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <div className="overflow-hidden rounded-[8px] border border-(--border-light) text-sm w-full md:w-72">
                {[
                  { label: "Human Mock Interviewer", cost: "$150–$300 / hour", muted: true },
                  { label: "Interview Prep Course", cost: "$1,000–$5,000", muted: true },
                  { label: "Career Coach (6 weeks)", cost: "$3,000+", muted: true },
                  { label: "CrackTheLoop Pro Pass", cost: "$39 / month", highlight: true },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 border-b border-(--border-light) last:border-0 ${row.highlight ? "bg-(--accent-soft) border-l-2 border-l-(--accent)" : "bg-white"
                    }`}>
                    <span className={`text-xs font-medium ${row.highlight ? "text-(--accent) font-bold" : "text-(--text-secondary)"}`}>
                      {row.label}
                    </span>
                    <span className={`text-xs font-bold ${row.highlight ? "text-(--accent)" : "text-(--text-muted)"}`}>
                      {row.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Trust callout - merged from TrustEthics */}
        <ScrollReveal className="mt-12">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
            {[
              { title: "Resume Data Stays Private", desc: "Never shared, logged, or used for model training. Stays 100% on your device." },
              { title: "Invisible to Zoom & Teams", desc: "Win32 Display Affinity API ensures the overlay is never captured in screen recordings." },
              { title: "No Virtual Audio Drivers", desc: "Uses WASAPI system loopback - nothing unusual appears in your device list." },
              { title: "User-Controlled Sessions", desc: "Copilot only listens when you explicitly start a session. Zero passive monitoring." },
            ].map((tp, i) => (
              <StaggerItem key={i}>
                <div className="rounded-[8px] border border-(--border-light) bg-white/70 backdrop-blur-md p-5 flex flex-col gap-2 hover:border-(--accent)/20 hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="text-sm font-bold text-(--text-primary)">{tp.title}</h3>
                  <p className="text-xs text-(--text-muted) leading-relaxed">{tp.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </div>
    </section>
  );
}
