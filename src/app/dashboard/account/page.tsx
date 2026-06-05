"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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

  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
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

    async function refreshProfile() {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          localStorage.setItem("ctl_user", JSON.stringify(data.user));
          document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    }

    refreshProfile();
  }, [router]);

  // Load referral data once token is set
  useEffect(() => {
    if (!token) return;
    async function loadReferrals() {
      setReferralLoading(true);
      try {
        const res = await fetch("/api/referrals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReferralData(data);
        }
      } catch (err) {
        console.error("Failed to load referral data", err);
      } finally {
        setReferralLoading(false);
      }
    }
    loadReferrals();
  }, [token]);

  function handleDismissCelebration() {
    setShowCelebration(false);
    router.replace("/dashboard/account");
  }

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

  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 py-8 md:py-10 flex flex-col gap-8 relative">
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
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details */}
        <div className="bg-white border border-(--border-light) rounded-[12px] p-6 flex flex-col justify-between min-h-[170px] shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              Account Security
            </span>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mt-2">
              <UserIcon className="w-5 h-5 text-(--accent)" />
              {user?.email}
            </h3>
          </div>
          <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            OTP Verification Authenticated
          </div>
        </div>

        {/* Subscription Tier */}
        <div className="bg-white border border-(--border-light) rounded-[12px] p-6 flex flex-col justify-between min-h-[170px] shadow-sm transition hover:shadow-md">
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
        <div className="bg-white border border-(--border-light) rounded-[12px] p-6 flex flex-col justify-between min-h-[170px] shadow-sm transition hover:shadow-md">
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

      {/* ——— REFERRAL HUB ——— */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2.5 select-none">
          <Gift className="w-5 h-5 text-purple-500" />
          <h2 className="text-base font-black text-slate-800 uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
            Referral Hub
          </h2>
          <span className="text-[9px] text-purple-600 bg-purple-50 border border-purple-200/50 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
            Earn up to 500 bonus credits / friend
          </span>
        </div>

        {referralLoading ? (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading referral
            data...
          </div>
        ) : (
          <>
            {/* Referral Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat: Total Referrals */}
              <div className="bg-white border border-(--border-light) rounded-[12px] p-5 flex flex-col gap-2 hover:border-purple-500/20 transition hover:shadow-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Total Signups
                  </span>
                </div>
                <span className="text-3xl font-black text-slate-800">
                  {referralData?.total_referrals ?? 0}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  friends joined via your link
                </span>
              </div>

              {/* Stat: Subscribed Referrals */}
              <div className="bg-white border border-(--border-light) rounded-[12px] p-5 flex flex-col gap-2 hover:border-emerald-500/20 transition hover:shadow-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Converted
                  </span>
                </div>
                <span className="text-3xl font-black text-emerald-600">
                  {referralData?.subscribed_referrals ?? 0}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  referrals became paid subscribers
                </span>
              </div>

              {/* Stat: Bonus Credits Earned */}
              <div className="bg-white border border-(--border-light) rounded-[12px] p-5 flex flex-col gap-2 hover:border-sky-500/20 transition hover:shadow-xs">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Bonus Credits
                  </span>
                </div>
                <span className="text-3xl font-black text-amber-500">
                  +{referralData?.bonus_credits_earned ?? 0}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  earned from successful referrals
                </span>
              </div>
            </div>

            {/* Referral Code + Share Link */}
            <div className="bg-white border border-(--border-light) rounded-[12px] p-6 flex flex-col gap-5 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Referral Code Box */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-purple-500" /> Your
                    Referral Code
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <span className="flex-1 font-mono text-sm font-bold text-purple-700 tracking-widest">
                      {referralData?.referral_code || user?.referral_code || "—"}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          referralData?.referral_code ||
                            user?.referral_code ||
                            "",
                          "code"
                        )
                      }
                      title="Copy code"
                      className="text-slate-400 hover:text-purple-600 transition cursor-pointer"
                    >
                      {copiedCode ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Referral Link Box */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-sky-500" /> Shareable
                    Invite Link
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <span className="flex-1 text-xs text-slate-700 truncate font-mono font-semibold">
                      {referralData?.referral_link
                        ? referralData.referral_link.replace(/^https?:\/\//, "")
                        : "—"}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          referralData?.referral_link || "",
                          "link"
                        )
                      }
                      title="Copy link"
                      className="text-slate-400 hover:text-sky-600 transition cursor-pointer flex-shrink-0"
                    >
                      {copiedLink ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
                <p className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> How
                  Referrals Work
                </p>
                Share your unique invite link with friends. When they sign up using your link, they receive a <span className="text-sky-600 font-bold">+20% credit bonus</span>.
                Once they activate their trial, you instantly get <span className="text-purple-600 font-bold">+8 bonus credits</span>. When they subscribe to a paid plan, you automatically earn <span className="text-amber-600 font-bold">+50% of their plan's base credits</span> (+50 for Starter, +150 for Pro, +500 for Elite).
              </div>
            </div>

            {/* Referred Users List */}
            {referralData && referralData.referred_users.length > 0 && (
              <div className="bg-white border border-(--border-light) rounded-[12px] p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 select-none">
                  <Users className="w-3.5 h-3.5 text-purple-500" /> People You
                  Referred ({referralData.total_referrals})
                </h3>
                <div className="flex flex-col divide-y divide-slate-100">
                  {referralData.referred_users.map((ru, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-[10px] font-black text-purple-700">
                          {(ru.name || ru.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">
                            {ru.name || ru.email.split("@")[0]}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {ru.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            ru.is_subscribed
                              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                              : "text-slate-500 bg-slate-50 border-slate-200"
                          }`}
                        >
                          {ru.is_subscribed
                            ? normalizeTier(ru.subscription_tier)
                            : "Free"}
                        </span>
                        {ru.bonus_earned !== undefined && ru.bonus_earned > 0 && (
                          <span className="text-[9px] text-amber-600 font-bold flex items-center gap-0.5">
                            +{ru.bonus_earned}
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state when no referrals */}
            {referralData && referralData.total_referrals === 0 && (
              <div className="bg-white border border-(--border-light) rounded-[12px] p-8 flex flex-col items-center gap-3 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-sm font-black text-slate-800">
                  No referrals yet
                </p>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                  Share your invite link above with developers and earn up to 500 bonus credits for every friend who subscribes.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Download Stealth Desktop Client Section */}
      <section className="bg-white border border-(--border-light) rounded-[12px] p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2 select-none" style={{ fontFamily: "var(--font-display)" }}>
          <Laptop className="w-5 h-5 text-indigo-500" />
          Download Stealth Desktop Client
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-bold text-slate-800">
              Native Client with Win32 Display Affinity
            </h4>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed font-medium">
              Run the AI Copilot inside a transparent overlay that is completely invisible to Zoom, Teams, Meet, and other screen-sharing tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <a
              href="/downloads/cracktheloop-desktop_0.1.0_x64-setup.exe"
              download
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-800 shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer justify-center flex-1 md:flex-none text-center"
            >
              Download for Windows (.exe)
            </a>
            <a
              href="/downloads/cracktheloop-desktop_0.1.0_aarch64.dmg"
              download
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-800 shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer justify-center flex-1 md:flex-none text-center"
            >
              Download for macOS (.dmg)
            </a>
          </div>
        </div>
      </section>

      {/* Main Billing Actions Box */}
      <section className="bg-white border border-(--border-light) rounded-[12px] p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2 select-none" style={{ fontFamily: "var(--font-display)" }}>
          <CreditCard className="w-5 h-5 text-sky-500" />
          Billing Operations Console
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-bold text-slate-800">
              Stripe Customer Billing Portal
            </h4>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed font-medium">
              We leverage Stripe for all payment transactions. Access the secure
              portal to download official invoices, update credit cards, or
              pause renewals.
            </p>
          </div>

          <Link
            href="/pricing"
            className="px-5 py-3 bg-[#E8503A] hover:bg-[#F06B57] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-[#E8503A]/10 hover:shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer w-full md:w-auto text-center justify-center"
          >
            Upgrade Hub <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Celebratory Success Modal Dialog */}
      {showCelebration && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[100] p-6 animate-fade-in">
          <div className="w-full max-w-[420px] bg-white border border-(--border-light) rounded-[12px] p-8 flex flex-col items-center text-center shadow-xl relative">
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

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full flex justify-around my-6">
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
              className="w-full py-3 bg-[#E8503A] hover:bg-[#F06B57] rounded-xl font-bold text-xs text-white uppercase tracking-wider transition active:scale-95 shadow-md flex justify-center items-center gap-1.5 cursor-pointer shadow-[#E8503A]/10"
            >
              <Zap className="w-4 h-4 text-white fill-white/20 animate-bounce" />
              Awesome, Let's Go!
            </button>
          </div>
        </div>
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
