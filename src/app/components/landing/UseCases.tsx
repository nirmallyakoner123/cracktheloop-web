"use client";

import { User, Users, Bot, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const formats = [
  {
    icon: User,
    tag: "1-on-1 Interviews",
    title: "Stay Calm & Structured",
    anxiety: "Getting nervous, losing your train of thought mid-sentence, or struggling to recall the right projects from your resume when asked.",
    solution:
      "The Copilot listens to the interviewer's question and instantly outlines a structured, professional response. It automatically highlights matching projects from your resume so you always speak with confidence.",
    points: [
      "Structures answers into a clear Situation-Action-Result format",
      "Pulls relevant details from your resume in real time",
      "Monitors your speech pace to keep your delivery natural",
    ],
    stat: { value: "1.5s", label: "average outline speed" },
  },
  {
    icon: Users,
    tag: "Panel Interviews",
    title: "Handle Rapid-Fire Questions",
    anxiety:
      "Feeling overwhelmed when multiple interviewers ask questions back-to-back, making it easy to lose track of who asked what.",
    solution:
      "The Copilot tracks the conversation across different speakers and generates quick outlines, allowing you to address each panelist's question without missing a beat.",
    points: [
      "Identifies and tracks questions from multiple interviewers",
      "Generates fast, scrollable outlines for follow-up questions",
      "Helps align your answers with the specific job description",
    ],
    stat: { value: "5+", label: "panelists supported" },
    featured: true,
  },
  {
    icon: Bot,
    tag: "Automated Screeners",
    title: "Ace Robotic & Timer Tests",
    anxiety:
      "Struggling with rigid timers, robotic scoring systems (like HireVue or Karat), and pre-recorded questions that give you no room to think.",
    solution:
      "The Copilot analyzes the system audio and provides helpful bullet points tailored to the exact rubrics and scoring patterns used by AI grading bots.",
    points: [
      "Compatible with HireVue, Karat, and Byteboard",
      "Tailors suggestions to match automated scoring criteria",
      "Supports pre-recorded and live video test formats",
    ],
    stat: { value: "100%", label: "screener platform coverage" },
  },
];

export default function UseCases() {
  const [left, center, right] = formats;

  return (
    <section
      id="use-cases"
      className="section-mist relative py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-peach w-[500px] h-[500px] top-1/4 -right-40 animate-float-orb opacity-40" />
      <div className="orb orb-frost w-[400px] h-[400px] bottom-0 -left-20 animate-float-orb opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Real-Time Interview Guidance{" "}
              <span className="text-gradient-coral">for Any Format</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto leading-relaxed">
              From 1-on-1 technical discussions and rapid-fire panel interviews to automated AI video screeners—get instant, on-screen memory cues and structured outlines to communicate with absolute clarity.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          staggerDelay={0.08}
        >
          {formats.map((fmt, i) => {
            const Icon = fmt.icon;
            const isFeatured = fmt.featured;

            return (
              <StaggerItem key={i}>
                <div
                  className={`group relative rounded-[12px] p-6 md:p-7 flex flex-col gap-5 overflow-hidden h-full transition-all duration-300 hover:-translate-y-1.5 cursor-default ${isFeatured
                      ? "bg-(--accent-soft) border-2 border-(--accent)/30 shadow-md"
                      : "bg-white/70 border border-(--border-light) shadow-xs hover:shadow-md hover:border-(--accent)/20"
                    }`}
                >
                  {/* Glow for featured */}
                  {isFeatured && (
                    <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-(--accent)/10 blur-3xl pointer-events-none" />
                  )}

                  {/* Tag + Stat */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${isFeatured
                          ? "bg-white/80 text-(--accent) border-(--accent)/20"
                          : "bg-(--accent-soft) text-(--accent) border-(--accent)/20"
                        }`}
                    >
                      {fmt.tag}
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-black text-(--accent) block leading-none">
                        {fmt.stat.value}
                      </span>
                      <span className="text-[10px] text-(--text-muted)">
                        {fmt.stat.label}
                      </span>
                    </div>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0 ${isFeatured
                          ? "bg-white/80 text-(--accent)"
                          : "bg-(--accent-soft) text-(--accent)"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-(--text-primary) leading-snug">
                      {fmt.title}
                    </h3>
                  </div>

                  {/* Anxiety block */}
                  <div className="rounded-[8px] bg-red-50 border border-red-100 px-4 py-3">
                    <span className="text-[10px] font-mono font-bold uppercase text-red-400 tracking-wider block mb-1">
                      The Challenge
                    </span>
                    <p className="text-sm text-red-700 leading-relaxed font-medium">
                      {fmt.anxiety}
                    </p>
                  </div>

                  {/* Solution block */}
                  <div
                    className={`rounded-[8px] px-4 py-3 border ${isFeatured
                        ? "bg-white/70 border-white/80"
                        : "bg-(--accent-soft) border-(--accent)/15"
                      }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase text-(--accent) tracking-wider block mb-1">
                      How Copilot Helps
                    </span>
                    <p className="text-sm text-(--text-secondary) leading-relaxed">
                      {fmt.solution}
                    </p>
                  </div>

                  {/* Feature points */}
                  <ul className="flex flex-col gap-2 pt-2 border-t border-(--border-light) mt-auto">
                    {fmt.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-(--text-secondary) font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-(--accent) shrink-0 mt-0.5" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Bottom callout strip */}
        <ScrollReveal className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-5 px-6 rounded-[10px] bg-white/60 border border-(--border-light) backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-(--text-secondary)">
              <Zap className="w-4 h-4 text-(--accent) shrink-0" />
              Works on Zoom, Google Meet, Teams, HireVue &amp; Karat
            </div>
            <div className="hidden sm:block w-px h-4 bg-(--border-light)" />
            <div className="flex items-center gap-2 text-sm font-medium text-(--text-secondary)">
              <ShieldCheck className="w-4 h-4 text-(--accent) shrink-0" />
              100% invisible to screen share &mdash; Win32 Display Affinity protected
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
