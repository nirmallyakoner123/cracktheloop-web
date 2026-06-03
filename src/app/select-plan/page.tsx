"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Shield, 
  Check, 
  Sparkles, 
  Zap, 
  Loader2, 
  Gift,
  ArrowRight,
  Info
} from "lucide-react";

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

    // Auto-trigger plan checkout if passed from pricing page
    const autoPlan = searchParams.get("plan");
    if (autoPlan && priceIds[autoPlan] && parsedUser) {
      setTimeout(() => {
        handleSelectPaidDirect(autoPlan, savedToken, parsedUser);
      }, 400);
    }
  }, [router, searchParams]);

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
      if (!res.ok) throw new Error(data.error || "Failed to activate Free Trial");

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
      if (!res.ok) throw new Error(data.error || "Failed to create checkout session");

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
      if (!res.ok) throw new Error(data.error || "Failed to create checkout session");

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
      <div className="min-h-screen bg-[#0B0D19] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>
    );
  }

  const hasReferral = !!user?.referred_by || !!referralFromUrl;

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col justify-center items-center relative overflow-hidden py-12 px-6">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/5 bg-blur-glow pointer-events-none select-none"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[#0DCAF0]/5 bg-blur-glow pointer-events-none select-none"></div>

      <div className="w-full max-w-5xl flex flex-col gap-8 relative z-10">
        
        {/* Title */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-[#6610F2]/10 border border-[#6610F2]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300">
            <Sparkles className="w-4 h-4 text-[#0DCAF0]" />
            Authentication Successful
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Access Plan</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md leading-relaxed">
            Select the Free Trial to test-drive CrackTheLoop, or purchase a premium pass to unlock high-capacity interview fuel.
          </p>

          {hasReferral && (
            <div className="mt-2 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400">
              <Gift className="w-4 h-4" />
              Referral Applied: You will receive +20% more credits on activation!
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="w-full max-w-md mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch mt-4">
          
          {/* Free Trial Card */}
          <div className="glow-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 bg-[#0c1125] min-h-[380px] transition hover:border-white/10 relative">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white">Free Trial</h3>
                <span className="bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">Free</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Evaluate the platform first</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-black text-white">{hasReferral ? "18" : "15"}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-300 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  {hasReferral ? "18" : "15"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Max 1 Interview Session
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Max 1 AI Report Analysis
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  7-Day Trial Expiration
                </li>
              </ul>
            </div>

            <button
              onClick={handleSelectTrial}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5"
            >
              {actionLoading === "trial" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Start Trial"}
              {actionLoading !== "trial" && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Starter Plan */}
          <div className="glow-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 bg-[#0c1125] min-h-[380px] transition hover:border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white">Starter Pass</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Ideal for standard interviews</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-black text-white">{hasReferral ? "120" : "100"}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-300 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  {hasReferral ? "120" : "100"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Streaming STT Capturing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Llama-3.1 Model Support
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Starter Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5"
            >
              {actionLoading === "Starter Pass" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Purchase $19"}
            </button>
          </div>

          {/* Pro Pass */}
          <div className="glow-card rounded-2xl p-6 flex flex-col justify-between border border-indigo-500/20 bg-[#0c1125] min-h-[380px] transition hover:border-white/10 relative shadow-md shadow-indigo-500/5">
            <div className="absolute top-4 right-4 bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase">
              Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Pro Pass</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">For active interview stages</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-black text-white">{hasReferral ? "360" : "300"}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-300 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  {hasReferral ? "360" : "300"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Screen Share Evasion (Zoom/Meet)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Unlimited Concurrent Runs
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Pro Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-xl font-bold text-xs transition hover:brightness-110 active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5"
            >
              {actionLoading === "Pro Pass" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Purchase $39"}
            </button>
          </div>

          {/* Elite Pass */}
          <div className="glow-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 bg-[#0d1326] min-h-[380px] transition hover:border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white">Elite Pass</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Advanced custom contexts</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-black text-white">{hasReferral ? "1200" : "1000"}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-300 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {hasReferral ? "1200" : "1000"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  GPT-4o-mini & Claude Models
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  PDF Resume context parsing
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Elite Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5"
            >
              {actionLoading === "Elite Pass" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Purchase $79"}
            </button>
          </div>

        </div>

        {/* Dynamic Credit Info */}
        <div className="w-full bg-white/2 border border-white/5 p-4 rounded-xl flex items-start gap-3 mt-2 font-medium">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Credit Consumption Info:</strong> Real-time interview Copilot usage consumes **1 credit per minute** with a **minimum charge of 10 credits** per interview. AI evaluation report generation consumes **5 credits per analysis**.
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SelectPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0D19] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>
    }>
      <SelectPlanContent />
    </Suspense>
  );
}
