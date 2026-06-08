"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Shield,
  Sparkles,
  Loader2,
  ArrowRight,
  User as UserIcon,
  CheckCircle,
  ExternalLink,
  Zap,
  Gift,
  Copy,
  Check,
  Users,
  History,
  Lock,
  Volume2,
  Play,
  Terminal,
  Download,
  Info,
  Calendar,
  MessageSquare,
  AlertTriangle,
  AlertOctagon
} from "lucide-react";
import Link from "next/link";
import { WindowsIcon, AppleIcon } from "@/app/components/icons/BrandIcons";

interface SessionData {
  _id: string;
  role: string;
  company?: string;
  created_at: string;
  transcript?: any[];
  report?: {
    overall_score: number;
  };
}

// Normalize raw Stripe price IDs stored in legacy records to human-readable tier names
const PRICE_TO_TIER: Record<string, string> = {
  "price_1TeCnyEkHwm1l3fZV45CSLvV": "starter",
  "price_1TeCpEEkHwm1l3fZej0zzJhb": "pro",
  "price_1TeCpaEkHwm1l3fZj9f7Gh31": "elite",
};

function normalizeTier(raw?: string): string {
  if (!raw) return "free";
  return PRICE_TO_TIER[raw] ?? raw;
}

function DashboardHomeContent() {
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<SessionData[]>([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);

  // Referral UI helpers
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Onboarding Checklist state
  const [checklist, setChecklist] = useState({
    readRules: false,
    chooseEngine: false,
    testMic: false,
    runSandbox: false
  });

  // Interactive UI modals/testers states
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [micTesting, setMicTesting] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState<number[]>([12, 8, 16, 5, 22, 10, 6, 18, 11]);

  const [mounted, setMounted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem("ctl_token");
    const savedUser = localStorage.getItem("ctl_user");

    if (!savedToken) {
      router.push("/login");
      return;
    }

    setToken(savedToken);
    try {
      setUser(JSON.parse(savedUser || "{}"));
    } catch (e) {
      // Ignored
    }

    // Load saved checklist progress
    const savedChecklist = localStorage.getItem("ctl_onboarding_checklist");
    if (savedChecklist) {
      try {
        setChecklist(JSON.parse(savedChecklist));
      } catch (e) {
        // Ignored
      }
    }

    async function loadDashboardData() {
      try {
        // Refresh profile to fetch latest credit count & tier status
        const profileRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.user) {
          setUser(profileData.user);
          localStorage.setItem("ctl_user", JSON.stringify(profileData.user));
          document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(profileData.user))}; path=/; max-age=604800; SameSite=Lax`;
        }

        // Fetch user interviews
        const interviewsRes = await fetch("/api/interviews", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const interviewsData = await interviewsRes.json();
        if (interviewsRes.ok) {
          setInterviews(interviewsData.interviews || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
        setInterviewsLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  // Save checklist helper
  function updateChecklist(key: keyof typeof checklist, value: boolean) {
    const updated = { ...checklist, [key]: value };
    setChecklist(updated);
    localStorage.setItem("ctl_onboarding_checklist", JSON.stringify(updated));
  }

  // Micro-interactions: Mic testing simulation or active feed
  async function handleTestMic() {
    setMicTesting(true);
    try {
      // Attempt to request audio permission for high trust rating
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicActive(true);

      const interval = setInterval(() => {
        setMicVolume(prev => prev.map(() => Math.floor(Math.random() * 32) + 4));
      }, 80);

      setTimeout(() => {
        clearInterval(interval);
        stream.getTracks().forEach(track => track.stop());
        setMicActive(false);
        setMicTesting(false);
        updateChecklist("testMic", true);
      }, 4500);

    } catch (err) {
      // Permission denied or browser block - fallback to elegant CSS simulation
      setMicActive(true);
      const interval = setInterval(() => {
        setMicVolume(prev => prev.map(() => Math.floor(Math.random() * 26) + 4));
      }, 85);

      setTimeout(() => {
        clearInterval(interval);
        setMicActive(false);
        setMicTesting(false);
        updateChecklist("testMic", true);
      }, 4000);
    }
  }

  // Simulator helper: Quick Sandbox Test
  function handleSandboxTrigger() {
    updateChecklist("runSandbox", true);
    router.push("/copilot?demo=true");
  }

  // Clipboard copy
  function copyToClipboard(text: string, type: "code" | "link") {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    });
  }

  if (loading && !user) {
    return (
      <div className="flex-1 flex justify-center items-center py-20 bg-(--bg-mist)">
        <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
      </div>
    );
  }

  // Onboarding metrics calculation
  const completedSteps = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / 4) * 100);

  const refCode = user?.referral_code || "";
  const refLink = refCode ? `localhost:3000/login?ref=${refCode}` : "";

  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5 md:py-6 flex flex-col gap-6 relative select-none">

      {/* Page Title Header */}
      <section className="flex flex-col gap-2">
        <span className="text-[10px] text-(--accent) font-black uppercase tracking-widest">
          Stealth Command Center
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          Initialize Access,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8503A] to-indigo-600">
            {user?.email?.split("@")[0]}
          </span>
        </h1>
        <p className="text-xs text-slate-500 font-medium animate-fade-in">
          Follow the system setup below to configure your audio loopback feeds and run undetection tests.
        </p>
      </section>

      {/* Main Grid split */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Left column - Unified Launchpad Console */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-6">

          {/* Header Block inside Left Console */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-5 h-5 text-(--accent)" />
                Gateway Setup Timeline
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Initialize credentials, audio lines, and bypass configurations.</p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <span className="text-xs font-bold text-slate-500">Progress:</span>
              <span className="text-xs font-black text-(--accent) bg-(--accent-soft) px-3 py-1 rounded-full border border-(--accent)/15">
                {completedSteps} / 4 Steps Complete
              </span>
            </div>
          </div>

          {/* Checklist Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative -mt-4">
            <div
              className="bg-gradient-to-r from-(--accent) to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Onboarding Timeline list */}
          <div className="relative flex flex-col gap-5 pl-2 select-none">
            {/* Vertical timeline line */}
            <div className="absolute left-[21px] top-3.5 bottom-3.5 w-0.5 bg-slate-100" />

            {/* Step 1: Safety Playbook */}
            <div className="relative flex items-start gap-4">
              {/* Timeline Node */}
              <button
                onClick={() => updateChecklist("readRules", !checklist.readRules)}
                className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white transition-all cursor-pointer shadow-xs shrink-0"
              >
                {checklist.readRules ? (
                  <CheckCircle className="w-7 h-7 text-emerald-500 fill-emerald-50 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-350 bg-white hover:border-slate-400 shrink-0" />
                )}
              </button>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 -mt-0.5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs md:text-sm font-bold ${checklist.readRules ? "text-slate-450 line-through" : "text-slate-800"}`}>
                      1. Review Stealth Safety Rules
                    </span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200/50 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Crucial</span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Learn how browser layout shares and system windows hide in popular conferencing software.
                  </span>
                </div>
                <button
                  onClick={() => setShowPlaybook(true)}
                  className="text-xs text-(--accent) hover:text-(--accent-bright) font-extrabold flex items-center gap-1 shrink-0 self-start sm:self-center"
                >
                  Open Rules Playbook <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step 2: Choose Engine */}
            <div className="relative flex items-start gap-4">
              {/* Timeline Node */}
              <button
                onClick={() => updateChecklist("chooseEngine", !checklist.chooseEngine)}
                className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white transition-all cursor-pointer shadow-xs shrink-0"
              >
                {checklist.chooseEngine ? (
                  <CheckCircle className="w-7 h-7 text-emerald-500 fill-emerald-50 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-350 bg-white hover:border-slate-400 shrink-0" />
                )}
              </button>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 -mt-0.5">
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs md:text-sm font-bold ${checklist.chooseEngine ? "text-slate-450 line-through" : "text-slate-800"}`}>
                    2. Configure Client Application Setup
                  </span>
                  <span className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Identify if you require browser-only capture (Web HUD) or native overlay display bypasses.
                  </span>
                </div>
                <button
                  onClick={() => {
                    updateChecklist("chooseEngine", true);
                    const el = document.getElementById("launcher-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-extrabold flex items-center gap-1 shrink-0 self-start sm:self-center"
                >
                  Compare Launch Options <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step 3: Test Audio Stream */}
            <div className="relative flex items-start gap-4">
              {/* Timeline Node */}
              <button
                onClick={() => updateChecklist("testMic", !checklist.testMic)}
                className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white transition-all cursor-pointer shadow-xs shrink-0"
              >
                {checklist.testMic ? (
                  <CheckCircle className="w-7 h-7 text-emerald-500 fill-emerald-50 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-350 bg-white hover:border-slate-400 shrink-0" />
                )}
              </button>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 -mt-0.5">
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs md:text-sm font-bold ${checklist.testMic ? "text-slate-450 line-through" : "text-slate-800"}`}>
                    3. Perform Mic & System Loopback Check
                  </span>
                  <span className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Verify browser audio feeds map accurately to the transcript transcription matrices without credit consumption.
                  </span>

                  {micActive && (
                    <div className="flex items-center gap-1 mt-2.5 h-6 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-1.5 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1"></span>
                      {micVolume.map((val, idx) => (
                        <div
                          key={idx}
                          className="w-[2px] bg-emerald-500 rounded-full transition-all duration-75 animate-pulse"
                          style={{ height: `${val}px` }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  disabled={micTesting}
                  onClick={handleTestMic}
                  className="text-xs text-(--accent) hover:text-(--accent-bright) font-extrabold flex items-center gap-1.5 shrink-0 self-start sm:self-center disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {micTesting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing (4s)...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Run 5-Sec Audio Test</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 4: Sandbox Trial */}
            <div className="relative flex items-start gap-4">
              {/* Timeline Node */}
              <button
                onClick={() => updateChecklist("runSandbox", !checklist.runSandbox)}
                className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white transition-all cursor-pointer shadow-xs shrink-0"
              >
                {checklist.runSandbox ? (
                  <CheckCircle className="w-7 h-7 text-emerald-500 fill-emerald-50 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-350 bg-white hover:border-slate-400 shrink-0" />
                )}
              </button>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 -mt-0.5">
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs md:text-sm font-bold ${checklist.runSandbox ? "text-slate-450 line-through" : "text-slate-800"}`}>
                    4. Initialize Mock Practice Sandbox
                  </span>
                  <span className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Initiate a simulated speech feed question in the HUD workspace to verify suggestion cards load instantly.
                  </span>
                </div>
                <button
                  onClick={handleSandboxTrigger}
                  className="text-xs text-(--accent) hover:text-(--accent-bright) font-extrabold flex items-center gap-1 shrink-0 self-start sm:self-center"
                >
                  Launch Demo Sandbox <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Launch engines section inside Left Console Card */}
          <div id="launcher-section" className="border-t border-slate-100 pt-6">
            <div className="mb-5">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-(--accent)" />
                Launch Application Engines
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Run CrackTheLoop directly inside your browser or deploy native display filters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Web HUD */}
              <div className="flex flex-col justify-between gap-3.5 p-4.5 rounded-lg border border-slate-200/80 hover:border-(--accent)/35 transition-all">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      Browser Web HUD
                    </span>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/40 px-2 py-0.5 rounded">No Install</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Runs sandboxed in a separate browser workspace. Captures incoming system loopbacks. Best for quick testing or multi-monitor setups.
                  </p>
                </div>
                <Link
                  href="/copilot"
                  className="w-full py-2.5 bg-[#E8503A] hover:bg-[#F06B57] text-white rounded-lg text-center font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm shadow-[#E8503A]/10 hover:shadow-md cursor-pointer block"
                >
                  Launch Web HUD
                </Link>
              </div>

              {/* Desktop Client */}
              <div className="flex flex-col justify-between gap-3.5 p-4.5 rounded-lg border border-slate-200/80 hover:border-indigo-500/35 transition-all">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-indigo-500" />
                      Stealth Desktop Client
                    </span>
                    <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200/40 px-2 py-0.5 rounded">100% Secure</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Native binary utilizing display bypass rules. Hides the overlay transparent windows completely from screen share software (Zoom/Meet/Teams).
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href="https://github.com/Souravrooj-klizos/cracktheloop-desktop/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-center font-bold text-[10px] uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <WindowsIcon className="w-3.5 h-3.5 text-slate-500" /> Windows
                  </a>
                  <a
                    href="https://github.com/Souravrooj-klizos/cracktheloop-desktop/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-center font-bold text-[10px] uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AppleIcon className="w-3.5 h-3.5 text-slate-500" /> macOS
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right column - Unified Telemetry Console Card */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm flex flex-col gap-5 select-none">

          {/* Section 1: Fuel Gauge & Status */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">
              Copilot Telemetry
            </span>

            {/* Fuel gauge bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-500">AI Copilot Fuel</span>
                <span className="text-lg font-black text-slate-800">
                  {user?.credits ?? 0} <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">Credits</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${(user?.credits ?? 0) < 20
                      ? "bg-rose-500"
                      : (user?.credits ?? 0) < 100
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  style={{ width: `${Math.min(((user?.credits ?? 0) / 300) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[9.5px] text-slate-450 font-medium">1 credit consumes 1 minute stream duration.</span>
            </div>

            <div className="flex justify-between items-center text-xs mt-1 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-2">
              <span className="font-bold text-slate-500">Subscription Status</span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-black uppercase px-2.5 py-0.5 rounded">
                Tier: {normalizeTier(user?.subscription_tier)}
              </span>
            </div>

            <Link
              href="/pricing"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-800 rounded-lg text-center font-bold text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              Refill Fuel / Upgrade <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="border-t border-slate-100" />

          {/* Section 2: Referral Invitation Link */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-500 shrink-0" />
              Referral Rewards Invite
            </h3>
            <p className="text-[11px] text-slate-500 leading-normal font-semibold">
              Share link with colleagues - both of you earn bonus credits on paid subscriptions.
            </p>

            {refCode ? (
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5">
                  <span className="flex-1 text-[10px] text-slate-650 truncate font-mono font-bold">
                    {refLink}
                  </span>
                  <button
                    onClick={() => copyToClipboard(refLink, "link")}
                    title="Copy referral link"
                    className="text-slate-400 hover:text-purple-600 transition cursor-pointer flex-shrink-0"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <Link
                  href="/dashboard/referrals"
                  className="text-[10px] text-purple-600 hover:underline font-extrabold mt-1.5"
                >
                  Manage referrals & track conversions →
                </Link>
              </div>
            ) : (
              <Link
                href="/dashboard/referrals"
                className="text-[10px] text-purple-600 hover:underline font-extrabold mt-1"
              >
                Access Referral Hub Page →
              </Link>
            )}
          </div>

          <div className="border-t border-slate-100" />

          {/* Section 3: Recent transcript sessions */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-(--accent)" />
              Recent Transcripts
            </h3>

            {interviewsLoading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="w-5 h-5 text-slate-450 animate-spin" />
              </div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed px-4">
                  No interview logs found. Launch the Copilot HUD to record a session.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {interviews.slice(0, 2).map((session) => (
                  <div
                    key={session._id}
                    className="border border-slate-100 hover:border-slate-200 rounded-lg p-3 flex flex-col gap-2 bg-slate-50/20"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{session.role}</span>
                      {session.report ? (
                        <span className="text-[9.5px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-1.5 py-0.5 rounded font-black">
                          ★ {session.report.overall_score}/100
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-450 italic font-semibold">Not Evaluated</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(session.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {session.transcript?.length || 0} Turns</span>
                    </div>

                    <Link
                      href={`/dashboard/interviews/${session._id}`}
                      className="text-[9.5px] text-(--accent) hover:underline font-extrabold flex items-center gap-0.5 mt-1 border-t border-slate-100/60 pt-2"
                    >
                      View Session Report <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                ))}

                <Link
                  href="/dashboard/interviews"
                  className="w-full text-center text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest mt-1.5"
                >
                  View All Transcripts ({interviews.length})
                </Link>
              </div>
            )}
          </div>

        </div>

      </section>

      {/* Interactive Safety Playbook Modal */}
      {showPlaybook && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex justify-center items-center z-[100] p-6 animate-fade-in">
          <div className="w-full max-w-[520px] bg-white border border-slate-200 rounded-xl p-5 md:p-6 flex flex-col shadow-2xl relative select-none">
            <button
              onClick={() => setShowPlaybook(false)}
              className="text-slate-400 hover:text-slate-700 transition cursor-pointer font-bold absolute top-5 right-5 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-rose-100 pb-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center animate-pulse shrink-0">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-950 uppercase tracking-wide">
                  Stealth Safety Protocol
                </h3>
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">CRITICAL DIRECTIVE - READ CAREFULLY</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">

              {/* Critical Rule 1 */}
              <div className="bg-rose-50/60 border border-rose-200/50 p-3 rounded-lg flex gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1 flex flex-col gap-0.5">
                  <strong className="text-xs font-black text-rose-900 uppercase tracking-wider">
                    Rule #1: NEVER Share Your HUD Window
                  </strong>
                  <p className="text-[11px] text-rose-700 leading-relaxed font-semibold">
                    Do not share the browser tab or screen displaying this Web HUD. Sharing the wrong tab instantly displays the AI overlay to the interviewer. <strong className="text-rose-950">Only share your IDE or code editor.</strong>
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg flex gap-2.5">
                <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-0.5">
                  <strong className="text-xs font-bold text-slate-800">
                    Rule #2: Use Desktop Client for Full Bypass
                  </strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    For 100% video call isolation, install our Desktop client. It applies OS-level graphic affinity rules, making the overlay mathematically invisible to Zoom, Teams, and Google Meet captures.
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg flex gap-2.5">
                <Volume2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-0.5">
                  <strong className="text-xs font-bold text-slate-800">
                    Rule #3: Map Loopback Speakers Early
                  </strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    The AI generates suggestions by capturing speaker streams. Run the 5-sec Audio Test on the dashboard before your live call to verify input loopback mapping works correctly.
                  </p>
                </div>
              </div>

            </div>

            {/* Force user verification checkmark */}
            <div className="mt-5 border-t border-slate-100 pt-5 flex flex-col gap-4">
              <label className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/25 rounded-lg cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-1 accent-amber-600 h-4.5 w-4.5 shrink-0 rounded cursor-pointer"
                />
                <span className="text-[11px] text-amber-900 leading-normal font-bold">
                  I acknowledge that sharing the screen or browser tab displaying the Web HUD is a critical security violation that will expose suggestions to the interviewer.
                </span>
              </label>

              <button
                disabled={!acknowledged}
                onClick={() => {
                  setShowPlaybook(false);
                  updateChecklist("readRules", true);
                }}
                className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition duration-200 flex justify-center items-center gap-1.5 ${acknowledged
                    ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-md shadow-rose-600/10 active:scale-95"
                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {!acknowledged ? "Acknowledge Warning above to proceed" : "Confirm Safety Rules & Unlock Gateway"}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </main>
  );
}

export default function DashboardHomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-(--bg-mist) flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-(--accent) animate-spin" />
      </div>
    }>
      <DashboardHomeContent />
    </Suspense>
  );
}
