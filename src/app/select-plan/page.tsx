"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldAlert, Lock } from "lucide-react";
import Link from "next/link";

function SelectPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusText, setStatusText] = useState("Redirecting you to the secure checkout...");

  const priceIds: Record<string, string> = {
    "Starter Pass": "price_1TeCnyEkHwm1l3fZV45CSLvV",
    "Pro Pass": "price_1TeCpEEkHwm1l3fZej0zzJhb",
    "Elite Pass": "price_1TeCpaEkHwm1l3fZj9f7Gh31"
  };

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  useEffect(() => {
    const plan = searchParams.get("plan");

    // If no plan, or it's a Free Trial, redirect to dashboard directly
    if (!plan || plan === "Free Trial") {
      window.location.replace("/dashboard");
      return;
    }

    const priceId = priceIds[plan];
    if (!priceId) {
      setErrorMsg(`Invalid plan selected: "${plan}". Please return to the pricing page.`);
      setLoading(false);
      return;
    }

    // Check auth status
    const token = getCookie("ctl_token");
    const userStr = getCookie("ctl_user");

    if (!token || !userStr) {
      // Not logged in -> Redirect to login page and preserve plan selection
      window.location.replace(`/login?mode=signup&plan=${encodeURIComponent(plan)}`);
      return;
    }

    let userEmail = "";
    try {
      const userObj = JSON.parse(userStr);
      userEmail = userObj?.email || "";
    } catch (e) {
      // Ignore
    }

    if (!userEmail) {
      setErrorMsg("Failed to parse user details. Please sign in again.");
      setLoading(false);
      return;
    }

    // Call checkout API directly
    async function triggerCheckout() {
      setStatusText(`Preparing your secure checkout session for ${plan}...`);
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, email: userEmail }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || "Failed to create checkout session");
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL returned from billing gateway");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred while connecting to Stripe.");
        setLoading(false);
      }
    }

    triggerCheckout();
  }, [searchParams]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-(--bg-mist) flex flex-col justify-center items-center py-12 px-6">
        <div className="w-full max-w-md bg-white border border-(--border-light) rounded-[12px] p-6 shadow-md flex flex-col gap-5 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-slate-800">Checkout Error</h2>
            <p className="text-xs text-(--text-muted) leading-relaxed">{errorMsg}</p>
          </div>
          <Link
            href="/pricing"
            className="btn-primary w-full text-center justify-center cursor-pointer !py-3 !px-6 !text-xs uppercase tracking-wider"
          >
            Return to Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-mist) flex flex-col justify-center items-center relative overflow-hidden py-12 px-6">
      {/* Background orbs */}
      <div className="orb orb-peach w-[500px] h-[500px] -top-20 -left-20 animate-float-orb opacity-40 pointer-events-none" />
      <div className="orb orb-slate w-[400px] h-[400px] -bottom-20 -right-20 animate-float-orb-slow opacity-40 pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-(--border-light) rounded-[12px] p-8 shadow-md flex flex-col gap-6 items-center text-center relative z-10">
        <div className="flex items-center gap-2 select-none mb-2">
          <img src="/logo-horizontal-light.svg" className="h-7 w-auto object-contain" alt="Logo" onError={(e) => {
            e.currentTarget.src = "/logo.png";
          }} />
        </div>

        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-(--accent-soft) border border-(--accent)/15 shadow-sm">
          <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Connecting to Billing Gateway</h2>
          <p className="text-xs text-(--text-muted) leading-relaxed max-w-xs">{statusText}</p>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-widest mt-2">
          <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure SSL Stripe Gateway
        </div>
      </div>
    </div>
  );
}

export default function SelectPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-(--bg-mist) flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-(--accent) animate-spin" />
      </div>
    }>
      <SelectPlanContent />
    </Suspense>
  );
}
