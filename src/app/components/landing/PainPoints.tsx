"use client";

import { BrainCircuit, FileText, Briefcase } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const painPoints = [
  {
    title: "Interview Anxiety & Blanking Out",
    desc: "Under pressure, speech speed spikes and verbal fillers take over. You lose track of key technical details - every candidate's biggest interview anxiety. AI interview helpers like CrackTheLoop keep you grounded.",
    mockup: (
      <div className="flex-1 p-4 flex flex-col justify-between font-mono text-[10px] select-none bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-(--accent) font-bold text-[9px] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse" />
            Live Speech Analytics
          </span>
          <span className="text-slate-400 text-[8px]">CALM: ACTIVE</span>
        </div>

        <div className="flex flex-col gap-2.5 my-auto">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Speech Rate</span>
            <span className="font-bold text-slate-800">130 WPM (Natural)</span>
          </div>
          {/* Speedometer line */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
            <div className="absolute left-[25%] right-[25%] h-full bg-(--accent) rounded-full" />
            <div className="absolute left-[45%] w-2.5 h-2.5 -top-[2px] rounded-full bg-(--accent) border-2 border-white shadow-xs" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-50 text-slate-600">
          <span className="font-bold text-[9px] uppercase text-slate-400 tracking-wider">Active Blockers</span>
          <div className="flex items-center gap-1.5 text-(--accent) font-semibold text-[9px]">
            <span>✓</span>
            <span>Keep natural eye contact</span>
          </div>
          <div className="flex items-center gap-1.5 text-(--accent) font-semibold text-[9px]">
            <span>✓</span>
            <span>Take a deep breath</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Generic AI Interview Responses",
    desc: "Failing to bridge your real achievements with the job description results in generic answers. You need an AI interview assistant that uses YOUR resume - not the internet.",
    mockup: (
      <div className="flex-1 p-4 flex flex-col justify-between select-none relative overflow-hidden bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-(--accent) font-bold text-[9px] uppercase tracking-wider">
            Context Mapper
          </span>
          <span className="text-(--accent) text-[8px] font-bold">MATCHED</span>
        </div>

        <div className="relative flex items-center justify-between my-auto px-2 h-14">
          {/* Left Node: Resume */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs">
              <FileText className="w-4 h-4 text-(--accent)" />
            </div>
            <span className="text-[8px] font-mono text-slate-400">RESUME</span>
          </div>

          {/* Central Brand Node */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-10 h-10 rounded-full bg-(--accent) text-white flex items-center justify-center shadow-md relative border border-(--accent-bright)">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[8px] font-mono text-(--accent) font-bold">AI ENGINE</span>
          </div>

          {/* Right Node: Job Description */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs">
              <Briefcase className="w-4 h-4 text-(--accent)" />
            </div>
            <span className="text-[8px] font-mono text-slate-400">JOB JD</span>
          </div>

          {/* Connector lines with animated pulses */}
          <div className="absolute left-10 right-10 top-[18px] h-[1px] border-t border-dashed border-slate-200 z-0" />
        </div>

        <div className="text-[8px] font-mono text-center text-slate-400 border-t border-slate-50 pt-2">
          Linking 12 experience points to 4 key JD skills
        </div>
      </div>
    ),
  },
  {
    title: "No STAR Method Structure",
    desc: "Even correct technical content falls flat without structure. Real-time AI interview helpers automatically apply the STAR method - Situation, Task, Action, Result - to every behavioral question.",
    mockup: (
      <div className="flex-1 p-4 flex flex-col justify-between font-mono text-[9px] select-none bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-(--accent) font-bold text-[9px] uppercase tracking-wider">
            Framework Parser
          </span>
          <span className="text-slate-400 text-[8px]">METHOD: STAR</span>
        </div>

        <div className="flex flex-col gap-1 my-auto text-slate-700">
          <div className="flex items-center justify-between bg-(--accent-soft) border border-(--accent)/20 px-2 py-0.5 rounded">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-(--accent)">S</span>
              <span>Situation: Context set</span>
            </div>
            <span className="text-(--accent) font-bold">✓</span>
          </div>

          <div className="flex items-center justify-between bg-(--accent-soft) border border-(--accent)/20 px-2 py-0.5 rounded">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-(--accent)">T</span>
              <span>Task: Goal defined</span>
            </div>
            <span className="text-(--accent) font-bold">✓</span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">A</span>
              <span className="text-slate-600 font-medium">Action: Custom solution</span>
            </div>
            <span className="text-(--accent) font-bold animate-pulse">●</span>
          </div>

          <div className="flex items-center justify-between bg-slate-50/40 border border-dashed border-slate-100 px-2 py-0.5 rounded">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-300">R</span>
              <span className="text-slate-400">Result: Metrics pending</span>
            </div>
            <span className="text-slate-300">○</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Forgetting Key Resume Points",
    desc: "In the heat of the moment, key projects and metrics get forgotten. AI interview suggestions generated from your actual resume surface the right talking points exactly when you need them.",
    mockup: (
      <div className="flex-1 p-4 flex flex-col justify-between font-mono text-[9px] select-none bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-(--accent) font-bold text-[9px] uppercase tracking-wider">
            JD Alignment Scan
          </span>
          <span className="text-(--accent) bg-(--accent-soft) border border-(--accent)/20 px-1.5 py-0.5 rounded font-bold text-[8px]">
            94% MATCH
          </span>
        </div>

        <div className="flex flex-col gap-1.5 my-auto">
          <div className="border-l-2 border-(--accent) pl-2">
            <span className="text-slate-800 font-bold block text-[9px] leading-tight">Senior Frontend Developer</span>
            <span className="text-slate-400 text-[8px]">Acme Inc • 2023–Present</span>
          </div>

          <div className="flex gap-1 flex-wrap mt-0.5">
            <span className="px-1.5 py-0.5 rounded bg-(--accent-soft) text-(--accent) font-bold border border-(--accent)/20 text-[8px] flex items-center gap-0.5">
              <span>✓</span> React
            </span>
            <span className="px-1.5 py-0.5 rounded bg-(--accent-soft) text-(--accent) font-bold border border-(--accent)/20 text-[8px] flex items-center gap-0.5">
              <span>✓</span> Next.js
            </span>
            <span className="px-1.5 py-0.5 rounded bg-(--accent-soft) text-(--accent) font-bold border border-(--accent)/20 text-[8px] flex items-center gap-0.5">
              <span>✓</span> Optimization
            </span>
            <span className="px-1.5 py-0.5 rounded bg-(--accent-soft) text-(--accent) font-bold border border-(--accent)/20 text-[8px] flex items-center gap-0.5">
              <span>✦</span> Scale
            </span>
          </div>
        </div>

        <div className="text-[8px] font-mono text-slate-400 border-t border-slate-50 pt-2 flex justify-between">
          <span>Required: 8 skills</span>
          <span className="text-(--accent) font-bold">7/8 Matched</span>
        </div>
      </div>
    ),
  },
];

export default function PainPoints() {
  return (
    <section id="pain-points" className="section-mist relative py-20 md:py-24 overflow-hidden">
      {/* Subtle floating background orb */}
      <div className="orb orb-slate w-[450px] h-[450px] -bottom-20 -right-20 animate-float-orb-slow opacity-60" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Brain Knows the Answer. <br className="hidden sm:inline" />
              <span className="text-gradient-coral">Your Mouth Betrays You.</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto">
              The best AI interview assistant doesn't just prep you - it provides structured guidance in real time. No more blanking out. No more generic answers that miss the mark.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.08}>
          {painPoints.map((point, i) => (
            <StaggerItem key={i}>
              <div className="flex flex-col w-full group">
                {/* Mockup Card Container */}
                <div aria-hidden="true" className="w-full h-[210px] rounded-[8px] bg-white border border-(--border-light) overflow-hidden flex flex-col shadow-xs transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-(--accent) group-hover:shadow-md">
                  {/* Window Header */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="w-12 h-1 bg-slate-200 rounded-full" />
                  </div>
                  {/* Mockup Content */}
                  {point.mockup}
                </div>
                {/* Title and Description outside card */}
                <h3 className="text-base font-bold text-(--text-primary) mt-5 mb-2 transition-colors duration-300 group-hover:text-(--accent)">
                  {point.title}
                </h3>
                <p className="text-sm text-(--text-muted) leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
