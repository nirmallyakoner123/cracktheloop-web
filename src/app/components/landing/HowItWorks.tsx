"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Terminal, CheckSquare } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    icon: <Upload className="w-5 h-5" />,
    title: "Upload Resume",
    subtitle: "Candidate Context Setup",
    desc: "Drop your resume or paste your LinkedIn - takes 30 seconds. CrackTheLoop reads your real projects, skills, and metrics to make every suggestion feel like it came from you.",
    points: [
      "Indexes your tech stack, achievements, and impact metrics.",
      "Categorizes past roles for quick behavioral answer mapping.",
      "Stays 100% local - never synced to external servers."
    ]
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Add Job Description",
    subtitle: "Target Requirement Mapping",
    desc: "Paste the target role's JD. The AI instantly pulls required skills, keywords, and priorities - so your answers always hit exactly what the interviewer is scoring for.",
    points: [
      "Extracts must-have technical skills and keywords.",
      "Identifies behavioral themes: leadership, scale, conflict.",
      "Cross-references JD against your resume to find perfect overlap."
    ]
  },
  {
    icon: <Terminal className="w-5 h-5" />,
    title: "Start AI Interview Helper - Invisible to Screen Share",
    subtitle: "Undetectable Stealth Overlay Activation",
    desc: "Launch the overlay when your call begins. Works on Zoom, Meet, and Teams - 100% undetectable by screen sharing software. Uses Win32 Display Affinity so it never appears in recordings or screenshots.",
    points: [
      "Zero virtual audio drivers - nothing shows in device list.",
      "Captures system audio via WASAPI loopback - no mic injection.",
      "Win32 overlay - completely invisible to screen capture & recordings."
    ]
  },
  {
    icon: <CheckSquare className="w-5 h-5" />,
    title: "Get Real-Time AI Interview Guidance Live",
    subtitle: "Real-Time AI Guidance",
    desc: "As each question is asked, AI-generated interview suggestions appear in under 2 seconds - no typing, no searching. Your resume context, STAR framework structure, and JD keywords arrive exactly when you need them.",
    points: [
      "AI interview suggestions generated within 1.5s of question detection.",
      "Surfaces the right resume project at the right moment automatically.",
      "Speech pace alerts keep you sounding calm, confident, and natural."
    ]
  }
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play cycling from step 1 to 4 every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-frost relative min-h-screen flex flex-col justify-center py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-frost w-[400px] h-[400px] top-0 right-0 animate-float-orb" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How the{" "}
              <span className="text-gradient-coral">Free AI Interview Helper</span>{" "}
              Works - Set Up in 3 Minutes
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-2xl mx-auto">
              Upload your resume, paste the job description, and your free AI interview assistant is ready to provide live guidance the moment the interviewer starts speaking.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--accent-soft) border border-(--accent)/20">
              <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse" />
              <span className="text-xs font-bold text-(--accent) tracking-wide">⚡ Free to start. Setup in 3 minutes. Live guidance appears in real time during your session.</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Desktop Timeline */}
        <div className="relative mb-12 hidden md:block select-none">
          {/* Badges Row */}
          <div className="grid grid-cols-4 text-center mb-4">
            {steps.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={i} className="flex justify-center">
                  <button
                    onClick={() => {
                      setActiveStep(i);
                      setIsPaused(true);
                    }}
                    className={`text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-350 px-3 py-1 rounded-full cursor-pointer select-none ${isCurrent
                        ? "text-(--accent) bg-(--accent-soft)"
                        : isActive
                          ? "text-(--text-secondary) bg-slate-100 hover:bg-slate-200"
                          : "text-slate-400 bg-transparent hover:text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    Step 0{i + 1}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Timeline Line & Circles Row */}
          <div className="relative h-6 flex items-center">
            {/* Connector Line */}
            <div className="absolute left-[12.5%] right-[12.5%] h-[2px] bg-slate-100 z-0">
              <motion.div
                className="h-full bg-(--accent)"
                animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {/* Circles Grid */}
            <div className="grid grid-cols-4 w-full relative z-10">
              {steps.map((step, i) => {
                const isActive = i <= activeStep;
                const isCurrent = i === activeStep;
                return (
                  <div key={i} className="flex justify-center items-center">
                    <button
                      onClick={() => {
                        setActiveStep(i);
                        setIsPaused(true);
                      }}
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 bg-white cursor-pointer hover:scale-125 ${isCurrent
                          ? "border-(--accent) bg-(--accent) scale-125 shadow-xs"
                          : isActive
                            ? "border-(--accent) bg-(--accent)"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Cards Grid */}
        <div
          className="hidden md:grid grid-cols-4 gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {steps.map((step, i) => {
            const isCurrent = i === activeStep;
            return (
              <div
                key={i}
                onClick={() => {
                  setActiveStep(i);
                  setIsPaused(true);
                }}
                className={`border rounded-[6px] p-6 transition-all duration-500 flex flex-col cursor-pointer justify-between ${isCurrent
                    ? "bg-white border-(--accent) shadow-md scale-[1.03] -translate-y-2 z-10"
                    : "bg-white/40 border-(--border-light) opacity-70 hover:opacity-100 hover:bg-white/80 hover:border-slate-350 hover:-translate-y-1 hover:shadow-xs"
                  }`}
              >
                <div className="flex flex-col gap-4">
                  {/* Icon Header */}
                  <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center border transition-all duration-500 ${isCurrent
                      ? "bg-(--accent) text-white border-(--accent-bright) shadow-sm"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                    {step.icon}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors duration-500 ${isCurrent ? "text-(--accent)" : "text-slate-400"
                      }`}>
                      {step.subtitle}
                    </span>
                    <h3 className={`text-lg font-extrabold mt-1 transition-colors duration-500 ${isCurrent ? "text-(--text-primary)" : "text-slate-700"
                      }`}>
                      {step.title}
                    </h3>
                  </div>

                  {/* Description Paragraph */}
                  <p className={`text-sm leading-relaxed transition-colors duration-500 ${isCurrent ? "text-(--text-secondary)" : "text-(--text-muted)"
                    }`}>
                    {step.desc}
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="flex flex-col gap-3 mt-6 pt-5 border-t border-slate-100 text-xs text-(--text-secondary) font-medium">
                  {step.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className={`transition-colors duration-500 shrink-0 ${isCurrent ? "text-(--accent) font-bold" : "text-slate-300"
                        }`}>
                        ✓
                      </span>
                      <span className={`leading-snug transition-colors duration-500 ${isCurrent ? "text-(--text-secondary)" : "text-(--text-muted)"
                        }`}>
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative pl-6 flex flex-col gap-8">
          {/* Vertical line */}
          <div className="absolute top-2 bottom-2 left-[7px] w-[2px] bg-slate-100">
            <motion.div
              className="w-full bg-(--accent) origin-top h-full"
              animate={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, i) => {
            const isActive = i <= activeStep;
            const isCurrent = i === activeStep;
            return (
              <div key={i} className="relative flex flex-col gap-3">
                {/* Node Circle */}
                <button
                  onClick={() => {
                    setActiveStep(i);
                    setIsPaused(true);
                  }}
                  className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all duration-300 cursor-pointer hover:scale-125 ${isCurrent
                      ? "border-(--accent) bg-(--accent) scale-110 shadow-xs"
                      : isActive
                        ? "border-(--accent) bg-(--accent)"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                />

                {/* Badge & Title */}
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${isCurrent
                      ? "text-(--accent) bg-(--accent-soft)"
                      : "text-slate-400 bg-slate-50"
                    }`}>
                    Step 0{i + 1}
                  </span>
                  <h3 className={`text-sm font-bold transition-colors ${isCurrent ? "text-(--accent)" : "text-(--text-primary)"
                    }`}>
                    {step.title}
                  </h3>
                </div>

                {/* Checklist Card */}
                <div
                  onClick={() => {
                    setActiveStep(i);
                    setIsPaused(true);
                  }}
                  className={`border rounded-[8px] p-5 transition-all duration-500 flex flex-col gap-3 cursor-pointer ${isCurrent
                      ? "bg-white border-(--accent) shadow-md"
                      : "bg-white/40 border-(--border-light) opacity-70 hover:opacity-100 hover:bg-white/80 hover:border-slate-350"
                    }`}
                >
                  <p className="text-sm text-(--text-secondary) leading-relaxed">
                    {step.desc}
                  </p>
                  <ul className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-100 text-xs text-(--text-secondary) font-medium">
                    {step.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className={`transition-colors duration-500 shrink-0 ${isCurrent ? "text-(--accent)" : "text-slate-400"
                          }`}>
                          ✓
                        </span>
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
