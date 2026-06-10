"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Check,
  Sparkles,
  Share2,
  Gift,
  ArrowRight,
  UserPlus,
  Loader2,
  X,
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import CtaFooter from "../components/landing/CtaFooter";
import Link from "next/link";
 
export default function PricingPage() {
  const router = useRouter();
  
  const fallbackPlans = [
    {
      name: "Free Trial",
      price: 0,
      interval: "one-time",
      credits: 50,
      description: "Try it free — no card needed",
      features: [
        "50 AI Fuel Credits included",
        "Limit: 1 Interview session",
        "Limit: 1 AI Report analysis",
        "Credits never expire"
      ]
    },
    {
      name: "Starter Pass",
      price: 4.99,
      interval: "one-time",
      credits: 100,
      description: "For beginners practicing mock interviews",
      features: [
        "100 Fuel Credits included",
        "Streaming STT voice capturing",
        "Standard low-latency audio capture",
        "Advanced AI guidance support"
      ]
    },
    {
      name: "Pro Pass",
      price: 19.99,
      interval: "one-time",
      credits: 500,
      description: "Ideal for active interview stages",
      features: [
        "500 Fuel Credits included",
        "Sub-second latency streaming STT",
        "Screen sharing evasion (Zoom & Meet)",
        "Unlimited concurrent LLM runs",
        "Custom API keys integration support"
      ]
    }
  ];

  const [plans, setPlans] = useState<any[]>(fallbackPlans);
  const [trialCredits, setTrialCredits] = useState(50);
  const [trialExpiryDays, setTrialExpiryDays] = useState(-1);
  const [currency, setCurrency] = useState("USD");
  
  // No billing cycle or yearly waitlist states needed (one-time plans only)

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  useEffect(() => {
    // Detect country location using FreeIPAPI
    fetch("https://freeipapi.com/api/json")
      .then((res) => res.json())
      .then((data) => {
        if (data.countryCode === "IN" || data.country === "India") {
          setCurrency("INR");
        } else {
          runTimezoneFallback();
        }
      })
      .catch((err) => {
        console.warn("FreeIPAPI failed, running fallback timezone detection:", err);
        runTimezoneFallback();
      });

    function runTimezoneFallback() {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isIndiaTz = tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
        const isIndiaLocale = navigator.language?.includes("IN") || navigator.languages?.some(l => l.includes("IN"));
        
        if (isIndiaTz || isIndiaLocale) {
          setCurrency("INR");
        } else {
          setCurrency("USD");
        }
      } catch (e) {
        setCurrency("USD");
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.plans && data.plans.length > 0) setPlans(data.plans);
          if (data.settings) {
            setTrialCredits(data.settings.trial_base_credits ?? 50);
            setTrialExpiryDays(data.settings.trial_expiry_days ?? data.settings.trial_expiration_days ?? -1);
          }
        }
      })
      .catch((err) => console.error("Error loading plans:", err));
  }, []);

  // Helper to extract plan data dynamically with fallback support
  const getPlanData = (tier: string, defaultPrice: number, defaultCredits: number, defaultFeatures: string[], defaultDesc: string) => {
    const matched = plans.find(
      (p) =>
        p.name.toLowerCase().includes(tier) ||
        (p.description && p.description.toLowerCase().includes(tier))
    );
    return {
      price: matched ? matched.price : defaultPrice,
      credits: matched ? matched.credits : defaultCredits,
      features: matched && matched.features?.length > 0 ? matched.features : defaultFeatures,
      description: matched ? matched.description : defaultDesc,
    };
  };

  // Handle plan purchase selection by routing to secure auth-protected /select-plan
  function handlePlanSelect(planName: string) {
    router.push(`/select-plan?plan=${encodeURIComponent(planName)}&currency=${currency}`);
  }

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col pt-30">

      {/* Background orbs */}
      <div className="orb orb-peach w-[600px] h-[600px] -top-40 left-1/4 animate-float-orb opacity-40 pointer-events-none" />
      <div className="orb orb-slate w-[400px] h-[400px] bottom-0 -right-20 animate-float-orb-slow opacity-40 pointer-events-none" />

      {/* Global Navigation Header */}
      <Navbar />

      {/* Page Title */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
          One-Time Passes for <span className="text-gradient-coral">Unlimited Confidence</span>
        </h1>
        <p className="text-(--text-muted) text-sm md:text-base max-w-xl leading-relaxed">
          Start your free trial in seconds. Buy a one-time pass to load fuel credits — credits never expire and activate instantly.
        </p>
      </section>

      {/* Pricing Cards Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 relative z-20">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${plans.length} gap-8 items-stretch max-w-5xl mx-auto`}>
          {plans.map((plan) => {
            const isPro = plan.name.toLowerCase().includes("pro");
            const isFree = plan.price === 0 || plan.name.toLowerCase().includes("free");
            
            // Localized price mappings
            let displayPrice = plan.price;
            let priceSymbol = "$";
            
            if (currency === "INR") {
              priceSymbol = "₹";
              if (!isFree) {
                if (plan.name.toLowerCase().includes("starter")) {
                  displayPrice = 399;
                } else if (plan.name.toLowerCase().includes("pro")) {
                  displayPrice = 1499;
                } else {
                  // Fallback conversion (approx 85 INR per USD)
                  displayPrice = Math.round(plan.price * 85);
                }
              } else {
                displayPrice = 0;
              }
            }

            // Override description to remove internal backend leaked terminology
            const planDesc = isFree ? "Try it free — no card needed" : plan.description;
            
            return (
              <div 
                key={plan._id || plan.name}
                className={`backdrop-blur-md rounded-[12px] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 min-h-[420px] relative ${
                  isPro 
                    ? "bg-white/95 border-2 border-(--accent) shadow-md z-10 hover:-translate-y-1 hover:shadow-lg" 
                    : "bg-white/85 border border-(--border-light) shadow-xs hover:border-(--accent)/40 hover:-translate-y-1 hover:shadow-sm"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-(--accent) text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
                    Popular
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
                      {plan.name}
                    </h3>
                    {isFree && (
                      <span className="bg-(--accent-soft) text-(--accent) border border-(--accent)/15 px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider">
                        Free
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-(--text-muted) mt-1 font-medium leading-relaxed">
                    {planDesc}
                  </p>
                         <div className="flex items-baseline gap-1 mt-6">
                    <span className="text-4xl font-extrabold text-slate-800">{priceSymbol}{displayPrice}</span>
                    <span className="text-xs text-(--text-muted) font-semibold">
                      {isFree 
                        ? (trialExpiryDays > 0 ? `/ ${trialExpiryDays} days` : '/ one-time') 
                        : `/ ${plan.interval || 'one-time'}`
                      }
                    </span>
                  </div>
                  
                  <ul className="text-xs text-slate-655 flex flex-col gap-3.5 border-t border-slate-100 pt-6 mt-6">
                    {plan.features?.map((feat: string, idx: number) => {
                      const isFirst = idx === 0;
                      return (
                        <li key={idx} className={`flex items-center gap-2 ${isFirst ? "font-bold text-(--accent)" : ""}`}>
                          <Check className={`w-4 h-4 ${isFirst || isPro ? "text-(--accent)" : "text-slate-400"}`} />
                          {feat}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full text-center justify-center cursor-pointer !py-3.5 !px-6 !text-xs uppercase tracking-wider ${
                      isPro 
                        ? "btn-primary shadow-md shadow-[#E8503A]/20" 
                        : "btn-ghost-dark !font-bold"
                    }`}
                  >
                    {isFree ? "Start Trial" : `Upgrade to ${plan.name.replace(" Pass", "").replace(" Plan", "")}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-20 pb-8 relative z-20 select-none" id="referrals-section">
        <div className="bg-white/85 backdrop-blur-md border border-(--border-light) rounded-[12px] p-6 md:p-8 flex flex-col gap-6 shadow-xs">
          <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <Gift className="w-5 h-5 text-(--accent) animate-bounce" />
              Referral Rewards Program
            </h2>
             <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl font-semibold">
              Share CrackTheLoop with friends and colleagues - both of you get 50 free credits upon signup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Invited Guest benefits */}
            <div className="bg-slate-50/65 border border-slate-200/80 rounded-[12px] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-(--accent-soft) flex items-center justify-center border border-(--accent)/15">
                  <UserPlus className="w-4 h-4 text-(--accent)" />
                </div>
                <span className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest">You're Invited</span>
              </div>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold">
                When you sign up using a friend's referral link, you get <span className="text-(--accent) font-bold">50 free credits</span> instantly on sign-up to start practicing mock interviews.
              </p>
            </div>

            {/* Referrer benefits */}
            <div className="bg-slate-50/65 border border-slate-200/80 rounded-[12px] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-(--accent-soft) flex items-center justify-center border border-(--accent)/15">
                  <Gift className="w-4 h-4 text-(--accent)" />
                </div>
                <span className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest">You Referred Someone</span>
              </div>
              <p className="text-sm md:text-base text-slate-650 leading-relaxed font-semibold">
                When a referred friend signs up and activates their trial, <span className="text-(--accent) font-bold">both of you get 50 free credits</span> instantly.
              </p>
            </div>

          </div>

          {/* Get Invite Link CTA */}
          <div className="flex flex-col items-center gap-2 border-t border-slate-100 pt-6 mt-2">
            <button
              onClick={() => {
                const token = getCookie("ctl_token");
                if (token) {
                  router.push("/dashboard/referrals");
                } else {
                  router.push("/login?mode=signup&redirect=/dashboard/referrals");
                }
              }}
              className="btn-primary flex items-center gap-2 !py-3.5 !px-6 !text-xs uppercase tracking-wider cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Get My Invite Link</span>
            </button>
            <span className="text-[10px] text-slate-400 font-semibold italic">
              *Sign in or create a free account to access your personal referral link.
            </span>
          </div>

        </div>
      </section>

      {/* Global CTA Footer */}
      <CtaFooter />

    </div>
  );
}
