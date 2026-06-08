"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, CheckCircle2, Mic, Clock, BrainCircuit, ShieldAlert, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import Link from "next/link";

const AUTOPLAY_DURATION = 4500;

const features = [
  {
    id: 0,
    icon: FileText,
    label: "Resume-Based AI Guidance",
    title: "AI Interview Guidance Tailored to Your Resume",
    desc: "The AI deep-reads your projects, metrics, and tech stack so every talking point is 100% personalized - not generic internet filler. Free with every plan.",
    tag: "Personalized AI Guidance",
    preview: (
      <div className="w-full h-full flex flex-col gap-3">
        {/* App header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">Matched Resume Context</span>
          <span className="text-[9px] bg-(--accent-soft) text-(--accent) font-bold px-2 py-0.5 rounded-full">Live</span>
        </div>
        {/* Question bubble */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-(--accent) animate-pulse" />
            <span className="text-[9px] font-mono text-slate-400">Detected question</span>
          </div>
          <p className="text-[11px] text-slate-700 italic font-medium leading-snug">"Tell me about a time you improved application performance."</p>
        </div>
        {/* Matched resume */}
        <div className="bg-white border border-(--accent)/20 rounded-lg p-4 flex flex-col gap-2.5 shadow-sm">
          <span className="text-[9px] font-mono font-bold text-(--accent) uppercase tracking-widest">↳ Matched from your resume</span>
          <div className="flex items-start gap-2">
            <span className="text-(--accent) mt-0.5 shrink-0">✦</span>
            <span className="text-[11px] text-slate-700 leading-snug">E-commerce dashboard redesign - React/Next.js</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-(--accent) mt-0.5 shrink-0">✦</span>
            <span className="text-[11px] text-slate-700 leading-snug">Reduced bundle size <strong>40%</strong> via code splitting</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-(--accent) mt-0.5 shrink-0">✦</span>
            <span className="text-[11px] text-slate-700 leading-snug">Recovered <strong>62% latency</strong> on key API paths</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-(--accent) font-bold">✓ 3 relevant resume points surfaced in 0.9s</div>
      </div>
    ),
  },
  {
    id: 1,
    icon: CheckCircle2,
    label: "Job Description Keyword Match",
    title: "AI Interview Guidance Matched to the Exact Job Description",
    desc: "Extracts role requirements, mandatory ATS keywords, and deliverables from the pasted JD - so every talking point hits what the interviewer is scoring for. Included free.",
    tag: "ATS Keyword Matching",
    preview: (
      <div className="w-full h-full flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">JD Keyword Alignment</span>
          <span className="text-[9px] bg-(--accent-soft) text-(--accent) font-bold px-2 py-0.5 rounded-full">100% Match</span>
        </div>
        {/* JD snippet */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-[11px] text-slate-600 leading-relaxed">
          Required: experience with{" "}
          <span className="bg-(--accent-soft) text-(--accent) px-1 rounded font-semibold">React</span>,{" "}
          <span className="bg-(--accent-soft) text-(--accent) px-1 rounded font-semibold">API Integration</span>,{" "}
          and strong{" "}
          <span className="bg-(--accent-soft) text-(--accent) px-1 rounded font-semibold">stakeholder management</span>. Familiarity with performance{" "}
          <span className="bg-(--accent-soft) text-(--accent) px-1 rounded font-semibold">optimization</span>{" "}
          is a plus.
        </div>
        {/* Matched tags */}
        <div className="bg-white border border-(--accent)/20 rounded-lg p-4 shadow-sm">
          <span className="text-[9px] font-mono font-bold text-(--accent) uppercase tracking-widest block mb-2.5">↳ Keywords in your answers</span>
          <div className="flex flex-wrap gap-2">
            {["React", "API Integration", "Optimization", "Stakeholders", "System Design"].map((k) => (
              <span key={k} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-(--accent-soft) border border-(--accent)/20 text-(--accent)">
                ✓ {k}
              </span>
            ))}
          </div>
        </div>
        <div className="text-[9px] font-mono text-(--accent) font-bold">✓ All mandatory JD keywords covered</div>
      </div>
    ),
  },
  {
    id: 2,
    icon: Mic,
    label: "Live Interview Transcription",
    title: "Understands Questions the Moment They're Asked - Live",
    desc: "Real-time audio capture transcribes the interviewer during your live sessions, detecting question intent within milliseconds. Works on Zoom, Teams, Meet, HireVue, and Karat.",
    tag: "Real-Time AI Guidance",
    preview: (
      <div className="w-full h-full flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">Audio Capture</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse" />
            <span className="text-[9px] text-(--accent) font-bold font-mono">LIVE</span>
          </div>
        </div>
        {/* Waveform */}
        <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-center gap-0.5 h-16">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-(--accent)"
              animate={{ height: [4, Math.random() * 28 + 6, 4] }}
              transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, repeatType: "mirror", delay: i * 0.04 }}
            />
          ))}
        </div>
        {/* Transcription */}
        <div className="bg-white border border-(--accent)/20 rounded-lg p-4 shadow-sm">
          <span className="text-[9px] font-mono font-bold text-(--accent) uppercase tracking-widest block mb-2">↳ Transcribing...</span>
          <p className="text-[11px] text-slate-700 italic leading-snug">
            "How do you manage conflicting stakeholder demands when timelines are tight?"
            <span className="inline-block w-1.5 h-3.5 bg-(--accent) animate-pulse ml-1 align-middle rounded-sm" />
          </p>
        </div>
        <div className="text-[9px] font-mono text-(--accent) font-bold">✓ Question intent detected in 0.3s</div>
      </div>
    ),
  },
  {
    id: 3,
    icon: Clock,
    label: "Quick AI Guidance",
    title: "Free AI Interview Guidance - Quick Mode",
    desc: "When the conversation is moving fast, get crisp AI-generated interview suggestions in under 2 seconds - no frameworks, just the essential talking point.",
    tag: "Speed Mode - Free",
    preview: (
      <div className="w-full h-full flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">Quick Answer Mode</span>
          <span className="text-[9px] bg-(--accent-soft) text-(--accent) font-bold px-2 py-0.5 rounded-full">1.2s</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
          <p className="text-[11px] text-slate-600 italic">"How do you manage conflicting stakeholder demands?"</p>
        </div>
        {/* Quick answer */}
        <div className="bg-white border border-(--accent)/20 rounded-lg p-4 shadow-sm flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-(--accent-soft) flex items-center justify-center text-(--accent) text-[9px] font-black">⚡</span>
            <span className="text-[9px] font-mono font-bold text-(--accent) uppercase tracking-widest">Quick Answer</span>
          </div>
          <p className="text-[12px] text-slate-700 leading-relaxed">
            "I use structured prioritization frameworks like RICE matrix to align stakeholders objectively - removing emotional bias and anchoring decisions on business impact vs. engineering cost."
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-(--accent-soft) border border-(--accent)/20 rounded-lg p-2.5 text-center">
            <div className="text-base font-black text-(--accent)">27</div>
            <div className="text-[8px] text-(--accent) font-medium">words</div>
          </div>
          <div className="flex-1 bg-(--accent-soft) border border-(--accent)/20 rounded-lg p-2.5 text-center">
            <div className="text-base font-black text-(--accent)">~18s</div>
            <div className="text-[8px] text-(--accent) font-medium">to deliver</div>
          </div>
        </div>
        <div className="text-[9px] font-mono text-(--accent) font-bold">✓ Perfect pacing - no over-explaining</div>
      </div>
    ),
  },
  {
    id: 4,
    icon: BrainCircuit,
    label: "STAR Method AI Guidance",
    title: "Full AI Interview Guidance in STAR Format - Behavioral Questions",
    desc: "For behavioral and situational questions, get a complete STAR method outline (Situation, Task, Action, Result) - with your real resume experience woven in automatically.",
    tag: "STAR Method Deep Mode",
    preview: (
      <div className="w-full h-full flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">STAR Framework Mode</span>
          <span className="text-[9px] bg-(--accent-soft) text-(--accent) font-bold px-2 py-0.5 rounded-full border border-(--accent)/30">Full Answer</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "S", name: "Situation", text: "Redesigning Acme's platform under a 6-week product deadline with competing stakeholder demands." },
            { label: "T", name: "Task", text: "Align PM, design, and engineering on a single prioritized feature scope without delaying launch." },
            { label: "A", name: "Action", text: "Facilitated a 2-hour RICE matrix workshop - scored 12 features on impact vs. effort objectively." },
            { label: "R", name: "Result", text: "Shipped on time. Stakeholder satisfaction 94%. Feature adoption hit 67% in the first week." },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-(--border-light) rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-(--accent) text-white text-[9px] font-black flex items-center justify-center">{s.label}</span>
                <span className="text-[9px] font-mono font-bold text-(--accent) uppercase">{s.name}</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-snug">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono text-(--accent) font-bold">✓ Full STAR response built from your resume in 1.5s</div>
      </div>
    ),
  },
  {
    id: 5,
    icon: ShieldAlert,
    label: "Calm Interview Anxiety",
    title: "Never Blank Out - Confidence Reminders Always Visible",
    desc: "Calm, concise AI prompts show your top achievements, pacing reminders, and STAR cues so you stay grounded under interview anxiety. The free plan includes this feature.",
    tag: "Calm Interview Anxiety",
    preview: (
      <div className="w-full h-full flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">Confidence Panel</span>
          <span className="text-[9px] bg-(--accent-soft) text-(--accent) font-bold px-2 py-0.5 rounded-full">Active</span>
        </div>
        <div className="bg-white border border-(--accent)/20 rounded-lg p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-(--accent-soft) text-(--accent) text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">✓</span>
            <div>
              <div className="text-[10px] font-bold text-slate-700">STAR Method is active</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Stick to Situation → Task → Action → Result</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-(--accent-soft) text-(--accent) text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">✓</span>
            <div>
              <div className="text-[10px] font-bold text-slate-700">Maintain natural eye contact</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Look at camera, not the screen</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-(--accent-soft) text-(--accent) text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">⏱</span>
            <div>
              <div className="text-[10px] font-bold text-slate-700">Keep answers under 2 minutes</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Concise answers score higher in scoring rubrics</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border border-(--accent)/20 rounded-lg p-3.5">
          <span className="text-[9px] font-mono font-bold text-(--accent) uppercase tracking-widest block mb-2">Your key achievements</span>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-600">• 40% bundle reduction at Acme Corp</span>
            <span className="text-[10px] text-slate-600">• Led 6-person cross-functional team</span>
            <span className="text-[10px] text-slate-600">• 94% stakeholder satisfaction score</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-(--accent) font-bold">✓ You've got this - your experience is your edge</div>
      </div>
    ),
  },
];

