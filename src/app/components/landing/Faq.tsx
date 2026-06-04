"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const faqs = [
  {
    q: "Can interviewers detect CrackTheLoop?",
    a: "No. The desktop overlay uses advanced system-level display features to ensure the window is completely invisible to screen-sharing and recording tools, including Zoom, Google Meet, Microsoft Teams, and Discord. The audio processing is handled privately on your device.",
  },
  {
    q: "Do I need to install any drivers or virtual audio cables?",
    a: "No. CrackTheLoop captures your microphone and speaker audio directly without requiring any complex virtual cable installations, audio routing drivers, or administrator privileges. It works right out of the box.",
  },
  {
    q: "How fast are the answers generated?",
    a: "Answers appear in less than a second. The system captures the conversation, transcribes the questions, and generates structured, context-aware responses in real time as the conversation progresses.",
  },
  {
    q: "Does it work for non-technical interviews?",
    a: "Absolutely. CrackTheLoop supports behavioral, consulting, product management, case study, and technical interviews. It automatically selects the right framework (STAR, McKinsey, Product Design) based on the question context.",
  },
  {
    q: "Is my data secure?",
    a: "Your audio data and credentials are processed locally on your machine and are never stored, logged, or shared with third parties. Your privacy is our highest priority.",
  },
  {
    q: "Which platforms are supported?",
    a: "The browser-based dashboard works on all platforms (Windows, macOS, and Linux). The fully invisible native desktop overlay supports both Windows and macOS natively.",
  },
  {
    q: "Is there a free trial or demo?",
    a: "Yes, you can try our interactive simulator on the Demo page to see the real-time response pipeline in action before upgrading to a premium pass.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-frost py-24 md:py-32 relative overflow-hidden">
      <div className="orb orb-slate w-[350px] h-[350px] -bottom-20 -right-20 animate-float-orb-slow" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-6">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                Frequently Asked Questions
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Common Questions
            </h2>
            <p className="text-[var(--text-muted)] text-base mt-3 max-w-xl mx-auto">
              Everything you need to know about safety, setup, and features.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.04}>
              <div className="glass-card-light overflow-hidden">
                <button
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 cursor-pointer group"
                >
                  <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        open === i ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                      }`}
                    />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-[var(--text-muted)] text-sm leading-relaxed border-t border-[var(--border-light)] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
