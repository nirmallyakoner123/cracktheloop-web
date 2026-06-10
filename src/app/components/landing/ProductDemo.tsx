"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, Briefcase, FileText, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const simulationData = [
  {
    question: "Tell me about a project where you solved a difficult problem.",
    resume: "E-commerce platform dashboard redesign project.",
    skills: ["React", "Optimization", "API Design", "Next.js"],
    framework: "STAR",
    steps: [
      { label: "1. Situation & Context", desc: "Redesigned the Acme Corp e-commerce platform dashboard." },
      { label: "2. Complication & Challenge", desc: "Page load latency spiked by 40%, dropping customer conversion." },
      { label: "3. Action Executed", desc: "Implemented route-based code splitting and component memoization." },
      { label: "4. Quantified Outcome", desc: "Cut bundle sizes by 45% and recovered initial load drop." },
      { label: "5. Alignment Connection", desc: "Demonstrates core performance optimization skills from the JD." }
    ]
  },
  {
    question: "How do you handle scaling a service when traffic spikes unexpectedly?",
    resume: "Real-time chat notification service (Node.js, Redis, WebSockets).",
    skills: ["Redis", "Node.js", "WebSockets", "System Design"],
    framework: "CAR",
    steps: [
      { label: "1. Context & Scale", desc: "High-throughput real-time messaging pipeline handling 50k req/sec." },
      { label: "2. Complication & Challenge", desc: "Redis memory saturation during daily peak hours crashed workers." },
      { label: "3. Action Executed", desc: "Configured pub/sub clustering and optimized payload structures." },
      { label: "4. Quantified Outcome", desc: "Achieved 99.99% availability during traffic spikes, cutting latency by 35%." },
      { label: "5. Alignment Connection", desc: "Highlights distributed caching and backend scalability experience." }
    ]
  },
  {
    question: "Describe a time when you had a disagreement with a product manager.",
    resume: "SaaS client portal development (prioritization workshops).",
    skills: ["Collaboration", "Agile", "Product Delivery", "Negotiation"],
    framework: "STAR",
    steps: [
      { label: "1. Situation & Context", desc: "Disagreement on adding a heavy feature right before a release." },
      { label: "2. Complication & Conflict", desc: "PM wanted to push feature immediately; engineering feared bugs." },
      { label: "3. Action Executed", desc: "Facilitated a quick RICE prioritization risk assessment workshop." },
      { label: "4. Quantified Outcome", desc: "Agreed to release feature in Phase 2, maintaining timeline stability." },
      { label: "5. Alignment Connection", desc: "Evidences cross-functional collaboration and stakeholder management." }
    ]
  },
  {
    question: "How do you optimize initial page load performance in a React application?",
    resume: "Next.js billing portal optimization dashboard.",
    skills: ["React", "Next.js", "Performance", "Lighthouse"],
    framework: "STAR",
    steps: [
      { label: "1. Situation & Context", desc: "Optimizing a heavy analytics dashboard load speed." },
      { label: "2. Complication & Diagnostic", desc: "Initial Lighthouse score was 48 due to unoptimized assets." },
      { label: "3. Action Executed", desc: "Replaced heavy packages, enabled SSR caching, and lazy-loaded modules." },
      { label: "4. Quantified Outcome", desc: "Boosted Lighthouse score to 92 and halved Largest Contentful Paint (LCP)." },
      { label: "5. Alignment Connection", desc: "Demonstrates deep technical knowledge of Next.js and page speed mechanics." }
    ]
  },
  {
    question: "Tell me about a time you made a mistake at work and how you handled it.",
    resume: "Internal tooling release (ci/cd rollback pipeline).",
    skills: ["CI/CD", "Incident Response", "Git", "Communication"],
    framework: "STAR",
    steps: [
      { label: "1. Situation & Context", desc: "Pushed a database configuration error to production." },
      { label: "2. Complication & Incident", desc: "Caused a 5-minute checkout outage for 4% of active users." },
      { label: "3. Action Executed", desc: "Immediately rolled back deployment, resolved config, and wrote a post-mortem." },
      { label: "4. Quantified Outcome", desc: "Created automated pre-deployment check scripts to prevent future errors." },
      { label: "5. Alignment Connection", desc: "Illustrates professional accountability and strong problem-solving under pressure." }
    ]
  }
];

