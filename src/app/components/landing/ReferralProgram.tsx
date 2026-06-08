"use client";

import { Gift, Share2, UserPlus, ArrowRight, Sparkles, Check } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import Link from "next/link";

export default function ReferralProgram() {
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
      title: "Friend Joins & Subscribes",
      desc: "They sign up and purchase any paid pass - and instantly receive +20% bonus credits."
    },
    {
      id: 3,
      icon: Gift,
      title: "Get Rewarded",
      desc: "You instantly receive +50% of their plan's base credits. Share more, earn more!"
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
              Invite your network to CrackTheLoop. Our two-sided referral program rewards both of you the moment they subscribe to any plan.
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
                    <h3 className="text-base font-bold text-(--text-primary) leading-tight" style={{ fontFamily: "var(--font-display)" }}>Your Friend Receives</h3>
                  </div>
                </div>

                <p className="text-xs text-(--text-muted) leading-relaxed mb-6 font-medium">
                  When someone registers using your invitation link, they get an automatic <span className="text-(--accent) font-bold">+20% bonus credits</span> on their initial purchase.
                </p>

                <div className="space-y-3 font-medium">
                  <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-100">
                    <span className="text-(--text-secondary)">Starter Pass (usually 100)</span>
                    <span className="text-(--accent) font-extrabold flex items-center gap-1">
                      120 credits <span className="text-[10px] text-(--accent)/70 font-normal">(+20)</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-100">
                    <span className="text-(--text-secondary)">Pro Pass (usually 300)</span>
                    <span className="text-(--accent) font-extrabold flex items-center gap-1">
                      360 credits <span className="text-[10px] text-(--accent)/70 font-normal">(+60)</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-2.5">
                    <span className="text-(--text-secondary)">Elite Pass (usually 1000)</span>
                    <span className="text-(--accent) font-extrabold flex items-center gap-1">
                      1,200 credits <span className="text-[10px] text-(--accent)/70 font-normal">(+200)</span>
                    </span>
                  </div>
                </div>
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
                    <h3 className="text-base font-bold text-(--text-primary) leading-tight" style={{ fontFamily: "var(--font-display)" }}>You Earn Instantly</h3>
                  </div>
                </div>

                <p className="text-xs text-(--text-muted) leading-relaxed mb-6 font-medium">
                  Every single time a referred colleague upgrades to a paid pass, you receive a massive <span className="text-(--accent) font-bold">+50% of their plan's credits</span>.
                </p>

                <div className="space-y-3 font-medium">
                  <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-100">
                    <span className="text-(--text-secondary)">Friend subscribes to Starter</span>
                    <span className="text-(--accent) font-extrabold flex items-center gap-1">
                      +50 credits <span className="text-[10px] text-(--accent)/70 font-normal">(worth $10)</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-100">
                    <span className="text-(--text-secondary)">Friend subscribes to Pro</span>
                    <span className="text-(--accent) font-extrabold flex items-center gap-1">
                      +150 credits <span className="text-[10px] text-(--accent)/70 font-normal">(worth $20)</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-2.5">
                    <span className="text-(--text-secondary)">Friend subscribes to Elite</span>
                    <span className="text-(--accent) font-extrabold flex items-center gap-1">
                      +500 credits <span className="text-[10px] text-(--accent)/70 font-normal">(worth $40)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* 3 Step Visual Flow */}
        <ScrollReveal>
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-white/70 backdrop-blur-md border border-(--border-light) rounded-[12px] p-5 md:p-6 shadow-xs">
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
                      <h4 className="text-sm font-bold text-(--text-primary) mb-2">{step.title}</h4>
                      <p className="text-xs text-(--text-muted) leading-relaxed max-w-[240px] font-medium">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Call to Action Bar */}
        <ScrollReveal>
          <div className="bg-white/80 backdrop-blur-md border border-(--border-light) rounded-[12px] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto shadow-xs">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <h3 className="text-base font-bold text-(--text-primary) flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Sparkles className="w-4 h-4 text-(--accent) animate-pulse" />
                Start Inviting Candidates Today
              </h3>
              <p className="text-xs text-(--text-muted) leading-relaxed font-medium">
                Every successful referral adds free interview credits directly to your active loop profile.
              </p>
            </div>

            <Link
              href="/login?redirect=/dashboard/referrals"
              className="btn-primary w-full md:w-auto text-center justify-center cursor-pointer !text-xs uppercase tracking-wider !py-3.5 !px-6"
            >
              Get My Invite Link <ArrowRight className="w-4 h-4 ml-1.5 inline-block" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
