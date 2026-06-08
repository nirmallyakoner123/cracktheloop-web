"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Sparkles,
  Loader2,
  Gift,
  Copy,
  Check,
  Users,
  Star,
  Link2,
  TrendingUp
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

function ReferralsHubContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5 md:py-6 flex flex-col gap-6 relative select-none">
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-(--accent)/3 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/3 blur-[120px]"></div>
      </div>

      {/* Top Title */}
      <section className="flex flex-col gap-2">
        <span className="text-[10px] text-(--accent) font-black uppercase tracking-widest">
          Referral Command Center
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          Earn Bonus Fuel Credits
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Invite your friends, expand your network, and load up your Stealth Copilot HUD with extra replies.
        </p>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {/* Total Signups */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col gap-2 hover:border-purple-500/20 transition hover:shadow-md duration-300">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Total Signups
            </span>
          </div>
          <span className="text-4xl font-black text-slate-800 mt-2">
            {referralData?.total_referrals ?? 0}
          </span>
          <span className="text-[11px] text-slate-500 font-bold mt-1">
            friends joined via your link
          </span>
        </div>

        {/* Paid Converted */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col gap-2 hover:border-emerald-500/20 transition hover:shadow-md duration-300">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Subscribed Referrals
            </span>
          </div>
          <span className="text-4xl font-black text-emerald-600 mt-2">
            {referralData?.subscribed_referrals ?? 0}
          </span>
          <span className="text-[11px] text-slate-500 font-bold mt-1">
            friends became active subscribers
          </span>
        </div>

        {/* Bonus Credits Earned */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col gap-2 hover:border-amber-500/20 transition hover:shadow-md duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Bonus Fuel Credits
            </span>
          </div>
          <span className="text-4xl font-black text-amber-500 mt-2">
            +{referralData?.bonus_credits_earned ?? 0}
          </span>
          <span className="text-[11px] text-slate-500 font-bold mt-1">
            credits loaded to your dashboard
          </span>
        </div>
      </section>

      {/* Copy boxes and explanation */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10 items-start">
        {/* Share and Link Copy cards */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 flex flex-col gap-5 shadow-sm">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Gift className="w-5 h-5 text-purple-600" />
            Your Invitation Badges
          </h2>

          {referralLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Referral Code Box */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5 select-none">
                    Referral Code
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                    <span className="flex-1 font-mono text-sm font-bold text-purple-700 tracking-widest select-all">
                      {referralData?.referral_code || user?.referral_code || "-"}
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
                      className="text-slate-400 hover:text-purple-650 transition cursor-pointer"
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
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5 select-none">
                    Shareable Invite Link
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                    <span className="flex-1 text-xs text-slate-700 truncate font-mono font-semibold select-all">
                      {referralData?.referral_link
                        ? referralData.referral_link.replace(/^https?:\/\//, "")
                        : "-"}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          referralData?.referral_link || "",
                          "link"
                        )
                      }
                      title="Copy link"
                      className="text-slate-400 hover:text-sky-650 transition cursor-pointer flex-shrink-0"
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
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 text-xs text-slate-500 leading-relaxed mt-2">
                <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-3 flex items-center gap-1.5 select-none">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  Referral Rules & Conversions
                </h4>
                <p className="font-semibold mb-2 text-slate-650">
                  Share your unique invite link with friends. When they sign up using your link:
                </p>
                <ul className="list-disc pl-4 flex flex-col gap-1.5 font-medium">
                  <li>They instantly get a <span className="text-sky-600 font-bold">+20% credit bonus</span> on any package they select.</li>
                  <li>Once they sign up and start a trial, you get <span className="text-purple-600 font-bold">+8 bonus credits</span>.</li>
                  <li>When they purchase any paid subscription plan, you automatically get a credit payload equal to <span className="text-emerald-600 font-bold">50% of their base credits</span> (+50 for Starter, +150 for Pro, +500 for Elite).</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* How it works sidebar / metadata */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3" style={{ fontFamily: "var(--font-display)" }}>
            Stealth Evasion Specs
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            All referral link clicks and signups are processed via our stealth redirect filters. Referrer IDs are securely hashed to prevent conference tool detection.
          </p>
          <div className="bg-emerald-50 border border-emerald-100/50 rounded-lg p-3 text-[11px] text-emerald-700 font-semibold leading-relaxed flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>
              Referring accounts are entirely decoupled from billing identities to ensure strict screen confidentiality.
            </span>
          </div>
        </div>
      </section>

      {/* Referred Users List Table */}
      {referralData && referralData.referred_users.length > 0 && (
        <section className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 flex flex-col gap-5 shadow-sm relative z-10">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Users className="w-5 h-5 text-purple-600" />
            Referred Developers List
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-5">Developer Email</th>
                  <th className="py-4 px-5">Date Joined</th>
                  <th className="py-4 px-5">Subscription Status</th>
                  <th className="py-4 px-5 text-right">Credits Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 font-semibold text-slate-600">
                {referralData.referred_users.map((ru, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-[10px] font-black text-purple-700">
                        {(ru.name || ru.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">
                          {ru.name || ru.email.split("@")[0]}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ru.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-500">
                      {new Date(ru.joined_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${ru.is_subscribed
                            ? "text-emerald-600 bg-emerald-50 border-emerald-200/80"
                            : "text-slate-500 bg-slate-50 border-slate-200"
                          }`}
                      >
                        {ru.is_subscribed
                          ? normalizeTier(ru.subscription_tier)
                          : "Free Trial"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-black text-amber-500">
                      {ru.bonus_earned !== undefined && ru.bonus_earned > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          +{ru.bonus_earned} <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}



    </main>
  );
}

export default function ReferralsHubPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex justify-center items-center py-20 bg-(--bg-mist)">
          <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
        </div>
      }
    >
      <ReferralsHubContent />
    </Suspense>
  );
}
