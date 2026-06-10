"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Sparkles,
  Volume2,
  Terminal,
  RefreshCw,
  Zap,
  Cpu,
  Globe,
  MonitorSpeaker,
  BrainCircuit,
  EyeOff,
  Wifi,
  ArrowRight,
  Check,
  Mic,
  Activity,
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import CtaFooter from "../components/landing/CtaFooter";
import { Parallax, ScrollReveal } from "../components/landing/ScrollReveal";
import { WindowsIcon, AppleIcon } from "../components/icons/BrandIcons";

/* ─────────────────────────────────────────────
   PIPELINE DIAGRAM
   ───────────────────────────────────────────── */
const PIPELINE_NODES = [
  {
    id: "wasapi",
    label: "WASAPI Loopback",
    sublabel: "48kHz stereo PCM",
    icon: MonitorSpeaker,
    color: "#0284c7", // Sky 600
    glow: "rgba(2,132,199,0.2)",
    detail:
      "The Windows WASAPI driver captures all speaker output and mic input simultaneously at 48kHz stereo - no virtual audio cables or admin rights required.",
  },
  {
    id: "merger",
    label: "ChannelMerger",
    sublabel: "Stereo → Mono blend",
    icon: Activity,
    color: "#4f46e5", // Indigo 600
    glow: "rgba(79,70,229,0.2)",
    detail:
      "A Web Audio API ChannelMergerNode combines the left (speaker) and right (mic) channels into a single mono stream, preserving relative amplitude balance for accurate STT.",
  },
  {
    id: "downsampler",
    label: "ScriptProcessor",
    sublabel: "Downsample → 16kHz PCM",
    icon: Cpu,
    color: "#7c3aed", // Violet 600
    glow: "rgba(124,58,237,0.2)",
    detail:
      "A ScriptProcessorNode decimates the 48kHz stream to 16kHz mono PCM with a 300ms VAD silence debounce - the exact format Deepgram nova-3 expects over WebSocket.",
  },
  {
    id: "deepgram",
    label: "Deepgram nova-3",
    sublabel: "Real-time WebSocket STT",
    icon: BrainCircuit,
    color: "#059669", // Emerald 600
    glow: "rgba(5,150,105,0.2)",
    detail:
      "PCM chunks stream to Deepgram nova-3 over a persistent WebSocket connection. Finalized transcript objects with punctuation and speaker diarization are returned in ~80ms RTT.",
  },
  {
    id: "proxy",
    label: "Next.js Proxy",
    sublabel: "/api/completion SSE",
    icon: Wifi,
    color: "#ea580c", // Orange 600
    glow: "rgba(234,88,12,0.2)",
    detail:
      "The transcript routes to a Next.js edge API route that forwards to Groq / Claude / GPT-4o, streaming Server-Sent Events back to the client without exposing your API key.",
  },
  {
    id: "hud",
    label: "Win32 HUD Overlay",
    sublabel: "WDA_EXCLUDEFROMCAPTURE",
    icon: EyeOff,
    color: "#db2777", // Pink 600
    glow: "rgba(219,39,119,0.2)",
    detail:
      "The Tauri overlay window uses SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE) making it completely absent from Zoom, Meet, Teams, and OBS screen recordings. Only you see it.",
  },
];