export default function BentoFeatures() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const featureLinks = [
    "/features/resume-jd-alignment",
    "/features/resume-jd-alignment",
    "/features/live-transcription",
    "/features/live-transcription",
    "/features/resume-jd-alignment",
    "/features/stealth-overlay"
  ];

  const sectionRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeFeature = features[active];

  const goTo = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  // Intersection Observer to detect when the section is in viewport
  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.15, // trigger when 15% of the section is visible
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return p + 100 / (AUTOPLAY_DURATION / 50);
      });
    }, 50);

    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
      setProgress(0);
    }, AUTOPLAY_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [active, isPaused, isInView]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section-frost relative py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-peach w-[450px] h-[450px] -top-40 right-0 animate-float-orb opacity-50" />
      <div className="orb orb-slate w-[350px] h-[350px] bottom-0 -left-40 animate-float-orb-slow opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary-dark)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The AI Interview Answer Generator{" "}
              <span className="text-gradient-coral">That Works Live During Calls</span>
            </h2>
            <p className="text-(--text-muted-dark) text-base mt-3 max-w-xl mx-auto leading-relaxed">
              Every feature works in real time - completely undetectable by your interviewer. Free to try. The best AI interview helper for Zoom, Teams, and Google Meet.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Showcase - left tabs + right preview */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-stretch"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left: Feature Tab List */}
          <div className="flex flex-col gap-2">
            {features.map((f, i) => {
              const Icon = f.icon;
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => { goTo(i); setIsPaused(true); }}
                  className={`group relative w-full text-left rounded-[8px] px-4 py-4 transition-all duration-300 border overflow-hidden ${isActive
                    ? "bg-white border-(--accent)/30 shadow-md"
                    : "bg-white/40 border-transparent hover:bg-white/70 hover:border-(--border-light)"
                    }`}
                >
                  {/* Progress bar at bottom of active tab */}
                  {isActive && !isPaused && (
                    <div
                      className="absolute bottom-0 left-0 h-[2px] bg-(--accent) transition-none rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
                      ? "bg-(--accent) text-white shadow-sm"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Label + Title */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-[9px] font-mono font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? "text-(--accent)" : "text-slate-400"
                        }`}>
                        {String(i + 1).padStart(2, "0")} · {f.label}
                      </div>
                      <div className={`text-sm font-bold mt-0.5 leading-snug transition-colors duration-300 truncate ${isActive ? "text-(--text-primary)" : "text-slate-500"
                        }`}>
                        {f.title}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-300 ${isActive ? "text-(--accent) translate-x-0.5" : "text-slate-300"
                      }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Animated Preview Panel */}
          <div className="bg-white border border-(--border-light) rounded-[6px] shadow-md overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="h-full flex flex-col"
              >
                {/* Panel Header */}
                <div className="flex items-start justify-between p-6 pb-5 border-b border-slate-100">
                  <div>
                    <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border mb-2 bg-(--accent-soft) text-(--accent) border-(--accent)/20">
                      {activeFeature.tag}
                    </span>
                    <h3 className="text-xl font-extrabold text-(--text-primary) leading-snug max-w-sm">
                      {activeFeature.title}
                    </h3>
                    <p className="text-sm text-(--text-muted) mt-1.5 leading-relaxed max-w-md">
                      {activeFeature.desc}
                    </p>
                    {featureLinks[active] && (
                      <div className="mt-3">
                        <Link
                          href={featureLinks[active]}
                          className="inline-flex items-center gap-1 text-xs font-bold text-(--accent) hover:text-[#f06b57] transition cursor-pointer"
                        >
                          Explore feature details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-[6px] flex items-center justify-center shrink-0 ml-4 bg-(--accent-soft)">
                    <activeFeature.icon className="w-5 h-5 text-(--accent)" />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="flex-1 p-6 bg-slate-50/60">
                  <div className="h-full">
                    {activeFeature.preview}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: dot pagination */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${i === active ? "w-6 h-2 bg-(--accent)" : "w-2 h-2 bg-slate-200"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
