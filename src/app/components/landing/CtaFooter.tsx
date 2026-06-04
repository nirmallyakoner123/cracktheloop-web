"use client";

import { ArrowRight, Shield } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export default function CtaFooter() {
  return (
    <section id="cta-footer" className="section-ink relative overflow-hidden">
      <div className="orb orb-peach w-[500px] h-[500px] -top-40 left-1/4 animate-float-orb opacity-70" />

      <div className="relative z-10">
        {/* CTA Block */}
        <div className="py-24 md:py-32">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h2
                className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary-dark)] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to Ace Your{" "}
                <span className="text-gradient-coral">Next Interview</span>?
              </h2>
              <p className="text-[var(--text-muted-dark)] text-lg mb-10 max-w-xl mx-auto">
                Join thousands of candidates who landed their dream offers with an
                invisible edge.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/copilot" className="btn-primary !text-base cursor-pointer">
                  Launch Browser Copilot
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/pricing" className="btn-ghost-dark cursor-pointer">
                  View Pricing
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Footer */}
        <footer className="border-t border-[var(--glass-dark-border)] py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-[var(--text-muted-dark)]">
              © 2026 CrackTheLoop. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {["Features", "Demo", "Pricing", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="text-xs text-[var(--text-muted-dark)] hover:text-[var(--text-primary-dark)] transition cursor-pointer"
                >
                  {link}
                </a>
              ))}
            </div>
            <span className="flex items-center gap-1.5 text-[var(--accent-bright)] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Stealth Mode Active
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
