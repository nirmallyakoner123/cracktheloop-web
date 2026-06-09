"use client";

import { Shield, Sparkles, UserCheck, Eye, HelpCircle } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const trustPoints = [
  {
    icon: <Shield className="w-5 h-5 text-(--accent)" />,
    title: "Resume Data Stays Private",
    desc: "Your resume, job description, and audio transcripts are processed securely and are never shared, logged, or used for model training.",
  },
  {
    icon: <UserCheck className="w-5 h-5 text-(--accent)" />,
    title: "User-Controlled Sessions",
    desc: "You have complete control. The assistant only processes audio when you explicitly start a session, with no background processes.",
  },
  {
    icon: <Eye className="w-5 h-5 text-(--accent)" />,
    title: "Real-Time Response Guidance",
    desc: "Built to strengthen answer structuring, recall skills, and key talking points during your live interview sessions.",
  },
  {
    icon: <HelpCircle className="w-5 h-5 text-(--accent)" />,
    title: "Responsible Usage Guidelines",
    desc: "Designed to assist candidate communication clarity. Users are responsible for adhering to their employer or hiring team rules.",
  },
];

export default function TrustEthics() {
  return (
    <section id="trust-ethics" className="section-mist relative py-20 md:py-24 overflow-hidden">
      {/* Subtle orbs */}
      <div className="orb orb-slate w-[350px] h-[350px] -top-20 -left-20 animate-float-orb opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary-dark)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built for <span className="text-gradient-coral">Responsible Use</span>
            </h2>
            <p className="text-(--text-muted-dark) text-base mt-3 max-w-2xl mx-auto">
              CrackTheLoop is designed to support communication confidence, preparation structuring, and permitted interview assistance.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
          {trustPoints.map((point, i) => (
            <StaggerItem key={i}>
              <div className="glass-card-light !rounded-[6px] p-5 h-full flex flex-col items-start gap-4 border border-(--border-light) bg-white/70 backdrop-blur-md hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-[6px] bg-white flex items-center justify-center border border-(--border-light) shadow-xs">
                  {point.icon}
                </div>
                <h3 className="text-base font-bold text-(--text-primary-dark)">{point.title}</h3>
                <p className="text-xs text-(--text-muted-dark) leading-relaxed">{point.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
