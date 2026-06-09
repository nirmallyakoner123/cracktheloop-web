"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Shield, 
  Check, 
  Sparkles, 
  Loader2, 
  Gift,
  ArrowRight,
  Info,
  Lock,
  Zap,
  Cpu,
  Clock,
  EyeOff
} from "lucide-react";
import Link from "next/link";

function SelectPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("ref") || "";

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Stripe Price IDs mapped to local products
  const priceIds: Record<string, string> = {
    "Starter Pass": "price_1TeCnyEkHwm1l3fZV45CSLvV",
    "Pro Pass": "price_1TeCpEEkHwm1l3fZej0zzJhb",
    "Elite Pass": "price_1TeCpaEkHwm1l3fZj9f7Gh31"
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("ctl_token");
    const savedUser = localStorage.getItem("ctl_user");

    if (!savedToken || !savedUser) {
      router.push(`/login${referralFromUrl ? `?ref=${referralFromUrl}` : ""}`);
      return;
    }

    setToken(savedToken);
    let parsedUser: any = null;
    try {
      parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Keep cookie updated under path=/
      document.cookie = `ctl_token=${savedToken}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `ctl_user=${encodeURIComponent(savedUser)}; path=/; max-age=604800; SameSite=Lax`;
    } catch (e) {
      // Ignored
    }
    setLoading(false);

    // Auto-trigger plan checkout or trial selection if passed from pricing page
    const autoPlan = searchParams.get("plan");
    if (autoPlan && parsedUser) {
      if (autoPlan === "Free Trial") {
        setTimeout(() => {
          handleSelectTrialDirect(savedToken);
        }, 400);
      } else if (priceIds[autoPlan]) {
        setTimeout(() => {
          handleSelectPaidDirect(autoPlan, savedToken, parsedUser);
        }, 400);
      }
    }
  }, [router, searchParams]);

  async function handleSelectTrialDirect(activeToken: string) {
    if (!activeToken) return;
    setActionLoading("trial");
    setErrorMsg("");
    try {
      const res = await fetch("/api/billing/trial", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to activate Free Trial");

      // Update local cache & cookies
      localStorage.setItem("ctl_user", JSON.stringify(data.user));
      document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;
      router.replace("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  async function handleSelectTrial() {
    if (!token) return;
    setActionLoading("trial");
    setErrorMsg("");
    try {
      const res = await fetch("/api/billing/trial", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to activate Free Trial");

      // Update local cache & cookies
      localStorage.setItem("ctl_user", JSON.stringify(data.user));
      document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;
      router.replace("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  async function handleSelectPaidDirect(planName: string, activeToken: string, activeUser: any) {
    if (!activeToken || !activeUser) return;
    setActionLoading(planName);
    setErrorMsg("");
    try {
      const priceId = priceIds[planName];
      if (!priceId) throw new Error("Price ID not configured");

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: activeUser.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to create checkout session");

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No Stripe checkout URL returned");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  async function handleSelectPaid(planName: string) {
    if (!token || !user) return;
    setActionLoading(planName);
    setErrorMsg("");
    try {
      const priceId = priceIds[planName];
      if (!priceId) throw new Error("Price ID not configured");

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to create checkout session");

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No Stripe checkout URL returned");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-(--accent) animate-spin" />
      </div>
    );
  }

  const hasReferral = !!user?.referred_by || !!referralFromUrl;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col justify-center items-center relative overflow-hidden py-12 px-6 select-none">
      
      {/* Premium background glowing elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-(--accent)/12 blur-[100px] pointer-events-none animate-float-orb"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-float-orb-slow"></div>
      <div className="absolute top-[35%] left-[25%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[90px] pointer-events-none animate-float-orb animate-pulse" style={{ animationDuration: "14s" }}></div>

      <div className="w-full max-w-6xl flex flex-col gap-8 relative z-10">
        
        {/* Top Header Bar for branding & secure billing */}
        <div className="w-full flex items-center justify-between z-20 select-none pb-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer">
            <img src="/logo.png" className="h-8 w-auto object-contain" alt="Logo" />
            <span className="text-sm font-bold tracking-tight text-white">
              Crack<span className="text-(--accent) font-black">TheLoop</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
            <Lock className="w-3 h-3 text-emerald-450" />
            Secure Billing Gateway
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            Authentication Successful
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1 animate-slide-in" style={{ fontFamily: "var(--font-display)" }}>
            Choose Your <span className="text-gradient-coral">Access Plan</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg leading-relaxed mt-1">
            Provision your stealth copilot credits. Select the Free Trial to test-drive CrackTheLoop, or purchase a premium pass to unlock high-capacity interview fuel.
          </p>

          {hasReferral && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 shadow-sm animate-pulse">
              <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
              Referral Applied: You will receive +20% bonus credits on activation!
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="w-full max-w-md mx-auto p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-450 text-xs font-bold text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mt-4">
          
          {/* Free Trial Card */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/[0.01]">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-black text-slate-200 tracking-tight">Free Trial</h3>
                <span className="bg-white/10 text-white/95 border border-white/10 px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">Free</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-semibold leading-relaxed">Evaluate the platform first</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/5 pb-4">
                <span className="text-4xl font-black text-white tracking-tight">{hasReferral ? "18" : "15"}</span>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Credits</span>
                <span className="text-[10px] text-slate-500 ml-auto font-bold">$0 one-time</span>
              </div>

              <ul className="text-xs text-slate-350 flex flex-col gap-3.5 mt-5 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                  {hasReferral ? "18" : "15"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" />
                  Limit: 1 Interview session
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" />
                  Limit: 1 AI Report analysis
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  7-Day Trial validity
                </li>
              </ul>
            </div>

            <button
              onClick={handleSelectTrial}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white rounded-xl font-bold text-xs transition active:scale-95 duration-200 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === "trial" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Start Trial</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </>
              )}
            </button>
          </div>

          {/* Starter Plan */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/[0.01]">
            <div>
              <h3 className="text-lg font-black text-slate-200 tracking-tight">Starter Pass</h3>
              <p className="text-[11px] text-slate-400 mt-1.5 font-semibold leading-relaxed">For beginners practicing challenges</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/5 pb-4">
                <span className="text-4xl font-black text-white tracking-tight">{hasReferral ? "120" : "100"}</span>
                <span className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">Credits</span>
                <span className="text-[10px] text-slate-300 ml-auto font-extrabold">$19<span className="text-slate-500 font-bold text-[9px] uppercase tracking-normal">/mo</span></span>
              </div>

              <ul className="text-xs text-slate-350 flex flex-col gap-3.5 mt-5 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                  {hasReferral ? "120" : "100"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" />
                  Streaming STT voice capturing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" />
                  Standard low-latency audio capture
                </li>
                <li className="flex items-center gap-2 text-slate-550">
                  <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
                  LLaMA-3.1 model support
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Starter Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white rounded-xl font-bold text-xs transition active:scale-95 duration-200 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === "Starter Pass" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>Purchase $19</span>
              )}
            </button>
          </div>

          {/* Pro Pass Card (Popular) */}
          <div className="bg-gradient-to-b from-[#181d2e] to-[#121624] border-2 border-(--accent) rounded-2xl p-6 flex flex-col justify-between min-h-[440px] relative transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-(--accent)/5 hover:shadow-(--accent)/10">
            <div className="absolute -top-3.5 left-1/2 -translate-y-0.5 -translate-x-1/2 bg-(--accent) text-white px-3.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-md shadow-(--accent)/20 animate-pulse">
              Popular
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                Pro Pass
                <Sparkles className="w-4 h-4 text-(--accent)" />
              </h3>
              <p className="text-[11px] text-slate-350 mt-1.5 font-semibold leading-relaxed">Ideal for active interview stages</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/10 pb-4">
                <span className="text-4xl font-black text-white tracking-tight">{hasReferral ? "360" : "300"}</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Credits</span>
                <span className="text-[10px] text-white ml-auto font-black text-lg">$39<span className="text-slate-400 font-bold text-[9px] uppercase tracking-normal">/mo</span></span>
              </div>

              <ul className="text-xs text-slate-200 flex flex-col gap-3.5 mt-5 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                  {hasReferral ? "360" : "300"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                  Sub-second latency streaming STT
                </li>
                <li className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-emerald-450 shrink-0" />
                  Interactive Desktop Practice HUD
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-450 shrink-0" />
                  Unlimited concurrent LLM runs
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  Groq & xAI keys support
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Pro Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3.5 bg-[#E8503A] hover:bg-[#F06B57] text-white rounded-xl font-bold text-xs transition active:scale-95 duration-200 cursor-pointer uppercase tracking-widest flex justify-center items-center gap-1.5 shadow-md shadow-[#E8503A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === "Pro Pass" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>Upgrade to Pro</span>
              )}
            </button>
          </div>

          {/* Elite Pass Card */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/[0.01]">
            <div>
              <h3 className="text-lg font-black text-slate-200 tracking-tight">Elite Pass</h3>
              <p className="text-[11px] text-slate-400 mt-1.5 font-semibold leading-relaxed">Advanced custom context models</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/5 pb-4">
                <span className="text-4xl font-black text-white tracking-tight">{hasReferral ? "1200" : "1000"}</span>
                <span className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">Credits</span>
                <span className="text-[10px] text-slate-300 ml-auto font-extrabold">$79<span className="text-slate-500 font-bold text-[9px] uppercase tracking-normal">/mo</span></span>
              </div>

              <ul className="text-xs text-slate-350 flex flex-col gap-3.5 mt-5 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  {hasReferral ? "1200" : "1000"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" />
                  All Pro features included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" />
                  Highest accuracy GPT-4o-mini & Claude
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" />
                  PDF & DOCX Resume parsing extraction
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
                  Priority routing API proxy pipelines
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Elite Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white rounded-xl font-bold text-xs transition active:scale-95 duration-200 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === "Elite Pass" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>Purchase $79</span>
              )}
            </button>
          </div>

        </div>

        {/* Dynamic Credit Info & Security Badges */}
        <div className="w-full bg-[#131826]/80 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 shadow-inner relative overflow-hidden">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-450 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-[11px] text-slate-400 leading-relaxed max-w-2xl font-semibold">
              <strong className="text-slate-200">Credit Consumption Info:</strong> Real-time interview Copilot usage consumes <span className="text-(--accent) font-bold">1 credit per minute</span> with a <span className="text-white">minimum charge of 10 credits</span> per interview session. AI evaluation report generation consumes <span className="text-indigo-400 font-bold">5 credits</span> per analysis.
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[9px] text-slate-500 font-black uppercase tracking-widest shrink-0 self-center sm:self-auto border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-6">
            <span className="flex items-center gap-1.5 text-slate-450"><Shield className="w-3.5 h-3.5 text-emerald-500" /> SSL SECURE</span>
            <span className="text-slate-700 hidden sm:inline-block">•</span>
            <span className="text-slate-450">STRIPE BILLING</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SelectPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F1A] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-(--accent) animate-spin" />
      </div>
    }>
      <SelectPlanContent />
    </Suspense>
  );
}
