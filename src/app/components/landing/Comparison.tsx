"use client";

import { Shield, Check, X } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const features = [
  ["Invisible to Screen Share", true, false, false],
  ["Picks Up Audio Automatically", true, true, false],
  ["Sub-Second Answer Speed", true, true, false],
  ["No Manual Copy-Paste Needed", true, true, false],
  ["No Browser Extension Required", true, false, true],
  ["Answers Stream Word-by-Word", true, true, false],
  ["Captures Both Sides of Call", true, true, false],
  ["Works on Windows & macOS", true, true, true],
  ["Supports All Interview Types", true, true, false],
] as const;

export default function Comparison() {
  return (
    <section id="comparison" className="section-frost py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why <span className="text-gradient-coral">CrackTheLoop</span>?
            </h2>
            <p className="text-[var(--text-muted)] text-base mt-3 max-w-xl mx-auto">
              Stack it against the alternatives — no contest.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card-light overflow-hidden !rounded-2xl">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[var(--border-light)]">
                  <th className="px-6 py-4 text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs w-[40%]">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-[var(--accent)] uppercase tracking-widest">
                      <Shield className="w-3.5 h-3.5" /> Stealth Overlay
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                      Browser Copilot
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                      Manual Chat
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {features.map(([label, col1, col2, col3], i) => (
                  <tr
                    key={i}
                    className={`${
                      i === 0 ? "bg-[var(--accent-soft)]" : i % 2 === 0 ? "bg-[var(--bg-mist)]" : "bg-white/50"
                    } hover:bg-[var(--bg-cloud)] transition-colors`}
                  >
                    <td className={`px-6 py-3.5 font-medium text-xs ${i === 0 ? "text-[var(--accent)] font-bold" : "text-[var(--text-secondary)]"}`}>
                      {label}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {col1 ? <Check className="w-4 h-4 text-[var(--accent)] mx-auto" /> : <X className="w-4 h-4 text-[var(--bg-cloud)] mx-auto" />}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {col2 ? <Check className="w-4 h-4 text-[var(--text-muted)] mx-auto" /> : <X className="w-4 h-4 text-[var(--bg-cloud)] mx-auto" />}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {col3 ? <Check className="w-4 h-4 text-[var(--text-muted)] mx-auto" /> : <X className="w-4 h-4 text-[var(--bg-cloud)] mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
