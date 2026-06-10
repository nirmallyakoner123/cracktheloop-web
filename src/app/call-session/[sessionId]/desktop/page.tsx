"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Laptop, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Loader2, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Globe,
  RefreshCw,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { WindowsIcon, AppleIcon } from "@/app/components/icons/BrandIcons";
import { getMockSessionById, MockCallSession } from "@/lib/mockService";

export default function DesktopLaunchPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<MockCallSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [launchAttempts, setLaunchAttempts] = useState(1);
  const [showFailedNotice, setShowFailedNotice] = useState(false);

  useEffect(() => {
    const data = getMockSessionById(sessionId);
    if (data) {
      setSession(data);
    } else {
      router.push("/dashboard/call-sessions");
    }
    setLoading(false);

    // Auto-trigger simulated deep link protocol on load
    const protocolUrl = `cracktheloop://session/${sessionId}`;
    if (typeof window !== "undefined") {
      window.location.href = protocolUrl;
    }

    // After 6s, show a notice if connection hasn't finished
    const timeout = setTimeout(() => {
      setShowFailedNotice(true);
    }, 6000);

    return () => clearTimeout(timeout);
  }, [sessionId, router]);

  const handleRetryLaunch = () => {
    setLaunchAttempts(prev => prev + 1);
    const protocolUrl = `cracktheloop://session/${sessionId}`;
    if (typeof window !== "undefined") {
      window.location.href = protocolUrl;
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
    <main className="min-h-screen w-full bg-(--bg-mist) text-(--text-primary) flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
      
      {/* Background radial mesh glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-(--accent)/4 blur-[120px] pointer-events-none select-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/3 blur-[120px] pointer-events-none select-none z-0"></div>

      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-md relative z-10 flex flex-col items-center text-center gap-6">
        
        {/* Animated radar launcher visual */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-(--accent-soft) border border-(--accent)/10 flex items-center justify-center text-(--accent) animate-pulse z-10">
            <Laptop className="w-8 h-8" />
          </div>
          {/* Pulsing ring 1 */}
          <div className="absolute inset-0 rounded-full border border-(--accent)/20 animate-ping opacity-75" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-(--accent) font-black uppercase tracking-widest">Deep-Link Protocol</span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Launching CrackTheLoop HUD...
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
            Your browser should prompt you to open <span className="text-indigo-600 font-bold">\"CrackTheLoop\"</span>. If the app is installed, it will load the stealth HUD overlay automatically.
          </p>
        </div>

        {/* Diagnostic status block */}
        <div className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-3.5 text-xs text-left font-semibold">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider">
            <span>Agent Connection Status</span>
            <span className="text-indigo-600">Attempt #{launchAttempts}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Local deep link broadcasted</span>
            <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
              ✓ Sent
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Awaiting local desktop client hook</span>
            <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-(--accent)" />
              Listening...
            </span>
          </div>
        </div>

        {/* Launch actions */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleRetryLaunch}
            className="w-full py-3.5 bg-(--accent) hover:bg-(--accent-bright) text-white rounded-lg font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-(--accent)/10 cursor-pointer flex justify-center items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Try Launching Again
          </button>

          <Link
            href={`/call-session/${sessionId}`}
            className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-800 border border-slate-250/70 rounded-lg font-bold text-xs uppercase tracking-wider transition text-center flex justify-center items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            Run in Browser Instead
          </Link>
        </div>

        {/* Failed notice / Downloader links */}
        {showFailedNotice && (
          <div className="w-full border-t border-slate-100 pt-5 flex flex-col gap-4 animate-fade-in text-left">
            <div className="flex gap-2.5 p-3 bg-amber-50 border border-amber-250/80 rounded-lg text-[10.5px] leading-relaxed text-amber-800 font-bold">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-600 mt-0.5" />
              <span>Not opening? The CrackTheLoop local companion client might not be installed on your machine yet.</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Download Desktop Companion</span>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => alert("Simulating Windows download bundle...")}
                  className="p-3 border border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition flex items-center justify-center gap-2 font-bold text-xs text-slate-700 cursor-pointer"
                >
                  <WindowsIcon className="w-4 h-4 text-slate-500" />
                  <span>Windows (.exe)</span>
                </button>
                
                <button 
                  onClick={() => alert("Simulating macOS download bundle...")}
                  className="p-3 border border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition flex items-center justify-center gap-2 font-bold text-xs text-slate-700 cursor-pointer"
                >
                  <AppleIcon className="w-4 h-4 text-slate-550" />
                  <span>macOS (.dmg)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <Link
          href="/dashboard/call-sessions"
          className="text-[10px] text-slate-450 hover:text-slate-650 font-extrabold uppercase tracking-wider flex items-center gap-1 mt-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel and return to logs
        </Link>

      </div>
    </main>
  );
}
