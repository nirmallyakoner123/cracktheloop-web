"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Shield,
  Sparkles,
  CreditCard,
  Award,
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
  Star,
  Link2,
  TrendingUp,
  Laptop,
} from "lucide-react";
import Link from "next/link";
import { WindowsIcon, AppleIcon } from "@/app/components/icons/BrandIcons";

interface ReferredUser {
  email: string;
  name: string;
  is_subscribed: boolean;
  subscription_tier: string;
  joined_at: string;
  bonus_earned?: number;
}

interface ReferralData {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  subscribed_referrals: number;
  bonus_credits_earned: number;
  bonus_per_referral?: number;
  referred_users: ReferredUser[];
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

function AccountDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(checkoutSuccess);

  const [mounted, setMounted] = useState(false);

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

    async function refreshProfile() {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setCookie("ctl_user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    }

    refreshProfile();
  }, [router]);

  function handleDismissCelebration() {
    setShowCelebration(false);
    router.replace("/dashboard/account");
  }

  if (loading && !user) {
    return (
      <div className="flex-1 flex justify-center items-center py-20 bg-(--bg-mist)">
        <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5 md:py-6 flex flex-col gap-6 relative">
      {/* Top Welcome Title */}
      <section className="flex flex-col gap-2 select-none">
        <span className="text-[10px] text-(--accent) font-black uppercase tracking-widest">
          User Dashboard
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8503A] to-indigo-600">
            {user?.email?.split("@")[0]}
          </span>
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your subscription, credits, referrals, and security profile.
        </p>
      </section>

      {/* Account Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Subscription Tier */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between min-h-[150px] shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              Subscription Status
            </span>
            <div className="flex items-center gap-2 mt-2">
              <Award
                className={`w-5 h-5 ${
                  user?.is_subscribed ? "text-emerald-600" : "text-slate-400"
                }`}
              />
              <span
                className={`text-sm font-black uppercase tracking-wider ${
                  user?.is_subscribed ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {user?.is_subscribed ? "Active Subscriber" : "No Active Plan"}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 w-fit px-2.5 py-0.5 rounded border border-slate-200 mt-1.5 uppercase">
              Tier: {normalizeTier(user?.subscription_tier)}
            </span>
          </div>
          <Link
            href="/pricing"
            className="text-[10px] text-(--accent) hover:text-(--accent-bright) font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-1.5 transition-all mt-4 w-fit"
          >
            {user?.is_subscribed ? "Upgrade / Change Plan" : "Purchase Plan"}{" "}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Copilot Fuel (Credits) */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between min-h-[150px] shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              AI Copilot Fuel
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black text-slate-800">
                {user?.credits ?? 0}
              </span>
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
                Credits left
              </span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-500 leading-relaxed font-medium">
            1 credit = 1 real-time AI reply.{" "}
            {user?.credits === 0 && "Purchase a plan to fill fuel."}
          </div>
        </div>
      </section>

      {/* Referral Hub Card Link & Billing Operations side-by-side */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
        {/* Referral Hub Card Link */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2 select-none" style={{ fontFamily: "var(--font-display)" }}>
              <Gift className="w-5 h-5 text-purple-600" />
              Referral Program Hub
            </h2>

            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold text-slate-800">
                Invite Friends & Earn Credits
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Get up to 500 bonus credits when your friends join. They'll also get a +20% bonus credit on plan activations.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/referrals"
            className="mt-5 px-4 py-2.5 bg-purple-600 hover:bg-purple-750 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-600/10 hover:shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer text-center justify-center w-full"
          >
            Open Referral Hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Main Billing Actions Box */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2 select-none" style={{ fontFamily: "var(--font-display)" }}>
              <CreditCard className="w-5 h-5 text-sky-500" />
              Billing Operations Console
            </h2>

            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold text-slate-800">
                Stripe Customer Billing Portal
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                We leverage Stripe for all payment transactions. Access the secure portal to download official invoices, update credit cards, or pause renewals.
              </p>
            </div>
          </div>

          <Link
            href="/pricing"
            className="mt-5 px-4 py-2.5 bg-[#E8503A] hover:bg-[#F06B57] hover:brightness-110 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md shadow-[#E8503A]/10 hover:shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer text-center justify-center w-full"
          >
            Upgrade Hub <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Download Desktop Client & Account Security side-by-side */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
        {/* Download Stealth Desktop Client Section */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2 select-none" style={{ fontFamily: "var(--font-display)" }}>
              <Laptop className="w-5 h-5 text-indigo-500" />
              Download Stealth Desktop Client
            </h2>

            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold text-slate-800">
                Native Client with Win32 Display Affinity
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Run the AI Copilot inside a transparent overlay that is completely invisible to Zoom, Teams, Meet, and other screen-sharing tools.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
            <a
              href="https://github.com/Souravrooj-klizos/cracktheloop-desktop/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-800 shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer justify-center flex-1 text-center"
            >
              <WindowsIcon className="w-4 h-4 text-slate-500 shrink-0" />
              Win Client (.msi / .exe)
            </a>
            <a
              href="https://github.com/Souravrooj-klizos/cracktheloop-desktop/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-800 shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer justify-center flex-1 text-center"
            >
              <AppleIcon className="w-4 h-4 text-slate-500 shrink-0" />
              macOS Client (.dmg)
            </a>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between shadow-sm transition hover:shadow-md min-h-[180px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2 select-none" style={{ fontFamily: "var(--font-display)" }}>
              <UserIcon className="w-5 h-5 text-(--accent)" />
              Account Security
            </h2>

            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                Authorized Credentials
              </span>
              <span className="text-sm font-bold text-slate-800 truncate select-all">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            OTP Verification Authenticated
          </div>
        </div>
      </section>

      {/* Celebratory Success Modal Dialog */}
      {showCelebration && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[100] p-6 animate-fade-in">
          <div className="w-full max-w-[420px] bg-white border border-(--border-light) rounded-xl p-6 flex flex-col items-center text-center shadow-xl relative">
            <button
              onClick={handleDismissCelebration}
              className="text-slate-400 hover:text-slate-700 transition cursor-pointer font-bold absolute top-4 right-4 text-sm"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex justify-center items-center mb-6 relative">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
            </div>

            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              Purchase Successful!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-3">
              Congratulations! Your payment has been confirmed by Stripe. Your
              account credits have been loaded and your subscription tier is now
              active.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 w-full flex justify-around my-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Tier Status
                </span>
                <span className="text-xs font-black text-emerald-600 mt-1 uppercase">
                  Active
                </span>
              </div>
              <div className="w-[1px] bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Credits Loaded
                </span>
                <span className="text-xs font-black text-slate-800 mt-1">
                  {user?.credits ?? "Updated"}
                </span>
              </div>
            </div>

            <button
              onClick={handleDismissCelebration}
              className="w-full py-2.5 bg-[#E8503A] hover:bg-[#F06B57] rounded-lg font-bold text-xs text-white uppercase tracking-wider transition active:scale-95 shadow-md flex justify-center items-center gap-1.5 cursor-pointer shadow-[#E8503A]/10"
            >
              <Zap className="w-4 h-4 text-white fill-white/20 animate-bounce" />
              Awesome, Let's Go!
            </button>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}

export default function AccountDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex justify-center items-center py-20 bg-(--bg-mist)">
          <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
        </div>
      }
    >
      <AccountDetailsContent />
    </Suspense>
  );
}
