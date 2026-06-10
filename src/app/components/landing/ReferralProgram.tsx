"use client";

import { Gift, Share2, UserPlus, ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReferralProgram() {
  const router = useRouter();

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  const steps = [
    {
      id: 1,
      icon: Share2,
      title: "Share Your Link",
      desc: "Get your unique invite link from your dashboard and share it with friends, peers, or colleagues."
    },
    {
      id: 2,
      icon: UserPlus,
      title: "Friend Signs Up",
      desc: "They sign up using your link to instantly get 50 free credits and start practicing."
    },
    {
      id: 3,
      icon: Gift,
      title: "Get Rewarded",
      desc: "You instantly receive +50 free credits in your account the moment they join."
    }
  ];

  return (
    <section id="referral-program" className="section-mist relative py-14 md:py-16 overflow-hidden select-none">
      {/* Decorative Orbs */}
      <div className="orb orb-peach w-[500px] h-[500px] -top-20 -left-20 opacity-45 pointer-events-none animate-float-orb" />
      <div className="orb orb-slate w-[400px] h-[400px] -bottom-20 -right-20 opacity-30 pointer-events-none animate-float-orb-slow" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-8 flex flex-col items-center">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary) max-w-3xl leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Spread the Word. <span className="text-gradient-coral">Earn Free Credits</span>.
            </h2>
            <p className="text-(--text-muted) text-base max-w-xl mt-3 leading-relaxed">
              Invite your network to CrackTheLoop. Our two-sided referral program rewards both of you the moment they register.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Side Reward Showdown Cards */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-6">

            {/* Card 1: Your Friend's Reward */}
            <div className="bg-white/85 backdrop-blur-md border border-(--border-light) rounded-[12px] p-6 md:p-8 flex flex-col justify-between shadow-xs hover:border-(--accent)/40 hover:-translate-y-1 hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-(--accent-soft) flex items-center justify-center border border-(--accent)/20">
                    <UserPlus className="w-5 h-5 text-(--accent)" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-wider text-(--accent) uppercase font-mono">Invited Guest</span>
                    <h3 className="text-lg font-bold text-(--text-primary) leading-tight" style={{ fontFamily: "var(--font-display)" }}>Your Friend Receives</h3>
                  </div>
                </div>

                <p className="text-sm md:text-base text-slate-650 leading-relaxed font-semibold">
                  When someone registers using your invitation link, they get <span className="text-(--accent) font-bold">50 free credits</span> instantly on sign-up to start practicing mock interviews.
                </p>
              </div>
            </div>

            {/* Card 2: Your Reward */}
            <div className="bg-white/85 backdrop-blur-md border border-(--border-light) rounded-[12px] p-6 md:p-8 flex flex-col justify-between shadow-xs hover:border-(--accent)/40 hover:-translate-y-1 hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-(--accent-soft) flex items-center justify-center border border-(--accent)/20">
                    <Gift className="w-5 h-5 text-(--accent)" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-wider text-(--accent) uppercase font-mono">Referrer Reward</span>
                    <h3 className="text-lg font-bold text-(--text-primary) leading-tight" style={{ fontFamily: "var(--font-display)" }}>You Earn Instantly</h3>
                  </div>
                </div>

                <p className="text-sm md:text-base text-slate-650 leading-relaxed font-semibold">
                  Every time a referred colleague signs up and activates their trial, you instantly receive <span className="text-(--accent) font-bold">+50 free credits</span> loaded into your account.
                </p>
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* 3 Step Visual Flow */}
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md border border-(--border-light) rounded-[12px] p-6 md:p-8 shadow-xs">
              <h3 className="text-center font-bold text-xs tracking-widest text-(--text-muted) uppercase mb-6 font-mono">
                Three Steps To Unlimited Fuel
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Connector lines (Desktop) */}
                <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-[1px] bg-slate-200 -z-10" />

                {steps.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center text-center px-4 group">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-(--text-primary) relative transition-colors duration-300 group-hover:border-(--accent) group-hover:bg-(--accent-soft)">
                        <StepIcon className="w-5 h-5 text-(--text-secondary) group-hover:text-(--accent) transition-colors" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[10px] font-bold flex items-center justify-center border border-(--border-light) shadow-2xs">
                          {step.id}
                        </span>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-(--text-primary) mb-2">{step.title}</h4>
                      <p className="text-xs md:text-sm text-(--text-muted) leading-relaxed max-w-[240px] font-medium">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Get Invite Link CTA Button */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-2 mt-8">
            <button
              onClick={() => {
                const token = getCookie("ctl_token");
                if (token) {
                  router.push("/dashboard/referrals");
                } else {
                  router.push("/login?mode=signup&redirect=/dashboard/referrals");
                }
              }}
              className="btn-primary-glow flex items-center gap-2 !py-4 !px-8 text-xs font-bold uppercase tracking-wider cursor-pointer rounded-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Get My Invite Link</span>
            </button>
            <span className="text-[10px] text-slate-400 font-bold italic">
              *Sign in or create a free account to access your personal referral link.
            </span>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
