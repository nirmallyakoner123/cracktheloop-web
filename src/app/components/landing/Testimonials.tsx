"use client";

import { Star } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const testimonials = [
  {
    quote: "I was skeptical at first, but CrackTheLoop literally saved my Google L5 interview. The STAR method prompts were exactly what I needed for the behavioral round.",
    name: "S. Patel",
    role: "Software Engineer → Google",
    stars: 5,
  },
  {
    quote: "Used it for a McKinsey case interview. The framework suggestions appeared instantly — market sizing, profitability trees, everything. Got the offer.",
    name: "A. Chen",
    role: "Consultant → McKinsey",
    stars: 5,
  },
  {
    quote: "The invisible overlay is unreal. My interviewer on Zoom had no idea. I could read the suggestions while maintaining perfect eye contact. Game changer.",
    name: "R. Müller",
    role: "PM → Meta",
    stars: 5,
  },
  {
    quote: "What sets this apart is the resume preloader. It used my actual metrics and projects in the suggested answers. Felt like having a personal prep coach live.",
    name: "J. Williams",
    role: "Data Scientist → Amazon",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-mist py-24 md:py-32 relative overflow-hidden">
      <div className="orb orb-slate w-[400px] h-[400px] -bottom-20 -left-20 animate-float-orb-slow" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Loved by <span className="text-gradient-coral">Candidates</span> Worldwide
            </h2>
            <p className="text-[var(--text-muted)] text-base mt-3 max-w-xl mx-auto">
              Real stories from users who landed offers at top companies.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="glass-card-light p-6 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-5 pt-4 border-t border-[var(--border-light)]">
                  <span className="text-sm font-bold text-[var(--text-primary)]">{t.name}</span>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
