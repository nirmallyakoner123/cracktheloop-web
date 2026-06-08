"use client";

import { useState } from "react";
import {
  Shield,
  Zap,
  Volume2,
  EyeOff,
  ArrowRight,
  Check,
  Home,
  Globe,
  ChevronDown,
  Sparkles,
  Lock,
  Download
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden pb-16">

      {/* Background Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
          <img src="/logo.png" className="h-10 w-auto select-none object-contain" alt="CrackTheLoop Logo Icon" />
          <span className="font-bold tracking-tight text-xl text-white" style={{ fontFamily: "var(--font-display)" }}>
            Crack<span className="text-gradient-coral font-black">TheLoop</span>
          </span>
        </Link>
        <div className="flex items-center gap-6 font-semibold">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing</Link>
          <Link
            href="/copilot"
            className="text-xs px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-bold hover:brightness-110 transition active:scale-95 shadow-md shadow-indigo-600/25 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" /> Launch Copilot
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Zero-Trace Performance & Privacy Shield
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white" id="features-main-heading" style={{ fontFamily: "var(--font-display)" }}>
          The Invisible Advantage - Built for <span className="text-gradient-coral">Winning Interviews</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          CrackTheLoop processes conversation flow in real-time, delivering instant, custom-tailored suggestions for technical and behavioral questions completely invisibly.
        </p>
      </section>

      {/* Features Grid & Deep Dives */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-16 relative z-20 flex flex-col gap-16">

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-8 flex flex-col gap-4" id="feature-latency-card">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex justify-center items-center text-sky-400 border border-sky-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Instant Answers</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No awkward pauses or typing required. Real-time speech processing surfaces helpful talking points and concepts in under 2 seconds.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-8 flex flex-col gap-4" id="feature-affinity-card">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex justify-center items-center text-purple-400 border border-purple-500/20">
              <EyeOff className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">100% Invisible Stealth</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Worry-free privacy. The desktop overlay uses hardware-level display filters that completely bypass screenshots, screen sharing, and recordings.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] p-8 flex flex-col gap-4" id="feature-mixing-card">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex justify-center items-center text-emerald-400 border border-emerald-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Dual-Channel Hearing</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically captures both speaker output (the interviewer) and mic input (your voice) natively, ensuring complete context for every recommendation.
            </p>
          </div>

        </div>

        {/* Deep Dive Section 1: Screen Share Bypass */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-900/40 border border-slate-800 p-8 md:p-10 rounded-[24px]" id="evasion-deep-dive">
          <div className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-purple-300 uppercase tracking-widest">
              Secured Overlay Protection
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>How the Stealth Mode Works</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              During video calls, conferencing applications capture your desktop output to share with the interviewer. CrackTheLoop intercepts these system-level video request pipelines to active windows.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              By excluding our overlay HUD window from frame capture loops, video software receives a pristine view of whatever is behind the assistant. You see the overlay directly on top of your call, while screen shares see only a standard desktop.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Fully hidden on Zoom, Google Meet, Teams, Slack, and Discord.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Bypasses standard screenshots and video recorder snapshots.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Runs natively without virtual video or graphic driver overrides.
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/features/stealth-overlay"
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
              >
                Explore Stealth Overlay HUD <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-900 rounded-[20px] p-8 flex flex-col gap-6 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest font-black">Stealth Verification</span>
            </div>

            {/* Visual Indicator of Overlay Exclusion */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Your Screen View</span>
                <div className="w-full h-16 bg-slate-800/50 rounded-lg flex items-center justify-center border border-purple-500/30 relative overflow-hidden">
                  <span className="text-[11px] font-bold text-purple-400">✨ HUD Suggestion Box</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-2">HUD window is fully visible to you during the call.</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Interviewer Screen Share</span>
                <div className="w-full h-16 bg-slate-800/50 rounded-lg flex items-center justify-center border border-dashed border-slate-800 relative overflow-hidden">
                  <span className="text-[11px] font-medium text-slate-600">Clean Desktop</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-2">Only your shared browser or app is visible to them.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Section 2: Audio Engineering & Conversational Processing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-900/40 border border-slate-800 p-8 md:p-10 rounded-[24px]" id="audio-deep-dive">
          <div className="bg-slate-950 border border-slate-900 rounded-[20px] p-8 flex flex-col gap-6 shadow-inner order-last md:order-first">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest font-black">Audio Processing Flow</span>
            </div>

            <div className="flex flex-col gap-4 font-sans text-xs text-slate-300">
              <div className="flex items-center gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-[10px]">1</div>
                <div>
                  <p className="font-bold text-white text-xs">Simultaneous Audio Intake</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Captures system speakers and local microphone input natively.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-[10px]">2</div>
                <div>
                  <p className="font-bold text-white text-xs">Conversational Processing</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Cleans background noise, echoes, and extracts voice signals.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-[10px]">3</div>
                <div>
                  <p className="font-bold text-white text-xs">Real-Time Suggestions</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Streams structured talking points directly to the active screen.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
              Intuitive Audio Intake
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Native Conversational Processing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Technical interviews require both listening to complex questions and answering them articulately. Traditional speech tools require separate configuration files or complex microphone alignments.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              CrackTheLoop binds speaker output and local mic streams into a single clean audio flow. It processes voices, downsamples background static, and converts speech into instant textual triggers - passing them directly to our context alignment engine.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Bypasses complex virtual audio driver installations.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Cleans up interviewer speaker sounds and candidate voice inputs.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Delivers responses based on the full verbal context.
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/features/live-transcription"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
              >
                Explore Live Audio Transcription <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Candidate FAQ */}
      <CandidateFaqSection />

      {/* CTA section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-24 text-center select-none z-20">
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-slate-900 rounded-[20px] p-10 flex flex-col items-center gap-6">
          <h4 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Ready to try the stealth copilot?</h4>
          <p className="text-slate-400 text-xs max-w-md">
            Test the live transcription engine and interactive interface directly in your browser with our evaluation platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 shadow-lg shadow-purple-950/20"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#platform-picker"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider transition active:scale-95"
            >
              View Desktop Platforms
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 pt-24 text-center text-xs text-slate-500 relative z-20 border-t border-slate-900 mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
        <span>© 2026 CrackTheLoop. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-500/85 font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Stealth Shield Technology Enabled
        </span>
      </footer>

    </div>
  );
}

function CandidateFaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can interviewers or video platforms detect CrackTheLoop?",
      a: "No. The desktop client uses native operating system display attributes to completely hide the overlay window from recording and sharing calls. Zoom, Microsoft Teams, Google Meet, Slack, and Discord see only your wallpaper or active presentation. Audio is routed internally and does not add any virtual audio devices to your system settings.",
    },
    {
      q: "Does it require complex installation?",
      a: "No. You can run the Web Copilot immediately in your browser on any device. For native screen share bypass protection, download our lightweight desktop application for Windows or macOS - it takes less than 60 seconds to configure.",
    },
    {
      q: "How fast do suggestions appear?",
      a: "Suggestions appear in under 2 seconds. The moment the interviewer finishes asking a question, CrackTheLoop completes the transcription and displays structured talking points to help guide your answer.",
    },
    {
      q: "Is my personal data secure?",
      a: "Yes. All resumes and job description data are indexed locally. Your conversation transcripts are processed temporarily and transiently to generate suggestions, and are never saved, recorded, or used for model training.",
    },
    {
      q: "Which models power the recommendations?",
      a: "We route prompts through state-of-the-art LLMs (including Claude 3.5 Sonnet and GPT-4o-mini) tailored with context from your uploaded resume and the specific job description.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes. Every new account receives free evaluation credits. You can test the full transcription loop and view suggestions without linking any credit card.",
    }
  ];

  return (
    <section id="faq-section" className="w-full max-w-4xl mx-auto px-6 pt-20 pb-8 relative z-20">
      <div className="text-center mb-12 select-none">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/25 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300 mb-5">
          <Sparkles className="w-3.5 h-3.5" /> Frequently Asked Questions
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>Questions Candidates Ask</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">Learn more about stealth capabilities, privacy, and how it helps you win.</p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-[16px] border border-slate-900 bg-slate-900/30 overflow-hidden transition-all duration-300 hover:border-slate-800"
          >
            <button
              id={`faq-q-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ${open === i ? "rotate-180 text-purple-400" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-900 pt-5">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
