"use client";

import { useRouter } from "next/navigation";
import {
  Shield,
  Check,
  Sparkles,
  Home,
  Globe,
  Share2,
  Gift,
  User,
  ArrowRight,
  UserPlus,
} from "lucide-react";


export default function PricingPage() {
  const router = useRouter();

  // Handle plan purchase selection by routing to secure auth-protected /select-plan
  function handlePlanSelect(planName: string) {
    router.push(`/select-plan?plan=${encodeURIComponent(planName)}`);
  }

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">
      
      {/* Background Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0DCAF0]/10 bg-blur-glow"></div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <a href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <img src="/logo-horizontal-dark.svg" className="h-16 w-auto select-none" alt="Logo" />
        </a>
        <div className="flex items-center gap-6 font-semibold">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </a>
          <a href="/features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
          <a href="/demo" className="text-sm text-slate-400 hover:text-white transition">Demo Simulator</a>
          <a href="/copilot" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
            <Globe className="w-4 h-4" /> Web Copilot
          </a>
          
          <a
            href="/login"
            className="bg-sky-500 hover:bg-sky-600 border border-sky-400/20 px-4 py-1.5 rounded-full text-xs font-black transition active:scale-95 cursor-pointer uppercase tracking-wider text-white"
          >
            <User className="w-3.5 h-3.5 inline mr-1" />
            Sign In
          </a>
        </div>
      </header>

      {/* Page Title */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-[#6610F2]/10 border border-[#6610F2]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#0DCAF0]" />
          Instant Billing Activation & Client Keys
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Flexible Plans for <span className="text-gradient">Unlimited Access</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
          Authenticate your account and subscribe to a premium plan to obtain full access. No free trials.
        </p>
      </section>

      {/* Stateless checkout redirects */}

      {/* Pricing Cards Section */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between border-white/10 bg-[#0c1125] min-h-[420px]">
            <div>
              <h3 className="text-xl font-bold text-white">Starter Pass</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">For beginners practicing code challenges</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-white/5 pt-6 mt-6">
                <li className="flex items-center gap-2 font-bold text-sky-300">
                  <Check className="w-4 h-4 text-sky-400" />
                  100 Fuel Credits included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Streaming STT voice capturing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Standard low-latency audio capture
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  LLaMA-3.1 model support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handlePlanSelect("Starter Pass")}
                className="w-full py-3.5 bg-slate-800 border border-slate-700 hover:bg-slate-750 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer tracking-wider uppercase text-white"
              >
                Upgrade to Starter
              </button>
            </div>
          </div>

          {/* Pro Pass Card */}
          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between border-white/10 bg-[#0c1125] relative min-h-[420px] border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <div className="absolute top-4 right-4 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
              Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pro Pass</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Ideal for active interview stages</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-white">$39</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-white/5 pt-6 mt-6">
                <li className="flex items-center gap-2 font-bold text-sky-300">
                  <Check className="w-4 h-4 text-sky-400" />
                  300 Fuel Credits included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Sub-second latency streaming STT
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Screen sharing evasion (Zoom & Meet)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Unlimited concurrent LLM runs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Standard Groq & xAI keys support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handlePlanSelect("Pro Pass")}
                className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl font-bold text-xs transition hover:brightness-110 active:scale-95 cursor-pointer tracking-wider uppercase text-white shadow-md shadow-indigo-500/10"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Elite Pass Card */}
          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between border-white/10 bg-[#0d1326] min-h-[420px]">
            <div>
              <h3 className="text-xl font-bold text-white">Elite Pass</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Advanced custom context models</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-white">$79</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-white/5 pt-6 mt-6">
                <li className="flex items-center gap-2 font-bold text-indigo-300">
                  <Check className="w-4 h-4 text-indigo-400" />
                  1000 Fuel Credits included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  All Pro features included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  Highest accuracy GPT-4o-mini & Claude
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  PDF & DOCX Resume parsing extraction
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  Priority routing API proxy pipelines
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handlePlanSelect("Elite Pass")}
                className="w-full py-3.5 bg-slate-800 border border-slate-700 hover:bg-slate-750 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer tracking-wider uppercase text-white"
              >
                Upgrade to Elite
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Referral Program Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20 select-none" id="referrals-section">
        <div className="glow-card rounded-3xl p-6 md:p-8 bg-[#0c1125] border border-white/5 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400 animate-bounce" />
              Referral Rewards Program
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Share CrackTheLoop with friends and colleagues — both of you earn bonus credits when they subscribe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Referred user benefits */}
            <div className="bg-[#0a0e1c] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest">You're Invited</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When you sign up using a friend's referral link, you get <span className="text-sky-400 font-bold">+20% bonus credits</span> on any plan you choose.
              </p>
              <div className="flex flex-col gap-2 text-[10px] font-bold">
                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1.5">
                  <span>Starter Pass (referred)</span><span className="text-sky-300">120 credits</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1.5">
                  <span>Pro Pass (referred)</span><span className="text-sky-300">360 credits</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Elite Pass (referred)</span><span className="text-sky-300">1,200 credits</span>
                </div>
              </div>
            </div>

            {/* Referrer benefits */}
            <div className="bg-[#0a0e1c] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest">You Referred Someone</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Every time a friend you referred subscribes to a paid plan, you automatically earn <span className="text-purple-400 font-bold">+50% of their plan's base credits</span>.
              </p>
              <div className="flex flex-col gap-2 text-[10px] font-bold">
                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1.5">
                  <span>Friend buys Starter</span><span className="text-purple-300">+50 credits to you</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1.5">
                  <span>Friend buys Pro</span><span className="text-purple-300">+150 credits to you</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Friend buys Elite</span><span className="text-purple-300">+500 credits to you</span>
                </div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-purple-500/10 to-sky-500/10 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-black text-white">Get your personal referral link</p>
              <p className="text-[11px] text-slate-400">Sign in to your dashboard to access and share your unique invite code.</p>
            </div>
            <a
              href="/login"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-bold text-xs text-white uppercase tracking-wider transition hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
            >
              <ArrowRight className="w-4 h-4" /> Get My Link
            </a>
          </div>
        </div>
      </section>

      {/* Stateless plan selection modal removed */}

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 pt-24 text-center text-xs text-slate-550 relative z-20 border-t border-white/5 mt-16 flex justify-between items-center select-none">
        <span>© 2026 CrackTheLoop. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-500/80 font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Win32 Stealth Affinity Shield Enabled
        </span>
      </footer>

    </div>
  );
}
