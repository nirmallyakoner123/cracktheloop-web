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
import { getMockResumes, getMockSessions } from "@/lib/mockService";

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
  "price_1TgO9FLpVCAm43ah8vQKQWOg": "starter",
  "price_1TgQxGLpVCAm43ahnYrNotgE": "starter",
  "price_1TgO9nLpVCAm43ahHiFpXn5o": "pro",
  "price_1TgQxGLpVCAm43ahl7CIJiRd": "pro",
};

function normalizeTier(raw?: string): string {
  if (!raw) return "free";
  return PRICE_TO_TIER[raw] ?? raw;
}

function DashboardHomeContent() {
  const router = useRouter();

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  function setCookie(name: string, value: string, days = 7) {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

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
    completeProfile: false,
    selectGoal: false,
    uploadResumeJD: false,
    chooseFormat: false,
    runWebDemo: false,
    downloadHUD: false,
    soundCheck: false,
    startCopilot: false,
    submitFeedback: false
  });

  // Interactive UI modals/testers states
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [micTesting, setMicTesting] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState<number[]>([12, 8, 16, 5, 22, 10, 6, 18, 11]);

  const [hasResume, setHasResume] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedToken = getCookie("ctl_token");
    const savedUser = getCookie("ctl_user");

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
    const savedChecklist = getCookie("ctl_onboarding_checklist");
    if (savedChecklist) {
      try {
        const parsed = JSON.parse(savedChecklist);
        setChecklist(prev => ({ ...prev, ...parsed }));
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
          let updatedUser = profileData.user;
          // Auto-provision trial if tier is empty or free and has 0 credits (New User)
          if ((!updatedUser.subscription_tier || updatedUser.subscription_tier === "free") && updatedUser.credits === 0) {
            try {
              const trialRes = await fetch("/api/billing/trial", {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${savedToken}`
                }
              });
              const trialData = await trialRes.json();
              if (trialRes.ok && trialData.user) {
                updatedUser = trialData.user;
              }
            } catch (trialErr) {
              console.error("Auto-provision trial failed", trialErr);
            }
          }
          setUser(updatedUser);
          setCookie("ctl_user", JSON.stringify(updatedUser));
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
    setHasResume(getMockResumes().length > 0);
    setHasSession(getMockSessions().length > 0);
  }, [router]);

  // Save checklist helper
  function updateChecklist(key: keyof typeof checklist, value: boolean) {
    const updated = { ...checklist, [key]: value };
    setChecklist(updated);
    setCookie("ctl_onboarding_checklist", JSON.stringify(updated));
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
        updateChecklist("soundCheck", true);
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
        updateChecklist("soundCheck", true);
      }, 4000);
    }
  }

  // Simulator helper: Quick Sandbox Test
  function handleSandboxTrigger() {
    updateChecklist("runWebDemo", true);
    router.push("/dashboard/call-sessions");
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
  const completedSteps = [hasResume, hasSession, (user?.credits || 0) > 50].filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / 3) * 100);

  const refCode = user?.referral_code || "";
  const refLink = refCode ? `localhost:3000/login?ref=${refCode}` : "";

  return (
    <main className="flex-1 w-full px-6 md:px-10 py-5 md:py-6 flex flex-col gap-6 relative select-none">

      {/* Page Title Header */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] text-(--accent) font-semibold uppercase tracking-wider">
          Interview Practice & Live Copilot Console
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          Welcome,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8503A] to-indigo-600">
            {user?.email?.split("@")[0]}
          </span>
        </h1>
        <p className="text-[13px] text-slate-500 font-medium animate-fade-in">
          Configure your copilot targets, test your audio line, and initialize your live interactive overlay.
        </p>
      </section>

      {/* Main Grid split */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Left column - Unified Launchpad Console */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-6">

          {/* Header Block inside Left Console */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base md:text-lg font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-(--accent)" />
                Onboarding Journey
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Complete these setup steps to begin mock interviewing with the AI Copilot.</p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <span className="text-xs font-medium text-slate-500">Progress:</span>
              <span className="text-xs font-semibold text-(--accent) bg-(--accent-soft) px-3 py-1 rounded-full border border-(--accent)/15">
                {completedSteps} / 3 Setup Steps
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

          {/* Horizontal User Journey Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 select-none mt-2">
            {[
              {
                id: "resume",
                title: "1. Add Your Resume",
                desc: "Upload or type your career accomplishments so the AI tailors answers to your experience.",
                actionText: "CVs / Resumes",
                actionHref: "/dashboard/resumes",
                completed: hasResume,
              },
              {
                id: "free-session",
                title: "2. Try a Free Session",
                desc: "Configure a 10-minute trial session in your browser to see the live overlay in action.",
                actionText: "Start Free Session",
                actionHref: "/dashboard/call-sessions",
                completed: hasSession,
              },
              {
                id: "buy-credits",
                title: "3. Get Fuel Credits",
                desc: "Purchase a one-time pass to unlock unlimited streaming, custom models, and stealth features.",
                actionText: "View Pricing",
                actionHref: "/pricing",
                completed: (user?.credits || 0) > 50,
              },
              {
                id: "real-interview",
                title: "4. Start Your Session",
                desc: "Unlock active loops. Open the desktop app or connect your browser call to crack the loop.",
                actionText: "Open Sessions",
                actionHref: "/dashboard/call-sessions",
                completed: false,
              }
            ].map((step, idx) => (
              <div 
                key={step.id} 
                className={`bg-white/80 backdrop-blur-md border rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 relative ${
                  step.completed 
                    ? "border-emerald-500 bg-emerald-50/10" 
                    : "border-slate-200/80 hover:border-(--accent)/30"
                }`}
              >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Step {idx + 1}
                      </span>
                      {step.completed ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-semibold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                          ✓ Done
                        </span>
                      ) : (
                        step.id === "resume" && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold uppercase px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )
                      )}
                    </div>
                    
                    <h3 className="text-sm font-semibold text-slate-800 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                  
                  <Link
                    href={step.actionHref}
                    className={`w-full py-2.5 rounded-lg text-center font-semibold text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1 ${
                      step.completed 
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer" 
                        : "bg-[#E8503A] hover:bg-[#F06B57] text-white shadow-xs cursor-pointer"
                    }`}
                  >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>

          {/* Tutorial Section */}
          <div className="border-t border-slate-100 pt-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-4 h-4 text-(--accent) fill-current" />
                Video Walkthrough Guide
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Watch a 2-minute overview of setting up screen share audio, overlay positioning, and passing AI video screeners.</p>
            </div>

            <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row gap-5 items-center">
              <div className="w-full md:w-56 h-32 bg-slate-950 rounded-lg relative overflow-hidden flex items-center justify-center shrink-0 shadow-sm group cursor-pointer border border-slate-800">
                <div className="absolute inset-0 opacity-[0.15]" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }} />
                
                <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition duration-300 z-10 group-hover:scale-110">
                  <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                </div>
                
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white px-1.5 py-0.5 rounded font-bold">
                  2:14
                </span>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <h4 className="text-base font-semibold text-slate-800 leading-snug">
                  How to setup audio loopback & stealth HUD in 60 seconds
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-normal">
                  This walkthrough details how to share your web tab with audio enabled, align the overlay panel cleanly next to Zoom or Google Meet calls, and leverage dynamic cheat sheets without trigger warnings.
                </p>
                <div className="flex flex-wrap gap-2 mt-1 select-none">
                  <span className="px-2 py-0.5 text-[8.5px] font-mono font-bold bg-slate-100 text-slate-655 border border-slate-200 rounded">
                    Zoom Stealth HUD
                  </span>
                  <span className="px-2 py-0.5 text-[8.5px] font-mono font-bold bg-slate-100 text-slate-655 border border-slate-200 rounded">
                    Audio Permissions
                  </span>
                  <span className="px-2 py-0.5 text-[8.5px] font-mono font-bold bg-slate-100 text-slate-655 border border-slate-200 rounded">
                    Screener Bypass
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column - Unified Telemetry Console Card */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm flex flex-col gap-5 select-none">

          {/* Section 1: Fuel Gauge & Status */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
              Copilot Telemetry
            </span>

            {/* Fuel gauge bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Copilot Fuel</span>
                <span className="text-lg font-black text-slate-800">
                  {user?.credits ?? 0} <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Credits</span>
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
              <span className="text-xs text-slate-400 font-medium">1 credit consumes 1 minute stream duration.</span>
            </div>

            <div className="flex justify-between items-center text-xs mt-1 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-2">
              <span className="font-medium text-slate-500">Subscription Status</span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                Tier: {normalizeTier(user?.subscription_tier)}
              </span>
            </div>

            <Link
              href="/pricing"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-800 rounded-lg text-center font-semibold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              Refill Fuel / Upgrade <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="border-t border-slate-100" />

          {/* Section 2: Referral Invitation Link */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-500 shrink-0" />
              Referral Rewards Invite
            </h3>
            <p className="text-xs text-slate-500 leading-normal font-medium">
              Share code - both get 50 free credits on trial activation, plus up to 50% bonus on plan purchases.
            </p>

            {refCode ? (
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5">
                  <span className="flex-1 text-xs text-slate-650 truncate font-mono font-medium">
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
                  className="text-xs text-purple-600 hover:underline font-semibold mt-1"
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
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-(--accent)" />
              Recent Transcripts
            </h3>

            {interviewsLoading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="w-5 h-5 text-slate-450 animate-spin" />
              </div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">
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
                      <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">{session.role}</span>
                      {session.report ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-1.5 py-0.5 rounded font-semibold">
                          ★ {session.report.overall_score}/100
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic font-medium">Not Evaluated</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(session.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {session.transcript?.length || 0} Turns</span>
                    </div>

                    <Link
                      href={`/dashboard/interviews/${session._id}`}
                      className="text-xs text-(--accent) hover:underline font-semibold flex items-center gap-0.5 mt-1 border-t border-slate-100/60 pt-2"
                    >
                      View Session Report <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                ))}

                <Link
                  href="/dashboard/interviews"
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider mt-1"
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

            <div className="flex items-center gap-3 border-b border-indigo-100 pb-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center animate-pulse shrink-0">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-indigo-950 tracking-tight">
                  Ethics & Responsible Practice Guidelines
                </h3>
                <p className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider">COMPLIANCE & PREPARATION STANDARDS</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">

              {/* Critical Rule 1 */}
              <div className="bg-indigo-50/60 border border-indigo-200/50 p-3 rounded-lg flex gap-2.5">
                <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1 flex flex-col gap-0.5">
                  <strong className="text-sm font-semibold text-indigo-900 tracking-tight">
                    Rule #1: Focus on Clarity & Answer Structure
                  </strong>
                  <p className="text-xs text-indigo-750 leading-relaxed font-medium">
                    The Copilot HUD provides real-time response guides and STAR method templates to help you structure answers. Sits next to your meeting windows locally. Only share your IDE or editor during technical rounds.
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg flex gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-0.5">
                  <strong className="text-sm font-semibold text-slate-800">
                    Rule #2: Distraction-Free Desktop HUD Overlay
                  </strong>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    For distraction-free local practice and session alignment, launch the Desktop HUD client. It displays visual talking points directly over your desktop locally.
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg flex gap-2.5">
                <Volume2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-0.5">
                  <strong className="text-sm font-semibold text-slate-800">
                    Rule #3: Set Up Target Role Configurations
                  </strong>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Set your target role and goals before your live mock session so that the AI response recommendations map accurately to the job description targets.
                  </p>
                </div>
              </div>

            </div>

            {/* Force user verification checkmark */}
            <div className="mt-5 border-t border-slate-100 pt-5 flex flex-col gap-4">
              <label className="flex items-start gap-3 p-3 bg-indigo-500/5 border border-indigo-500/25 rounded-lg cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-1 accent-indigo-600 h-4.5 w-4.5 shrink-0 rounded cursor-pointer"
                />
                <span className="text-xs text-indigo-900 leading-normal font-medium">
                  I acknowledge that this copilot functions as a local response coach and speech guide to help me communicate clearly during my practice mock trials and live sessions.
                </span>
              </label>

              <button
                disabled={!acknowledged}
                onClick={() => {
                  setShowPlaybook(false);
                  updateChecklist("completeProfile", true);
                }}
                className={`w-full py-3 rounded-lg font-semibold text-xs uppercase tracking-wider transition duration-200 flex justify-center items-center gap-1.5 ${acknowledged
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {!acknowledged ? "Acknowledge Guidelines above to proceed" : "Confirm Guidelines & Unlock Onboarding"}
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
