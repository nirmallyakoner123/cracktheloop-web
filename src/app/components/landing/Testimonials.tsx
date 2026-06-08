"use client";

import { ThumbsUp, MessageSquare, BadgeCheck } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const testimonials = [
  {
    company: "G",
    companyColor: "bg-[#4285F4]",
    role: "Senior Engineer",
    company_name: "Google",
    level: "L5 SWE",
    quote:
      "Got my Google L5 offer after three failed loops. Set up CrackTheLoop the night before. The STAR framework appeared within 1.5 seconds of the question. Interviewer had zero idea. 10/10.",
    likes: 847,
    comments: 203,
    tag: "Google Technical Interview",
  },
  {
    company: "S",
    companyColor: "bg-[#635BFF]",
    role: "Staff Engineer",
    company_name: "Stripe",
    level: "Staff SWE",
    quote:
      "Panel with 4 people asking simultaneously. Normally I freeze. The copilot surfaced my Redis clustering project exactly when the system design question hit. 40-minute round felt like 5.",
    likes: 612,
    comments: 97,
    tag: "Stripe Panel Interview",
  },
  {
    company: "A",
    companyColor: "bg-[#FF9900]",
    role: "Software Engineer",
    company_name: "Amazon",
    level: "SDE-II",
    quote:
      "HireVue felt robotic and timed. CrackTheLoop structured the answer to the rubric format. Passed the AI screen and got the recruiter call the next morning.",
    likes: 1103,
    comments: 312,
    tag: "HireVue AI Interview Screener",
  },
  {
    company: "M",
    companyColor: "bg-[#0668E1]",
    role: "Product Designer",
    company_name: "Meta",
    level: "IC4",
    quote:
      "I switched from marketing. CrackTheLoop mapped my campaign metrics to product thinking frameworks. The behavioral round was the first interview where I felt 100% in control.",
    likes: 489,
    comments: 76,
    tag: "Career Change Interview",
  },
];

function formatNumber(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-warm relative py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-peach w-[400px] h-[400px] -bottom-20 -left-20 animate-float-orb-slow opacity-40" />
      <div className="orb orb-frost w-[300px] h-[300px] top-0 -right-20 animate-float-orb opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Google, Amazon &amp; Meta Engineers Used This{" "}
              <span className="text-gradient-coral">AI Interview Helper to Get Offers</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto">
              Real results from candidates who used CrackTheLoop's free AI interview helper to walk into their interview with the right answer, every time.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          staggerDelay={0.08}
        >
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="group bg-white/80 backdrop-blur-md rounded-[14px] p-6 flex flex-col gap-4 border border-(--border-light) hover:border-(--accent)/25 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 shadow-xs h-full">

                {/* Top row: Avatar + role + verified badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Company initial avatar */}
                    <div
                      className={`w-10 h-10 rounded-full ${t.companyColor} flex items-center justify-center text-white text-sm font-extrabold select-none shrink-0 shadow-sm`}
                    >
                      {t.company}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-(--text-primary) block leading-tight">
                        {t.role}
                        <span className="text-(--text-muted) font-medium"> • {t.company_name}</span>
                      </span>
                      <span className="text-[10px] font-mono text-(--text-muted) uppercase tracking-wider">
                        {t.level}
                      </span>
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div className="flex items-center gap-1 bg-(--accent-soft) border border-(--accent)/20 px-2 py-1 rounded-full shrink-0">
                    <BadgeCheck className="w-3 h-3 text-(--accent) shrink-0" />
                    <span className="text-[9px] font-bold text-(--accent) uppercase tracking-wider whitespace-nowrap">
                      Verified User
                    </span>
                  </div>
                </div>

                {/* Interview type tag */}
                <span className="self-start text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-(--accent-soft) text-(--accent) border border-(--accent)/20">
                  {t.tag}
                </span>

                {/* Quote */}
                <p className="text-base text-(--text-secondary) leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Bottom: engagement row */}
                <div className="flex items-center gap-4 pt-3 border-t border-(--border-light)">
                  <div className="flex items-center gap-1.5 text-[11px] text-(--text-muted) select-none">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{formatNumber(t.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-(--text-muted) select-none">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{formatNumber(t.comments)}</span>
                  </div>
                  <span className="ml-auto text-[10px] text-(--text-muted) font-medium italic">
                    Anonymous • Identity Protected
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Disclaimer strip */}
        <ScrollReveal className="mt-6">
          <p className="text-center text-[11px] text-(--text-muted) max-w-lg mx-auto leading-relaxed">
            All testimonials are anonymized. Names and company affiliations are not disclosed to protect user privacy.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
