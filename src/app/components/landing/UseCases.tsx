"use client";

import { User, Users, Bot, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const formats = [
  {
    icon: User,
    tag: "1-on-1 Technical Round",
    title: "One Engineer. One Shot.",
    anxiety: "Blanking out mid-answer. Losing structure. Verbal fillers taking over.",
    solution:
      "STAR method AI interview suggestions surface in under 2 seconds. Resume projects mapped to the exact question. Behavioral interview AI keeps you composed and structured.",
    points: [
      "Behavioral answers structured to STAR in real time",
      "Surfaces relevant resume projects automatically",
      "Speech pace alerts keep delivery natural",
    ],
    stat: { value: "1.5s", label: "avg. first answer point" },
  },
  {
    icon: Users,
    tag: "Multi-Interviewer Panel",
    title: "Five People. Rapid-Fire Questions.",
    anxiety:
      "Overwhelm. Losing track of who asked what. Forgetting key technical details under pressure.",
    solution:
      "CrackTheLoop captures each question as it's spoken, structures the answer, and queues context from your resume - so you always have something strong to say.",
    points: [
      "Captures any speaker's question, regardless of who asks",
      "Fast-switch answer mode for rapid question sequences",
      "Keeps JD keyword alignment across all answers",
    ],
    stat: { value: "5×", label: "panelists - zero panic" },
    featured: true,
  },
  {
    icon: Bot,
    tag: "HireVue AI Interview Helper",
    title: "HireVue. Karat. Byteboard.",
    anxiety:
      "Unnatural pace, timer anxiety, robotic scoring rubrics, no room to think.",
    solution:
      "Captures system audio from any video platform or AI screener. Generates AI interview suggestions matched to the rubric's scoring format - behavioral, competency, or technical.",
    points: [
      "Works with any AI video screener via system audio capture",
      "Suggestions aligned to rubric scoring criteria",
      "Handles pre-recorded and live bot question formats",
    ],
    stat: { value: "100%", label: "AI screener compatible" },
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
              AI Interview Helper for Every Format{" "}
              <span className="text-gradient-coral">- Live &amp; Undetectable</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto leading-relaxed">
              Whether it&apos;s a single recruiter, a five-person panel, or a HireVue AI screener - CrackTheLoop generates real-time AI interview guidance for every format, completely undetectable.
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
                      Candidate Anxiety
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
                      How CrackTheLoop Helps
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
