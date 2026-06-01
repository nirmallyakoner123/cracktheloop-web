"use client";

import { useState } from "react";

export default function Home() {
  // Mock SaaS state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [accountKey, setAccountKey] = useState("");
  
  // Interactive Simulator State
  const [simState, setSimState] = useState<"idle" | "listening" | "answering" | "done">("idle");
  const [simQuestion, setSimQuestion] = useState("");
  const [simAnswer, setSimAnswer] = useState("");

  const sampleQuestions = [
    "How does virtual DOM reconciliation work in React?",
    "Explain the difference between TCP and UDP.",
    "What are index types and performance implications in PostgreSQL?"
  ];

  const sampleAnswers: Record<string, string> = {
    "How does virtual DOM reconciliation work in React?": 
      "• React creates a lightweight in-memory representation of the DOM.\n• On state change, it computes a diff between the new virtual representation and the previous snapshot.\n• Uses a heuristic O(n) algorithm to bundle changes and batch updates the real DOM efficiently.",
    "Explain the difference between TCP and UDP.": 
      "• TCP is a connection-oriented protocol ensuring reliability via 3-way handshakes and retransmissions.\n• UDP is connectionless, prioritizing speed by sending packets directly without delivery verification.\n• Use TCP for databases/web traffic, and UDP for real-time video streaming/gaming.",
    "What are index types and performance implications in PostgreSQL?": 
      "• B-Tree: Default index type, ideal for comparison operators (<, <=, =, >=, >) and sorting.\n• Hash Indexes: Excellent for quick exact equality comparisons but do not support range scans.\n• Indexes speed up reads significantly but introduce write overhead as index files must be updated."
  };

  function startSimulation(question: string) {
    setSimState("listening");
    setSimQuestion(question);
    setSimAnswer("");
    
    // Simulate speech-to-text typing out
    setTimeout(() => {
      setSimState("answering");
      
      const fullAnswer = sampleAnswers[question];
      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += 8;
        if (currentLength >= fullAnswer.length) {
          setSimAnswer(fullAnswer);
          setSimState("done");
          clearInterval(interval);
        } else {
          setSimAnswer(fullAnswer.substring(0, currentLength));
        }
      }, 50);
    }, 1200);
  }

  function handleMockSubscribe(planName: string) {
    setSelectedPlan(planName);
    setShowCheckout(true);
  }

  function confirmCheckout() {
    setShowCheckout(false);
    setIsSubscribed(true);
    setAccountKey("ctl_live_key_" + Math.random().toString(36).substring(2, 12).toUpperCase());
  }

  return (
    <main className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">
      
      {/* Background Radial Glows in official accent colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0D6EFD]/10 bg-blur-glow"></div>
 
      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <img src="/logo-horizontal-dark.svg" className="h-9 w-auto select-none" alt="CrackTheLoop Logo" />
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
          <a href="#simulator" className="text-sm text-slate-400 hover:text-white transition">Interactive Demo</a>
          <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing</a>
          <a 
            href="#dashboard" 
            className="text-xs px-5 py-2.5 bg-gradient-to-r from-[#6610F2] via-[#0D6EFD] to-[#0DCAF0] rounded-full font-bold hover:brightness-110 transition active:scale-95 shadow-md shadow-[#0D6EFD]/25"
          >
            Portal Dashboard
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 text-center flex flex-col items-center gap-6 relative z-20">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-sky-300">
          <svg className="w-4 h-4 text-emerald-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 11.37c1.371-.764 2.505-1.742 3.4-2.936a2.001 2.001 0 011.834-.934 3.003 3.003 0 002.83 2.829 2 2 0 01-.933 1.835 11.954 11.954 0 01-2.936 3.4c-.6.417-1.306.772-2.11 1.066A1.982 1.982 0 013 15v-1.63a1.982 1.982 0 01.166-.803c.294-.804.65-1.51 1-2.11z" />
          </svg>
          Live Audio Evasion & Screen Sharing Protection Active
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
          Stealth AI Copilot for <span className="text-gradient">Tech Interviews</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          Capture system audio and microphone inputs in real-time, stream answers through a high-speed LLM, and render guidance on a transparent, Zoom-invisible desktop overlay.
        </p>

        <div className="flex gap-4 mt-4">
          <a
            href="#simulator"
            className="px-8 py-3.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl font-bold shadow-lg shadow-sky-500/10 hover:brightness-110 transition active:scale-98"
          >
            Try Free Simulator
          </a>
          <a
            href="#pricing"
            className="px-8 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl font-bold hover:bg-slate-800 transition active:scale-98"
          >
            Get Live Key
          </a>
        </div>
      </section>

      {/* Simulator Widget */}
      <section id="simulator" className="w-full max-w-4xl mx-auto px-6 pt-24 relative z-20">
        <div className="glow-card rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Live Simulator Dashboard</h2>
              <p className="text-xs text-slate-400">Click a question below to test the streaming overlay pipeline</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-full text-xs">
              <span className={`w-2 h-2 rounded-full ${simState === "listening" || simState === "answering" ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`}></span>
              <span className="capitalize text-slate-300 font-medium">Pipeline: {simState}</span>
            </div>
          </div>

          {/* Quick Select Questions */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Choose a sample question:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => startSimulation(q)}
                  disabled={simState === "listening" || simState === "answering"}
                  className="p-3 bg-[#0d1326] border border-white/5 rounded-xl text-left text-xs hover:border-sky-400/50 hover:bg-[#111933] transition cursor-pointer disabled:opacity-50 text-slate-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Output Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            
            {/* Left: Input Speech-to-Text */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">WASAPI Audio Loopback (STT)</span>
              <div className="bg-[#0b0e1b] border border-white/5 rounded-xl p-4 min-h-[140px] text-sm leading-relaxed text-slate-300">
                {simState === "idle" && <span className="text-slate-600 italic">Select a question to trigger transcription...</span>}
                {simState === "listening" && (
                  <span className="text-sky-300 font-semibold animate-pulse">Capturing Loopback: {simQuestion}</span>
                )}
                {(simState === "answering" || simState === "done") && (
                  <span className="text-emerald-400 font-medium">{simQuestion}</span>
                )}
              </div>
            </div>

            {/* Right: Transparent Overlay Mock */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Unclickable Overlay Hud</span>
              <div className="bg-[#0b0e1b] border border-emerald-500/10 rounded-xl p-4 min-h-[140px] text-sm leading-relaxed relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500/10 text-[9px] text-emerald-400 font-bold uppercase rounded-bl-lg">
                  Zoom-Invisible Overlay
                </div>
                {simState === "idle" && <span className="text-slate-600 italic">Awaiting audio capture stream...</span>}
                {simState === "listening" && <span className="text-slate-500 italic animate-pulse">Thinking (LLM routing)...</span>}
                {(simState === "answering" || simState === "done") && (
                  <div className="text-emerald-100 font-medium whitespace-pre-line text-xs">
                    {simAnswer}
                    {simState === "answering" && <span className="w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5 animate-pulse"></span>}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-6xl mx-auto px-6 pt-28 relative z-20">
        <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12">Engineered for <span className="text-gradient">Stealth and Speed</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex justify-center items-center text-sky-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Sub-Second Latency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our native Rust audio engine downsamples and pipes data over highly optimized channels, rendering answers in under 1.0s.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex justify-center items-center text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Screen Share Evasion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bypasses Zoom, Teams, Meet, and Slack screensharing. Using OS-level `WDA_EXCLUDEFROMCAPTURE` window flags, the HUD is invisible to viewers.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex justify-center items-center text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Dual-Channel WASAPI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No mic bleed. Uses system loopback to directly record standard output audio alongside your local microphone stream for high-accuracy STT.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing / Stripe Checkout Section */}
      <section id="pricing" className="w-full max-w-5xl mx-auto px-6 pt-28 relative z-20">
        <h2 className="text-3xl font-extrabold tracking-tight text-center mb-4">Select Your Plan</h2>
        <p className="text-slate-400 text-sm text-center mb-12 max-w-md mx-auto">Activate a subscription to instantly generate your secure API key for the desktop app.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Pro Plan */}
          <div className="glow-card rounded-3xl p-8 flex flex-col gap-6 border-white/10 bg-[#0c1125] relative">
            <div className="absolute top-4 right-4 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
              Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pro Pass</h3>
              <p className="text-xs text-slate-400 mt-1">Perfect for active interview stages</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$29</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-b border-white/5 py-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                Ultra-low latency streaming STT
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                Screen sharing evasion (Zoom & Meet)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                Standard LLaMA-3.1 model support
              </li>
            </ul>
            <button
              onClick={() => handleMockSubscribe("Pro Pass")}
              disabled={isSubscribed}
              className="w-full py-3 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl font-semibold text-sm transition hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubscribed ? "Active Subscriber" : "Upgrade to Pro"}
            </button>
          </div>

          {/* Elite Plan */}
          <div className="glow-card rounded-3xl p-8 flex flex-col gap-6 border-white/10 bg-[#0d1326]">
            <div>
              <h3 className="text-xl font-bold text-white">Elite Pass</h3>
              <p className="text-xs text-slate-400 mt-1">Unlimited calls & advanced model features</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$59</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-b border-white/5 py-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                All Pro features included
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Highest accuracy GPT-4o-mini custom prompts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Custom offline screen capture & OCR triggers
              </li>
            </ul>
            <button
              onClick={() => handleMockSubscribe("Elite Pass")}
              disabled={isSubscribed}
              className="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-sm transition hover:bg-slate-700 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubscribed ? "Active Subscriber" : "Upgrade to Elite"}
            </button>
          </div>

        </div>
      </section>

      {/* Mock Stripe Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-6">
          <div className="w-[420px] bg-[#0c1125] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
                Stripe Checkout
              </h3>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Selected Plan:</span>
                <span className="text-white font-semibold">{selectedPlan}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 border-b border-white/5 pb-3">
                <span>Billing Interval:</span>
                <span className="text-white">Monthly</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1">
                <span>Total Due:</span>
                <span>{selectedPlan === "Pro Pass" ? "$29.00" : "$59.00"}</span>
              </div>
            </div>

            <div className="bg-[#060913] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Card Number: 4242 4242 4242 4242"
                disabled
                className="w-full bg-[#0d1326] border border-white/10 px-3 py-2 rounded-lg text-xs font-mono text-slate-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  className="bg-[#0d1326] border border-white/10 px-3 py-2 rounded-lg text-xs font-mono text-slate-400"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  disabled
                  className="bg-[#0d1326] border border-white/10 px-3 py-2 rounded-lg text-xs font-mono text-slate-400"
                />
              </div>
            </div>

            <button
              onClick={confirmCheckout}
              className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold text-sm text-white shadow-lg shadow-indigo-500/20 transition active:scale-98 cursor-pointer"
            >
              Pay & Activate Key
            </button>
          </div>
        </div>
      )}

      {/* SaaS Dashboard & Release Keys */}
      <section id="dashboard" className="w-full max-w-4xl mx-auto px-6 pt-28 relative z-20">
        <div className="glow-card rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gradient-emerald">Active Portal Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/5 pt-6">
            
            {/* Download Link */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">CrackTheLoop Client App</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download the lightweight, native Tauri v2 desktop application. Works on Windows 10 & 11. Screen share evasion activates automatically.
              </p>
              <a
                href="#download"
                className="w-fit px-5 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-750 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download for Windows (x64)
              </a>
            </div>

            {/* License Key Generator */}
            <div className="flex flex-col gap-3 bg-[#0a0e1c] border border-white/5 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-white">SaaS License Management</h3>
              {isSubscribed ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Your Live Portal Key</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={accountKey}
                      className="bg-[#050811] border border-white/10 px-3 py-2 rounded-xl text-xs font-mono text-emerald-300 w-full"
                    />
                    <button 
                      onClick={() => navigator.clipboard.writeText(accountKey)}
                      className="text-xs bg-white/5 hover:bg-white/10 px-3 rounded-xl border border-white/5 transition cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">Input this key into the desktop client to unlock low-latency streams.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-400 italic">No active license found.</span>
                  <a
                    href="#pricing"
                    className="w-fit text-xs text-sky-400 hover:text-sky-300 underline font-medium"
                  >
                    Subscribe to Pro or Elite to unlock licensing
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
