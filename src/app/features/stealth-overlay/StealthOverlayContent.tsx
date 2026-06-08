"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield, Sparkles, Monitor, AppWindow, CheckCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../components/landing/Navbar";
import CtaFooter from "../../components/landing/CtaFooter";
import Faq from "../../components/landing/Faq";

export default function StealthOverlayContent() {
  const [hudOpacity, setHudOpacity] = useState<number>(0.85);

  const customFaqs = [
    {
      q: "Is the overlay really invisible on Zoom, Teams, Meet, and Slack?",
      a: "Yes. The desktop application uses advanced screen capture bypass technology. Any tool or software capturing or recording your screen sees only a standard desktop. The helper overlay remains visible only to you on your physical monitor.",
    },
    {
      q: "Does this require special admin settings or virtual drivers?",
      a: "No virtual graphic drivers or administrative privileges are needed. The stealth protection integrates directly with your system's rendering engine on launch.",
    },
    {
      q: "Can I adjust the overlay transparency and size?",
      a: "Yes! You can customize HUD opacity (from 10% to 100%), resize text, drag to reposition the box, or enable Click-Through mode which lets you click on the code editor directly underneath the floating text.",
    },
    {
      q: "Is the overlay safe from screenshots?",
      a: "Yes. The display protection applies at the operating system level, ensuring screenshot utilities and record tools get a blank space where the overlay is located.",
    },
    {
      q: "Does it support dual-monitor setups?",
      a: "Absolutely. You can place the overlay HUD on whichever screen you are looking at to keep your natural eye contact aligned with your webcam.",
    }
  ];

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6 select-none">
        <div className="inline-flex items-center gap-2 bg-(--accent-soft) border border-(--accent)/20 px-4 py-1.5 rounded-full text-xs font-semibold text-(--accent)">
          <Monitor className="w-3.5 h-3.5" />
          Secure Stealth Shielding Active
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-(--text-primary) leading-none max-w-3xl font-display" style={{ fontFamily: "var(--font-display)" }}>
          Your Secret Weapon - <br />
          <span className="text-gradient-coral">Nobody Knows It's There</span>
        </h1>
        <p className="text-(--text-muted) text-base md:text-lg max-w-2xl leading-relaxed">
          Our desktop overlay remains completely invisible to screen shares, screenshots, and recording software - visible only to you on your physical monitor.
        </p>
      </section>

      {/* Side-by-Side Screen Simulation */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white border border-(--border-light) rounded-[20px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-8 gap-4 select-none">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
                <AppWindow className="w-5 h-5 text-(--accent)" /> Stealth Comparison Demo
              </h2>
              <p className="text-xs text-slate-500 mt-1">Adjust the slider to preview how the overlay appears on your screen versus what interviewers see.</p>
            </div>

            {/* Opacity slider control */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 border border-slate-200 rounded-[12px]">
              <span className="text-xs font-bold text-slate-600">HUD Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.1"
                value={hudOpacity}
                onChange={(e) => setHudOpacity(parseFloat(e.target.value))}
                className="w-24 accent-(--accent) cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-505 w-8">{Math.round(hudOpacity * 100)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Candidate View */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 select-none">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  Your Screen (Candidate View)
                </span>
              </div>
              <div className="border border-slate-200 bg-slate-900 rounded-[12px] p-5 h-80 relative overflow-hidden flex flex-col justify-between font-mono text-xs select-none">
                {/* Fake code editor */}
                <div className="text-slate-500 space-y-1">
                  <div><span className="text-purple-400">const</span> solveQuestion = (nums) =&gt; &#123;</div>
                  <div>  <span className="text-purple-400">let</span> totalSum = <span className="text-amber-400">0</span>;</div>
                  <div>  <span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-amber-400">0</span>; i &lt; nums.length; i++) &#123;</div>
                  <div>    totalSum += nums[i];</div>
                  <div>  &#125;</div>
                  <div>  <span className="text-purple-400">return</span> totalSum;</div>
                  <div>&#125;;</div>
                </div>

                {/* Floating HUD Overlay */}
                <div
                  className="absolute bottom-4 right-4 w-72 bg-slate-950/90 backdrop-blur-md border border-(--accent)/30 rounded-[12px] p-4 shadow-xl z-20 transition-opacity duration-300"
                  style={{ opacity: hudOpacity }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-[10px] text-(--accent) font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Overlay HUD Box
                    </span>
                    <span className="text-[8px] bg-(--accent-soft) text-(--accent) px-1.5 py-0.5 rounded-full font-bold">Stealth Active</span>
                  </div>
                  <div className="space-y-2 text-[10px] text-slate-300 leading-relaxed font-sans font-medium">
                    <div className="flex gap-2">
                      <span className="text-(--accent) font-bold">✦</span>
                      <span>Use a HashMap for O(n) space/time lookup efficiency.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-(--accent) font-bold">✦</span>
                      <span>Watch out for array boundaries and null value exceptions.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-(--accent) font-bold">✓</span>
                      <span>Remember: Maintain active camera eye contact.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Shared Screen */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 select-none">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  Interviewer View (Zoom/Meet Shared Screen)
                </span>
              </div>
              <div className="border border-slate-200 bg-slate-900 rounded-[12px] p-5 h-80 relative overflow-hidden flex flex-col justify-between font-mono text-xs select-none">
                {/* Fake code editor (Identical clone) */}
                <div className="text-slate-500 space-y-1">
                  <div><span className="text-purple-400">const</span> solveQuestion = (nums) =&gt; &#123;</div>
                  <div>  <span className="text-purple-400">let</span> totalSum = <span className="text-amber-400">0</span>;</div>
                  <div>  <span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-amber-400">0</span>; i &lt; nums.length; i++) &#123;</div>
                  <div>    totalSum += nums[i];</div>
                  <div>  &#125;</div>
                  <div>  <span className="text-purple-400">return</span> totalSum;</div>
                  <div>&#125;;</div>
                </div>

                {/* NO HUD OVERLAY VISIBLE AT ALL */}
                <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-950/20 border border-slate-800/80 text-[10px] text-slate-500 px-3 py-1.5 rounded-[6px]">
                    [HUD Window Excluded From Capture]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-6 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
            Engineered for <span className="text-gradient-coral">Absolute Comfort</span>
          </h2>
          <p className="text-(--text-muted) text-sm leading-relaxed mb-6">
            Video calling software captures your screen by recording the windows layered on your desktop. CrackTheLoop overrides these system hooks to keep our overlay hidden, providing you with absolute safety while speaking.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Clean Process Execution</h4>
                <p className="text-xs text-slate-500 leading-normal">Runs independently from browser tasks so web interview portals cannot inspect it.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">OBS/Zoom/Teams Compatible</h4>
                <p className="text-xs text-slate-500 leading-normal">Guaranteed protection against screen captures, recorders, and sharing pipelines.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Click-Through Ghost HUD</h4>
                <p className="text-xs text-slate-500 leading-normal">Clicks pass straight through the overlay box to your code editor, so your typing workflow is never interrupted.</p>
              </div>
            </div>
          </div>
        </div>

        {/* B2C Layout: Key Outcommes */}
        <div className="bg-white border border-(--border-light) rounded-[20px] p-8 shadow-sm flex flex-col gap-6">
          <span className="text-xs font-bold text-(--accent) tracking-wider flex items-center gap-1.5 font-mono uppercase">
            <ShieldCheck className="w-4 h-4 text-(--accent)" /> Private by design. Invisible by default.
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Whether you use the web version or the downloadable desktop application, CrackTheLoop keeps your interview assistance safe and unseen.
          </p>

          <div className="flex flex-col gap-3 text-xs text-slate-700">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">Web Copilot (Zero Install)</p>
              <p className="text-[11px] text-slate-500">Perfect for browser-based coding tools. Operates in a floating sidebar layout on your browser.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">Desktop App (Full Stealth)</p>
              <p className="text-[11px] text-slate-500">Excludes itself from system-wide video captures. Invisible overlay overlays any application or meeting window.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Custom FAQ Section */}
      <Faq faqList={customFaqs} />

      {/* CTA Footer */}
      <CtaFooter />
    </div>
  );
}