function PipelineDiagram() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [animStep, setAnimStep] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = [
    {
      title: "Audio Capture",
      desc: "Tap speaker loopback and local mic directly via WASAPI / Browser APIs.",
      icon: Mic,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      title: "Channel Mixer",
      desc: "Combine stereo speaker audio and mic streams into a single unified track.",
      icon: Volume2,
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      title: "Resampler Engine",
      desc: "Downsample input sampling rate from 48kHz to 16kHz mono PCM stream.",
      icon: Cpu,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      title: "PCM Cast",
      desc: "Cast 32-bit floating samples into 16-bit signed integer buffers (83% bandwidth save).",
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      title: "WebSocket Stream",
      desc: "Stream chunks directly to Deepgram WebSocket endpoint for real-time transcription.",
      icon: Terminal,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
    },
  ];

  function startAnimation() {
    if (running) return;
    setRunning(true);
    setAnimStep(0);
    setActiveNode(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= PIPELINE_NODES.length) {
        setActiveNode(null);
        setRunning(false);
        clearInterval(intervalRef.current!);
      } else {
        setAnimStep(step);
        setActiveNode(step);
      }
    }, 800);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const node = activeNode !== null ? PIPELINE_NODES[activeNode] : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Node Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
        {PIPELINE_NODES.map((n, i) => {
          const Icon = n.icon;
          const isActive = activeNode === i;
          const isPast = activeNode !== null && i < activeNode;

          return (
            <div key={n.id} className="flex flex-col md:flex-row items-center gap-0 flex-1 w-full md:w-auto">
              {/* Node Button */}
              <button
                onClick={() => setActiveNode(activeNode === i ? null : i)}
                className="flex flex-col items-center gap-2.5 group cursor-pointer relative w-full md:w-auto"
                style={{ minWidth: 90 }}
              >
                <div
                  className="w-[72px] h-[72px] rounded-xl flex items-center justify-center relative transition-all duration-300 bg-white border border-(--border-light) shadow-xs group-hover:scale-105 group-hover:shadow-md group-hover:border-slate-350"
                  style={{
                    background: isActive
                      ? `radial-gradient(circle at 50% 50%, ${n.glow}, transparent 70%)`
                      : isPast
                        ? `${n.color}12`
                        : "#ffffff",
                    borderColor: isActive ? n.color : isPast ? n.color + "70" : "var(--border-light)",
                    boxShadow: isActive ? `0 0 20px 2px ${n.glow}, 0 4px 12px rgba(15,23,42,0.03)` : undefined,
                    transform: isActive ? "scale(1.06)" : undefined,
                  }}
                >
                  <Icon
                    className="w-6 h-6 transition-all duration-300 group-hover:scale-110"
                    style={{ color: isActive || isPast ? n.color : "#94a3b8" }}
                  />
                  {isActive && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                      style={{ background: n.color }}
                    />
                  )}
                  {isPast && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                      style={{ background: n.color }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-0.5 select-none">
                  <span
                    className="text-[10px] font-bold text-center leading-tight transition-colors duration-300 group-hover:text-slate-900"
                    style={{ color: isActive ? n.color : isPast ? n.color + "d5" : "#475569", maxWidth: 82 }}
                  >
                    {n.label}
                  </span>
                  <span className="text-[8.5px] text-slate-400 font-medium text-center leading-tight" style={{ maxWidth: 82 }}>
                    {n.sublabel}
                  </span>
                </div>
              </button>

              {/* Connector Arrow */}
              {i < PIPELINE_NODES.length - 1 && (
                <div className="hidden md:flex items-center flex-1 mx-1.5">
                  <div
                    className="h-px flex-1 transition-all duration-500 relative overflow-hidden bg-slate-200"
                    style={{
                      background:
                        (activeNode !== null && i < activeNode)
                          ? `linear-gradient(90deg, ${PIPELINE_NODES[i].color}80, ${PIPELINE_NODES[i + 1].color}80)`
                          : "#e2e8f0",
                    }}
                  >
                    {activeNode === i && (
                      <span
                        className="absolute top-0 left-0 h-px w-8 animate-[slide_0.6s_linear_infinite]"
                        style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }}
                      />
                    )}
                  </div>
                  <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0 ml-0.5">
                    <path
                      d="M0 4 L8 4 M5 1 L8 4 L5 7"
                      stroke={activeNode !== null && i < activeNode ? PIPELINE_NODES[i + 1].color + "90" : "#cbd5e1"}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div
        className="rounded-xl border p-5 min-h-[88px] transition-all duration-500 flex items-start gap-4 shadow-xs"
        style={{
          borderColor: node ? node.color + "40" : "rgba(15,23,42,0.08)",
          background: node
            ? `linear-gradient(135deg, ${node.glow.replace("0.2", "0.06")}, rgba(255, 255, 255, 0.92))`
            : "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {node ? (
          <>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-white shadow-2xs border border-slate-200/50"
              style={{ border: `1px solid ${node.color}25` }}
            >
              <node.icon className="w-5 h-5 animate-pulse" style={{ color: node.color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-0.5">{node.label}</p>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{node.detail}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">i</span>
            <p className="text-slate-400 text-xs italic">Click any pipeline node to inspect its role, or press &ldquo;Run Pipeline Animation&rdquo; to watch the flow.</p>
          </div>
        )}
      </div>

      {/* Run Button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={startAnimation}
          disabled={running}
          id="run-pipeline-btn"
          className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${running
              ? "bg-slate-500 text-white cursor-not-allowed"
              : "btn-primary-glow text-white"
            }`}
          style={running ? { background: "#64748b" } : undefined}
        >
          {running ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Streaming pipeline...</>
          ) : (
            <><Zap className="w-4 h-4" /> Run Pipeline Animation</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LATENCY BREAKDOWN BAR
   ───────────────────────────────────────────── */
const LATENCY_SEGMENTS = [
  { label: "WASAPI buffer", ms: 150, color: "#0284c7" },
  { label: "Downsample + VAD", ms: 200, color: "#7c3aed" },
  { label: "Deepgram RTT", ms: 80, color: "#059669" },
  { label: "LLM TTFT (Groq)", ms: 300, color: "#ea580c" },
  { label: "HUD render", ms: 20, color: "#db2777" },
];
const TOTAL_MS = LATENCY_SEGMENTS.reduce((s, x) => s + x.ms, 0);

function LatencyBar() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-5 rounded-lg overflow-hidden w-full border border-slate-200 relative shadow-2xs">
        {/* Gloss overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/5 pointer-events-none" />
        {LATENCY_SEGMENTS.map((seg, i) => (
          <div
            key={i}
            className="h-full flex items-center justify-center text-[8px] font-bold text-white transition-all"
            style={{
              width: `${(seg.ms / TOTAL_MS) * 100}%`,
              background: `linear-gradient(180deg, ${seg.color}dd, ${seg.color})`
            }}
            title={`${seg.label}: ${seg.ms}ms`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 select-none">
        {LATENCY_SEGMENTS.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ background: seg.color }} />
            <span className="text-slate-500 font-semibold">{seg.label}</span>
            <span className="font-bold" style={{ color: seg.color }}>{seg.ms}ms</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[10px] sm:ml-auto">
          <span className="text-slate-400 font-bold">Total:</span>
          <span className="font-black text-slate-800 text-xs">{TOTAL_MS}ms</span>
          <span className="text-emerald-600 font-bold ml-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ✓ sub-second response
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIMULATOR CORE DATA
   ───────────────────────────────────────────── */
const sampleQuestions = [
  "How does virtual DOM reconciliation work in React?",
  "Explain the difference between TCP and UDP.",
  "What are index types and performance implications in PostgreSQL?",
];

const sampleAnswers: Record<string, string> = {
  "How does virtual DOM reconciliation work in React?":
    "• React creates a lightweight in-memory representation of the DOM.\n• On state change, it computes a diff between the new virtual representation and the previous snapshot.\n• Uses a heuristic O(n) algorithm to bundle changes and batch updates the real DOM efficiently.",
  "Explain the difference between TCP and UDP.":
    "• TCP is a connection-oriented protocol ensuring reliability via 3-way handshakes and retransmissions.\n• UDP is connectionless, prioritizing speed by sending packets directly without delivery verification.\n• Use TCP for databases/web traffic, and UDP for real-time video streaming/gaming.",
  "What are index types and performance implications in PostgreSQL?":
    "• B-Tree: Default index type, ideal for comparison operators (<, <=, =, >=, >) and sorting.\n• Hash Indexes: Excellent for quick exact equality comparisons but do not support range scans.\n• Indexes speed up reads significantly but introduce write overhead as index files must be updated.",
};

/* ─────────────────────────────────────────────
   PAGE COMPONENT
   ───────────────────────────────────────────── */
export default function DemoPage() {
  const [simState, setSimState] = useState<"idle" | "listening" | "answering" | "done">("idle");
  const [simQuestion, setSimQuestion] = useState("");
  const [simAnswer, setSimAnswer] = useState("");
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);

  function addLog(message: string) {
    setSimLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [simLogs]);

  function startSimulation(question: string) {
    setSimState("listening");
    setSimQuestion(question);
    setSimAnswer("");
    setSimLogs([]);

    addLog("Initializing Audio Pipeline...");
    addLog("WASAPI loopback hook established.");
    addLog("ChannelMergerNode: stereo → mono blend active.");
    addLog("ScriptProcessor: downsampling 48kHz → 16kHz PCM.");
    addLog("Opening WebSocket: wss://api.deepgram.com/v1/listen?model=nova-3");

    setTimeout(() => {
      setSimState("answering");
      addLog("WebSocket state: OPEN");
      addLog("Deepgram VAD active - endpointing threshold: 300ms");
      addLog(`Utterance finalized: "${question}"`);
      addLog("Forwarding transcript → POST /api/completion");
      addLog("LLM: Groq/llama-3.1-8b-instant | streaming SSE...");

      const fullAnswer = sampleAnswers[question];
      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += 8;
        if (currentLength >= fullAnswer.length) {
          setSimAnswer(fullAnswer);
          setSimState("done");
          addLog("SSE stream closed. Status: [DONE]");
          addLog("Total pipeline latency: 0.75s ✓ sub-second criteria MET");
          clearInterval(interval);
        } else {
          setSimAnswer(fullAnswer.substring(0, currentLength));
          if (currentLength % 24 === 0) {
            addLog("SSE token chunk: " + JSON.stringify(fullAnswer.substring(currentLength - 24, currentLength)));
          }
        }
      }, 50);
    }, 1500);
  }

  return (
    <div className="hero-gradient-mesh relative min-h-screen flex flex-col pt-28 pb-8 overflow-hidden text-(--text-primary)">

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Orbs with parallax */}
      <Parallax speed={0.2} className="absolute -top-20 -right-40">
        <div className="orb orb-peach w-[600px] h-[600px] animate-float-orb opacity-40 pointer-events-none" />
      </Parallax>
      <Parallax speed={0.4} className="absolute top-1/3 -left-40">
        <div className="orb orb-slate w-[400px] h-[400px] animate-float-orb-slow opacity-40 pointer-events-none" />
      </Parallax>
      <Parallax speed={0.15} className="absolute -bottom-20 right-1/4">
        <div className="orb orb-frost w-[350px] h-[350px] animate-float-orb opacity-40 pointer-events-none" style={{ animationDelay: "5s" }} />
      </Parallax>

      {/* Global Navigation Header */}
      <Navbar />

      {/* Hero Header */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-10 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="inline-flex items-center gap-1.5 bg-(--accent-soft) border border-(--accent)/20 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-(--accent)">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Interactive Live Pipeline Demo
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900" id="demo-main-heading" style={{ fontFamily: "var(--font-display)" }}>
            Watch the <span className="text-gradient-coral">Real-Time Overlay</span> Pipeline
          </h1>
          <p className="text-(--text-muted) text-base md:text-lg max-w-2xl leading-relaxed font-medium">
            Explore the full WASAPI → Deepgram → LLM → HUD pipeline architecture, then run an interactive simulation below.
          </p>
        </motion.div>
      </section>

      {/* ── Pipeline Diagram Card ── */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-12 relative z-20">
        <ScrollReveal>
          <div className="bg-white/80 border border-(--border-light) backdrop-blur-md rounded-xl p-5 md:p-7 flex flex-col gap-6 shadow-md" id="pipeline-diagram-card">

            <div className="flex justify-between items-center border-b border-slate-100 pb-3 select-none">
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Desktop Client Architecture</h2>
                <p className="text-xs text-slate-500 mt-0.5">Click a node to inspect • Press &ldquo;Run Pipeline Animation&rdquo; to watch the data flow</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                <Shield className="w-3 h-3 text-emerald-600" /> Win32 Stealth Active
              </div>
            </div>

            <PipelineDiagram />

            {/* Latency Breakdown */}
            <div className="border-t border-slate-100 pt-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 select-none mb-0.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">End-to-End Latency Breakdown</span>
              </div>
              <LatencyBar />
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ── Live Simulator Sandbox ── */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-10 relative z-20">
        <ScrollReveal>
          <div className="bg-white/80 border border-(--border-light) backdrop-blur-md rounded-xl p-5 md:p-7 flex flex-col gap-6 shadow-md" id="demo-simulator-container">

            <div className="flex justify-between items-center border-b border-slate-100 pb-3 select-none">
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Live Simulator Dashboard</h2>
                <p className="text-xs text-slate-500 mt-0.5">Click a question below to run the streaming pipeline simulation</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs">
                <span className={`w-2 h-2 rounded-full ${simState === "listening" || simState === "answering" ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`} />
                <span className="capitalize text-slate-700 font-bold uppercase tracking-wider text-[10px] font-mono">Status: {simState}</span>
              </div>
            </div>

            {/* Questions Selection grid */}
            <div className="flex flex-col gap-2.5 select-none">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold font-mono">Choose a sample question:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => startSimulation(q)}
                    disabled={simState === "listening" || simState === "answering"}
                    className="p-3.5 bg-white/60 hover:bg-white border border-slate-200/60 hover:border-(--accent)/35 hover:shadow-xs rounded-xl text-left text-xs transition cursor-pointer disabled:opacity-50 text-slate-700 font-semibold flex items-start gap-2 group"
                  >
                    <span className="text-(--accent) font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Output block displays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              {/* Left Box: Speech-to-Text Input */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5 select-none">
                  <Volume2 className="w-4 h-4 text-sky-600" /> WASAPI Loopback (STT Input)
                </span>
                <div className="bg-slate-50/50 border border-slate-200/85 rounded-xl p-4 min-h-[160px] text-sm leading-relaxed text-slate-700 select-text backdrop-blur-xs">
                  {simState === "idle" && <span className="text-slate-400 italic select-none">Select a question to trigger transcription...</span>}
                  {simState === "listening" && (
                    <span className="text-sky-600 font-bold animate-pulse select-none flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-sky-500" /> Capturing: {simQuestion}
                    </span>
                  )}
                  {(simState === "answering" || simState === "done") && (
                    <span className="text-emerald-700 font-semibold">{simQuestion}</span>
                  )}
                </div>
              </div>

              {/* Right Box: Floating Overlay HUD */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5 select-none">
                  <Terminal className="w-4 h-4 text-emerald-600" /> Zoom-Invisible HUD Overlay
                </span>
                <div className="bg-slate-950/95 border border-slate-800/80 rounded-xl p-4 min-h-[160px] text-xs leading-relaxed relative overflow-hidden shadow-inner select-text">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500/10 text-[9px] text-emerald-400 font-bold uppercase rounded-bl-lg select-none">
                    Overlay HUD View
                  </div>
                  {simState === "idle" && <span className="text-slate-650 italic select-none">Awaiting audio capture stream...</span>}
                  {simState === "listening" && <span className="text-slate-500 italic animate-pulse select-none">Routing to LLM...</span>}
                  {(simState === "answering" || simState === "done") && (
                    <div className="text-emerald-100 whitespace-pre-line font-mono font-bold leading-relaxed text-[11px] p-1">
                      {simAnswer}
                      {simState === "answering" && <span className="w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5 animate-pulse shadow-[0_0_8px_#34d399]" />}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time Logger Terminal */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5 select-none">
                <Cpu className="w-4 h-4 text-indigo-500" /> Real-Time Pipeline Logs
              </span>
              <div
                ref={logsRef}
                className="bg-slate-950/95 border border-slate-900/90 rounded-xl p-4 h-[180px] overflow-y-auto font-mono text-[11px] text-slate-400 flex flex-col gap-1.5 leading-relaxed select-text shadow-inner"
              >
                {simLogs.length === 0 ? (
                  <span className="text-slate-650 italic select-none">Awaiting simulator activation to print logs...</span>
                ) : (
                  simLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-sky-400 font-bold">ctl-pipeline:</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ── Product Integration Download Callout ── */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-8 select-none z-20">
        <ScrollReveal>
          <div className="bg-white/80 border border-(--border-light) backdrop-blur-md rounded-xl p-8 md:p-12 flex flex-col items-center gap-6 shadow-lg relative overflow-hidden text-center">
            {/* Ambient glows inside callout card */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-(--accent)/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Unlock Full Production Capabilities</h4>
            <p className="text-(--text-muted) text-sm max-w-md leading-relaxed font-medium">
              Deploy the live copilot straight inside your browser or grab our native Windows desktop client installer.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10 mt-2">
              <Link
                href="/copilot"
                className="px-6 py-3.5 bg-linear-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 flex items-center gap-1.5 shadow-md shadow-indigo-500/10 text-center cursor-pointer"
              >
                Launch Browser Copilot <Globe className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/Souravrooj-klizos/cracktheloop-desktop/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <WindowsIcon className="w-4 h-4 text-slate-500 shrink-0" />
                Download for Windows
              </a>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-mac-waitlist"));
                }}
                className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <AppleIcon className="w-4 h-4 text-slate-500 shrink-0" />
                Download for macOS
              </button>
              <Link
                href="/pricing"
                className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 cursor-pointer text-center shadow-2xs"
              >
                Get License Key
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
      {/* Global CTA Footer */}
      <CtaFooter />

    </div>
  );
}
