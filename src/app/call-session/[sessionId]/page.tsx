"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Laptop, 
  Globe, 
  Mic, 
  HelpCircle, 
  Check, 
  AlertTriangle, 
  Monitor, 
  Play, 
  Square,
  Timer, 
  MessageSquare, 
  Sparkles, 
  Camera, 
  Send, 
  LogOut, 
  Loader2, 
  Volume2,
  FileText,
  User,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  X
} from "lucide-react";
import Link from "next/link";
import { 
  getMockSessionById, 
  getMockResumeById, 
  saveMockSession,
  MockCallSession 
} from "@/lib/mockService";

export default function LiveSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<MockCallSession | null>(null);
  const [resumeName, setResumeName] = useState("None");
  const [loading, setLoading] = useState(true);

  // Connection flow states
  const [connectStep, setConnectStep] = useState<"platform" | "browser-check" | "connected">("platform");
  const [micDevice, setMicDevice] = useState("Default System Microphone");
  
  // Microphone volume animation state
  const [micTesting, setMicTesting] = useState(false);
  const [micVolume, setMicVolume] = useState<number[]>([12, 8, 16, 5, 22, 10, 6, 18, 11]);

  // Live Workspace States
  const [timerText, setTimerText] = useState("10:00");
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [manualQuery, setManualQuery] = useState("");

  // Live streaming transcript & response simulation arrays
  interface TranscriptLine {
    sender: "Interviewer" | "You";
    time: string;
    text: string;
  }
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  
  const [aiResponseText, setAiResponseText] = useState("");
  const [isAiStreaming, setIsAiStreaming] = useState(false);
  const [aiTargetResponse, setAiTargetResponse] = useState("");
  const [aiState, setAiState] = useState<"idle" | "thinking" | "streaming">("idle");

  const streamIndexRef = useRef(0);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptTriggerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sess = getMockSessionById(sessionId);
    if (sess) {
      setSession(sess);
      if (sess.resumeId) {
        const r = getMockResumeById(sess.resumeId);
        if (r) setResumeName(r.title);
      }
    } else {
      router.push("/dashboard/call-sessions");
    }
    setLoading(false);

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (transcriptTriggerRef.current) clearTimeout(transcriptTriggerRef.current);
    };
  }, [sessionId, router]);

  // Trigger stream typing effect
  const startAiStreamingText = (fullText: string) => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setAiState("streaming");
    setAiResponseText("");
    streamIndexRef.current = 0;
    
    // Split by words to feel natural
    const words = fullText.split(" ");
    streamTimerRef.current = setInterval(() => {
      if (streamIndexRef.current < words.length) {
        setAiResponseText(prev => prev + (prev ? " " : "") + words[streamIndexRef.current]);
        streamIndexRef.current++;
      } else {
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
        setAiState("idle");
      }
    }, 110); // Natural word pace
  };

  // Trigger automatic script simulator for live session
  const startLiveSimulation = () => {
    setIsSessionActive(true);
    
    // 1. Initial greeting transcript line
    setTranscripts([
      {
        sender: "Interviewer",
        time: "0:05",
        text: "Hi, thanks for joining today. Let's start with a technical question. Can you tell me about a time you optimized a slow query or backend service? What was the bottleneck and how did you measure results?"
      }
    ]);

    // 2. Initial AI thinking state then stream response
    setAiState("thinking");
    setTimeout(() => {
      const response = "**Situation**: During my work at Acme Logistics, our sharded notification microservices were experiencing high database write latency, leading to delivery backlogs during peak flash sales.\n\n" +
        "**Task**: I had to resolve this write latency and scale system throughput to handle up to 50k req/sec with SLA p95 response time under 150ms.\n\n" +
        "**Action**:\n" +
        "1. Implemented a Redis cache-aside sharding layer to skip redundant configuration checks.\n" +
        "2. Monitored hot query indices and optimized SQL execution structures.\n" +
        "3. Decoupled synchronous database writes using an asynchronous sharded queue system.\n\n" +
        "**Result**: Reduced average read/write latency from 45ms to 12ms (a 73% latency decrease) and successfully handled flash sale peaks with zero locks.";
      
      startAiStreamingText(response);
    }, 2000);

    // 3. Second question triggers at 25 seconds
    transcriptTriggerRef.current = setTimeout(() => {
      setTranscripts(prev => [
        ...prev,
        {
          sender: "Interviewer",
          time: "0:45",
          text: "Excellent answer. Moving on, how do you handle technical disagreements on system design choices within a team?"
        }
      ]);
      setAiState("thinking");
      setTimeout(() => {
        const response = "**Situation**: During a critical refactoring, a senior peer pushed for a strict GraphQL design, whereas I favored a simple REST design because of client caching and rapid shipping needs.\n\n" +
          "**Task**: Reach a consensus without delaying our launch timeline or fracturing team dynamics.\n\n" +
          "**Action**:\n" +
          "1. Prototyped both designs within a 4-hour window to demonstrate actual complexity.\n" +
          "2. Highlighted that GraphQL required client updates we couldn't support in time.\n" +
          "3. Compromised by building standard REST endpoints now and planning GraphQL as a phase 2.\n\n" +
          "**Result**: Shipped on time with zero issues, preserving team alignment and establishing a structured framework for architecture debates.";
        startAiStreamingText(response);
      }, 2500);
    }, 28000);
  };

  // Launch countdown timer
  useEffect(() => {
    if (isSessionActive) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            setIsSessionActive(false);
            alert("Free session limit reached (10:00). Please refill credits.");
            return 0;
          }
          const next = prev - 1;
          const mins = Math.floor(next / 60);
          const secs = next % 60;
          setTimerText(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isSessionActive]);

  // Audio permission test simulator
  const handleTestMic = async () => {
    setMicTesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const interval = setInterval(() => {
        setMicVolume(prev => prev.map(() => Math.floor(Math.random() * 30) + 4));
      }, 70);
      
      setTimeout(() => {
        clearInterval(interval);
        stream.getTracks().forEach(track => track.stop());
        setMicTesting(false);
      }, 3500);
    } catch (e) {
      // Fallback
      const interval = setInterval(() => {
        setMicVolume(prev => prev.map(() => Math.floor(Math.random() * 24) + 4));
      }, 75);
      setTimeout(() => {
        clearInterval(interval);
        setMicTesting(false);
      }, 3000);
    }
  };

  // Connect inside browser
  const handleConnectBrowser = () => {
    setConnectStep("connected");
    setTimeout(() => {
      startLiveSimulation();
    }, 500);
  };

  // Screenshot action trigger
  const handleTakeScreenshot = () => {
    setShowFlash(true);
    setFlashMessage("Capturing screenshare buffer...");
    setTimeout(() => {
      setFlashMessage("Analyzing visual content with GPT-4o Vision...");
      setTimeout(() => {
        setShowFlash(false);
        setAiState("thinking");
        setTimeout(() => {
          const response = "**Visual Content Analyzed**:\n" +
            "- Identified a system architecture diagram displaying a load balancer distributing traffic between 3 API instances and a Redis sharding cluster.\n\n" +
            "**Key Insights to Mention**:\n" +
            "1. Explain how sharding avoids hot keys in Redis.\n" +
            "2. Note the single point of failure at the main Load Balancer; suggest Multi-AZ clustering.\n" +
            "3. Mention your sharding implementation at Acme Logistics to reinforce expertise.";
          startAiStreamingText(response);
        }, 1800);
      }, 1500);
    }, 600);
  };

  // Manual query submission
  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    const query = manualQuery;
    setManualQuery("");

    setTranscripts(prev => [
      ...prev,
      {
        sender: "You",
        time: timerText,
        text: `Manual Override: "${query}"`
      }
    ]);

    setAiState("thinking");
    setTimeout(() => {
      const response = `**Override Context Query**: "${query}"\n\n` +
        "**Recommended response strategy**:\n" +
        "- Acknowledge the core question directly to demonstrate active listening.\n" +
        "- Address the concern about system trade-offs: every architecture choice has benefits and downfalls (e.g. consistency vs scalability).\n" +
        "- Refer to your experience with Redis and sharding at Acme Logistics to validate your claims.";
      startAiStreamingText(response);
    }, 1500);
  };

  // Terminate/End session
  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this mock session?")) {
      if (session) {
        const updated = { ...session, status: "completed" as const };
        saveMockSession(updated);
      }
      setIsSessionActive(false);
      router.push("/dashboard/call-sessions");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-mist) flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0F1A] text-slate-100 flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* Background stars mesh glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-(--accent)/8 blur-[150px] pointer-events-none select-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/8 blur-[150px] pointer-events-none select-none z-0"></div>

      {/* Screen Shutter Flash Overlay */}
      {showFlash && (
        <div className="fixed inset-0 bg-white/20 z-[120] flex items-center justify-center backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-6 py-4 flex items-center gap-3 shadow-2xl">
            <Loader2 className="w-5 h-5 text-(--accent) animate-spin" />
            <span className="text-xs font-bold text-slate-200">{flashMessage}</span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-(--accent)/10 border border-(--accent)/20 text-(--accent) rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-slate-200" style={{ fontFamily: "var(--font-display)" }}>
              Copilot Workspace
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
              Active Call: <span className="text-indigo-400 font-bold">{session?.title}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold">
            <Timer className="w-4 h-4 text-(--accent) animate-pulse" />
            <span className="font-mono text-slate-200 text-[13px]">{timerText}</span>
          </div>

          <button
            onClick={handleEndSession}
            className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 hover:border-rose-700 text-rose-200 hover:text-white px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            End Session
          </button>
        </div>
      </header>

      {/* Workspace Body */}
      {connectStep === "platform" && (
        /* Choose Platform Screen Modal */
        <div className="flex-1 flex justify-center items-center p-6 z-10">
          <div className="w-full max-w-lg bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-(--accent) font-black uppercase tracking-widest">Initialization</span>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">Choose Platform Target</h3>
              <p className="text-xs text-slate-400 leading-normal font-semibold">
                Select your preferred interface setup. We recommend using our desktop overlay for stealth Zoom calls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href={`/call-session/${sessionId}/desktop`}
                className="text-left p-5 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition duration-200 cursor-pointer flex flex-col justify-between gap-6 group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Local Desktop Client</h4>
                  <p className="text-[10px] text-slate-450 leading-normal font-semibold mt-1">
                    Launches a floating stealth HUD overlay that sits directly on top of Zoom, Meet, or Teams.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-indigo-400">
                  <span>Open Deep Link</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>

              <button
                onClick={() => setConnectStep("browser-check")}
                className="text-left p-5 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-(--accent)/50 rounded-xl transition duration-200 cursor-pointer flex flex-col justify-between gap-6 group"
              >
                <div className="w-10 h-10 rounded-lg bg-(--accent)/10 border border-(--accent)/20 text-(--accent) flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Browser Workspace</h4>
                  <p className="text-[10px] text-slate-450 leading-normal font-semibold mt-1">
                    Opens an interactive dual-pane console within this browser window using standard tab audio.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-(--accent) group-hover:translate-x-0.5 transition">
                  <span>Connect In Web</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {connectStep === "browser-check" && (
        /* Browser audio permissions checking screen */
        <div className="flex-1 flex justify-center items-center p-6 z-10">
          <div className="w-full max-w-md bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative flex flex-col gap-6">
            
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-(--accent) font-black uppercase tracking-widest">Telemetry verification</span>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">Audio Line Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-normal font-semibold">
                Test your microphone line to ensure high transcription accuracy and response recommendations.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Mic device selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Default Microphone Source</label>
                <select
                  value={micDevice}
                  onChange={(e) => setMicDevice(e.target.value)}
                  className="w-full text-xs font-bold text-slate-200 px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500/50 transition cursor-pointer"
                >
                  <option>Default System Microphone</option>
                  <option>External USB Microphone</option>
                  <option>Built-in Realtek Microphone</option>
                </select>
              </div>

              {/* Sound visual tester indicator */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Microphone Line Level</span>
                  <button
                    onClick={handleTestMic}
                    disabled={micTesting}
                    className={`text-[9px] font-extrabold uppercase px-3 py-1 rounded cursor-pointer transition ${
                      micTesting 
                        ? "bg-slate-800 text-slate-500" 
                        : "bg-indigo-600 hover:bg-indigo-750 text-white"
                    }`}
                  >
                    {micTesting ? "Testing..." : "Test Line"}
                  </button>
                </div>

                <div className="h-6 flex items-end gap-1 px-1 py-0.5 justify-center bg-slate-950 rounded border border-slate-800">
                  {micVolume.map((vol, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        micTesting ? "bg-(--accent) animate-bounce-audio" : "bg-slate-800"
                      }`}
                      style={{ 
                        height: micTesting ? `${vol * 3}%` : "30%",
                        animationDelay: micTesting ? `${idx * 0.08}s` : "0s"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-900/50 rounded-lg p-3 text-[10.5px] leading-relaxed text-amber-300 font-semibold flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                <span>IMPORTANT: When the browser prompts you for screen sharing, you **MUST** select the correct browser tab containing the call and check the **\"Share tab audio\"** option in the dialog box.</span>
              </div>

              <button
                onClick={handleConnectBrowser}
                className="w-full mt-2 py-3.5 bg-(--accent) hover:bg-(--accent-bright) text-white rounded-lg font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-(--accent)/10 cursor-pointer flex justify-center items-center gap-1.5"
              >
                <span>Launch Live Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      )}

      {connectStep === "connected" && (
        /* The Dual-Pane Live Session Workspace */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 z-10 overflow-hidden h-[calc(100vh-73px)]">
          
          {/* Left Panel: shared screen and transcripts feed */}
          <div className="flex flex-col gap-4 overflow-hidden h-full">
            
            {/* Screen share preview card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden aspect-video flex-shrink-0 relative group shadow-lg flex flex-col justify-center items-center text-center p-6 border-slate-700/80">
              {/* Mesh background */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle, rgba(232, 80, 58, 0.4) 0%, transparent 60%)`
              }} />
              
              <Monitor className="w-10 h-10 text-slate-500 mb-2 group-hover:scale-105 transition duration-300" />
              <h4 className="text-xs font-bold text-slate-300">Live Screenshare Stream Source</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed font-semibold max-w-xs mt-1">
                Simulating screen capture feed. The copilot listens to target tab audio in real-time.
              </p>
              
              <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Streaming feed active</span>
              </div>
            </div>

            {/* Live Transcript scroll area */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col gap-3 overflow-hidden shadow-xs">
              <div className="border-b border-slate-800 pb-2.5 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  Live Transcript Stream
                </span>
                
                <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Listening...
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 font-semibold text-xs leading-relaxed">
                {transcripts.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 italic py-8">
                    Waiting for interviewer dialogue speech...
                  </div>
                ) : (
                  transcripts.map((t, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg flex flex-col gap-1 border animate-fade-in ${
                        t.sender === "Interviewer" 
                          ? "bg-slate-900/30 border-slate-850/60" 
                          : "bg-indigo-950/10 border-indigo-900/20"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        <span className={t.sender === "Interviewer" ? "text-slate-400" : "text-indigo-400"}>
                          {t.sender}
                        </span>
                        <span className="text-slate-500 font-mono">{t.time}</span>
                      </div>
                      <p className="text-slate-300">{t.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Streaming AI response and workspace tools */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4 overflow-hidden h-full">
            
            {/* Header row in Right Panel */}
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-(--accent) animate-pulse" />
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">
                  AI Response cheat sheet
                </h3>
              </div>
              
              <div className="flex gap-2">
                {/* Take Manual Screenshot Trigger */}
                <button
                  onClick={handleTakeScreenshot}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1"
                  title="Take manual screenshot to analyze charts/diagrams"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  Screenshot
                </button>
              </div>
            </div>

            {/* AI Streaming Response display area */}
            <div className="flex-1 bg-slate-900/20 border border-slate-850 rounded-xl p-4.5 overflow-y-auto font-sans text-xs leading-relaxed text-slate-300 flex flex-col gap-3 relative select-text">
              {aiState === "thinking" ? (
                <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-xs flex items-center justify-center flex-col gap-2 select-none">
                  <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI formulating response...</span>
                </div>
              ) : null}

              {aiResponseText ? (
                <div className="whitespace-pre-wrap font-semibold leading-relaxed flex flex-col gap-3">
                  {/* Dynamic formatting simulation */}
                  {aiResponseText.split("\n\n").map((para, pIdx) => {
                    if (para.startsWith("**")) {
                      const endIdx = para.indexOf("**", 2);
                      const label = para.slice(2, endIdx);
                      const body = para.slice(endIdx + 2);
                      return (
                        <div key={pIdx} className="flex flex-col gap-1 border-b border-slate-850/30 pb-3 last:border-0">
                          <span className="text-[9.5px] font-black text-(--accent) uppercase tracking-wider">{label}</span>
                          <p className="text-slate-300 font-medium leading-relaxed">{body}</p>
                        </div>
                      );
                    }
                    return <p key={pIdx} className="text-slate-350 leading-relaxed font-medium">{para}</p>;
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-center px-6 leading-relaxed select-none">
                  Awaiting transcripts to stream response guides. Your active resume ({resumeName}) is pre-configured.
                </div>
              )}
            </div>

            {/* Manual Query Override input row */}
            <form onSubmit={handleSendQuery} className="border-t border-slate-850 pt-3 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="Type a custom question or manual override..."
                className="flex-1 text-xs font-semibold text-slate-200 px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500/50 transition placeholder-slate-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-755 text-white p-3 rounded-xl transition active:scale-95 cursor-pointer flex justify-center items-center shrink-0 shadow-sm shadow-indigo-600/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
