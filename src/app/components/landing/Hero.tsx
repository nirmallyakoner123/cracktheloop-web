"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Video, Users, Mic, Eye, EyeOff } from "lucide-react";
import { Parallax } from "./ScrollReveal";

export default function Hero() {
  const [showInterviewerView, setShowInterviewerView] = useState(false);

  return (
    <section id="hero" className="section-frost relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Floating Orbs with parallax */}
      <Parallax speed={0.2} className="absolute -top-20 -right-40">
        <div className="orb orb-peach w-[500px] h-[500px] animate-float-orb" />
      </Parallax>
      <Parallax speed={0.4} className="absolute top-1/2 -left-40">
        <div className="orb orb-slate w-[400px] h-[400px] animate-float-orb-slow" />
      </Parallax>
      <Parallax speed={0.15} className="absolute -bottom-20 right-1/4">
        <div className="orb orb-frost w-[350px] h-[350px] animate-float-orb" style={{ animationDelay: "5s" }} />
      </Parallax>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex w-fit items-center gap-2 glass-light rounded-full px-4 py-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                Invisible to Screen Share
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Invisible Edge in{" "}
              <span className="text-gradient-hero">Every Interview</span>
            </h1>

            <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-xl">
              Real-time AI guidance that only you can see. Whether it&apos;s a technical,
              behavioral, consulting, or product interview — CrackTheLoop delivers
              structured answers through an overlay that&apos;s completely invisible to
              screen sharing tools.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a href="/copilot" className="btn-primary cursor-pointer">
                Launch Browser Copilot
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/pricing" className="btn-ghost-light cursor-pointer">
                View Pricing
              </a>
            </div>
          </motion.div>

          {/* Right — HUD Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="glass-light rounded-2xl p-5 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Live Interview Session
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-red-500">REC</span>
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Interviewer */}
                <div className="bg-[var(--bg-mist)] rounded-xl p-4 flex flex-col items-center justify-center h-40 border border-[var(--border-light)] relative">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-cloud)] flex items-center justify-center text-[var(--text-muted)] mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">Interviewer</span>
                  <Mic className="w-3 h-3 text-green-500 absolute top-3 right-3" />
                </div>

                {/* Candidate */}
                <div className="bg-[var(--bg-mist)] rounded-xl p-4 flex flex-col items-center justify-center h-40 border border-[var(--border-light)] relative">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">You</span>
                  <Mic className="w-3 h-3 text-green-500 absolute top-3 right-3" />

                  {/* HUD Overlay */}
                  {!showInterviewerView && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 rounded-xl bg-white/60 backdrop-blur-sm border border-[var(--accent)]/20 p-3 flex flex-col gap-1.5"
                    >
                      <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest">
                        AI Copilot
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] font-medium leading-snug">
                        ✦ Use STAR method: Situation → Task → Action → Result
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] font-medium leading-snug">
                        ✦ Highlight: 40% revenue increase via pipeline optimization
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-medium leading-snug">
                        ✦ Mention cross-functional leadership…
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowInterviewerView(false)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition cursor-pointer ${
                    !showInterviewerView
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-mist)] text-[var(--text-muted)] hover:bg-[var(--bg-cloud)]"
                  }`}
                >
                  <Eye className="w-3 h-3 inline mr-1.5" />
                  Your View
                </button>
                <button
                  onClick={() => setShowInterviewerView(true)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition cursor-pointer ${
                    showInterviewerView
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-mist)] text-[var(--text-muted)] hover:bg-[var(--bg-cloud)]"
                  }`}
                >
                  <EyeOff className="w-3 h-3 inline mr-1.5" />
                  Interviewer&apos;s View
                </button>
              </div>

              {showInterviewerView && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[11px] text-green-600 font-semibold mt-3"
                >
                  ✓ The AI overlay is completely invisible to the interviewer
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