export default function ProductDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [answersVisible, setAnswersVisible] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Autoplay simulation when section is scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      setIsLoading(false);
      setQuestionText("");
      setAnswersVisible(0);
      
      const currentData = simulationData[currentIdx];
      let index = 0;
      
      const typeQuestion = () => {
        if (index < currentData.question.length) {
          setQuestionText(currentData.question.substring(0, index + 1));
          index++;
          timer = setTimeout(typeQuestion, 25);
        } else {
          // Question complete, show loader
          setIsLoading(true);
          timer = setTimeout(() => {
            setIsLoading(false);
            // Reveal answer steps one by one
            let stepIndex = 0;
            const revealSteps = () => {
              if (stepIndex <= currentData.steps.length) {
                setAnswersVisible(stepIndex);
                stepIndex++;
                timer = setTimeout(revealSteps, 1250);
              } else {
                // Loop to the next question after a brief delay if autoplay is enabled
                if (isAutoplay) {
                  timer = setTimeout(() => {
                    setCurrentIdx((prev) => (prev + 1) % simulationData.length);
                  }, 5000);
                }
              }
            };
            revealSteps();
          }, 1000);
        }
      };
      
      typeQuestion();
    } else {
      // Default state when not running
      setQuestionText(simulationData[currentIdx].question);
      setAnswersVisible(simulationData[currentIdx].steps.length);
      setIsLoading(false);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentIdx, isAutoplay]);

  const currentData = simulationData[currentIdx];
  const isQuestionDone = questionText === currentData.question;

  return (
    <section ref={sectionRef} id="product-demo" className="section-frost relative py-20 md:py-24 overflow-hidden">
      <div className="orb orb-peach w-[500px] h-[500px] top-1/4 -left-40 animate-float-orb opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-6">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              See Your Copilot in{" "}
              <span className="text-gradient-coral">Action</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto">
              Select an interview question below to watch the interactive simulator analyze the audio, match context, and stream response outlines.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="w-full">
          {/* Main App Window */}
          <div className="w-full bg-white border border-(--border-light) rounded-[6px] shadow-lg overflow-hidden flex flex-col">
            {/* macOS-style Window Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0 select-none">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/10" />
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/10" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/10" />
              </div>
              
              <span className="text-[11px] font-mono text-slate-400 font-bold">
                stealth_copilot_session.exe • {isAutoplay ? "Auto-Align Feed" : "Interactive Feed"} (Q{currentIdx + 1}/{simulationData.length})
              </span>

              {/* Balancer spacer */}
              <div className="w-[52px] h-3 hidden sm:block" />
            </div>

            {/* Inner Dashboard Layout */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
              {/* Column 1: Interviewer Question & Audio Aligner (Completely Flat Card) */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-[6px] p-5 flex flex-col min-h-[360px] justify-between">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <MessageSquare className="w-4 h-4 text-(--accent)" />
                    Live Audio Aligner
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isPlaying && !isQuestionDone ? "bg-red-500 animate-pulse" : "bg-(--accent)"}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {isPlaying && !isQuestionDone ? "Streaming" : "Standby"}
                    </span>
                  </div>
                </div>

                {/* Waveform Visualizer & Transcribed Feed (Flat Layout) */}
                <div className="flex-1 flex flex-col justify-between py-4 gap-6">
                  {/* Waveform Area (No nested box!) */}
                  <div className="flex items-end justify-center gap-[3px] h-14 shrink-0 relative select-none">
                    {isPlaying && !isQuestionDone ? (
                      [4, 12, 22, 14, 8, 26, 38, 30, 16, 34, 44, 24, 12, 18, 6].map((h, i) => (
                        <span
                          key={i}
                          className="w-[2.5px] bg-(--accent) rounded-full animate-bounce-audio shrink-0"
                          style={{
                            height: `${h}px`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))
                    ) : (
                      <span className="text-[9px] font-mono text-slate-400 italic">No voice activity...</span>
                    )}
                  </div>

                  {/* Transcribed Text Feed (No nested box!) */}
                  <div className="flex-1 flex flex-col justify-start">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Transcribed Feed
                    </span>
                    <p className="text-[12px] font-mono text-slate-700 leading-relaxed text-left">
                      {questionText || (isPlaying ? "..." : currentData.question)}
                      {isPlaying && !isQuestionDone && (
                        <span className="w-1.5 h-3.5 bg-(--accent) animate-pulse inline-block ml-0.5 align-middle" />
                      )}
                    </p>
                  </div>
                </div>

                {/* Footer inside Column 1 */}
                <div className="text-[9px] font-mono text-slate-400 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span>Input: Default mic (44.1 kHz)</span>
                  <span>Buffer: Active</span>
                </div>
              </div>

              {/* Column 2: Context Mapping */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-[6px] p-5 flex flex-col min-h-[360px] justify-between">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Briefcase className="w-4 h-4 text-(--accent)" />
                    Context Mapping
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Static</span>
                </div>
                
                <div className="flex-1 flex flex-col gap-3 py-4">
                  <div className="bg-white rounded-[6px] p-3.5 flex items-start gap-2.5 shadow-xs border-0">
                    <FileText className="w-4 h-4 text-(--accent) shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-700 block mb-0.5">Resume Context</span>
                      <span className="text-[10px] text-slate-500 leading-normal block">
                        {currentData.resume}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-[6px] p-3.5 flex items-start gap-2.5 shadow-xs border-0">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-700 block mb-1.5">JD Keyword Match</span>
                      {isPlaying && !isQuestionDone ? (
                        <span className="text-[9px] font-mono font-bold text-(--accent) animate-pulse flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-ping" />
                          Extracting requirements...
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {currentData.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-(--accent-soft) text-(--accent) border border-(--accent)/20 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-slate-400 pt-3 border-t border-slate-100">
                  {isPlaying && !isQuestionDone
                    ? "Aligning candidate context..."
                    : "✓ Profile alignment complete (100% matched)"}
                </div>
              </div>

              {/* Column 3: Suggested Answer Flow */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-[6px] p-5 flex flex-col min-h-[360px] justify-between relative overflow-hidden">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Sparkles className="w-4 h-4 text-(--accent)" />
                    Suggested Answer Guideline
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">STAR Feed</span>
                </div>

                <div className="flex flex-col gap-3 min-h-[220px] py-4">
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full my-auto gap-2">
                      <div className="w-6 h-6 border-2 border-(--accent) border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-mono text-slate-400">AI mapping response...</span>
                    </div>
                  )}

                  {!isLoading && currentData.steps.map((step, idx) => {
                    const isVisible = idx < answersVisible;
                    const isProcessing = idx === answersVisible && !isLoading && isPlaying;
                    return (
                      <div
                        key={idx}
                        className={`transition-all duration-500 flex flex-col gap-0.5 border-l-2 pl-3 py-0.5 ${
                          isVisible
                            ? "border-(--accent) opacity-100 translate-x-0"
                            : isProcessing
                              ? "border-(--accent-bright) border-dashed opacity-80 translate-x-1"
                              : "border-slate-100 opacity-40 translate-x-0 pointer-events-none"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold text-slate-800">{step.label}</span>
                          {isVisible ? (
                            <span className="text-[8px] font-mono font-bold text-(--accent) bg-(--accent-soft) px-1 py-0.2 rounded shrink-0">
                              ✓ SUGGESTED
                            </span>
                          ) : isProcessing ? (
                            <span className="text-[8px] font-mono font-bold text-(--accent) bg-(--accent-soft) px-1 py-0.2 rounded animate-pulse shrink-0">
                              ● PARSING...
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-50 px-1 py-0.2 rounded shrink-0">
                              ○ QUEUED
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 leading-normal">{step.desc}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[9px] font-mono text-slate-400 pt-3 border-t border-slate-100 flex items-center justify-between font-bold">
                  <span>Framework: {currentData.framework}</span>
                  <span>Steps: {answersVisible}/{currentData.steps.length}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
