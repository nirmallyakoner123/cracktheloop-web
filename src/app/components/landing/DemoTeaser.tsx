"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export default function DemoTeaser() {
  return (
    <section id="demo-teaser" className="section-frost py-24 md:py-32 relative overflow-hidden">
      <div className="orb orb-peach w-[400px] h-[400px] -top-20 -left-40 animate-float-orb" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="glass-card-light p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            {/* Left — Copy */}
            <div className="flex flex-col gap-5 flex-1">
              <div className="inline-flex w-fit items-center gap-1.5 bg-[var(--accent-soft)] border border-[var(--accent-glow)] px-3 py-1 rounded-full text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Interactive Demo
              </div>
              <h2
                className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                See It in Action
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Try our live simulator and watch how CrackTheLoop captures audio,
                detects questions, and generates structured answers — all in under a second.
                No signup required.
              </p>
              <a
                href="/demo"
                className="btn-primary w-fit cursor-pointer"
              >
                Try the Live Demo
                <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
              </a>
            </div>

            {/* Right — Mini Simulator */}
            <div className="bg-[var(--bg-ink)] rounded-2xl p-6 w-full md:w-[340px] shrink-0 border border-[var(--glass-dark-border)]">
              <span className="text-[10px] font-black text-[var(--text-muted-dark)] uppercase tracking-widest block mb-4">
                Pipeline Preview
              </span>
              <div className="flex flex-col gap-2.5 font-mono text-[11px]">
                <div className="flex gap-2">
                  <span className="text-[var(--text-muted-dark)]">01</span>
                  <span className="text-[var(--text-secondary-dark)]">Capturing audio stream...</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[var(--text-muted-dark)]">02</span>
                  <span className="text-[var(--text-secondary-dark)]">Detecting question boundary...</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[var(--text-muted-dark)]">03</span>
                  <span className="text-[var(--accent-bright)]">Streaming AI response...</span>
                </div>
                <div className="mt-2 border border-dashed border-[var(--accent-glow)] p-3 rounded-lg bg-[var(--accent-soft)] text-[var(--accent-bright)] text-[10px] font-semibold">
                  &quot;The key difference between TCP and UDP lies in connection management. TCP establishes a three-way handshake...&quot;
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
