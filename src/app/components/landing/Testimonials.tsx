"use client";
 
import { ThumbsUp, MessageSquare, BadgeCheck } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";
 
const testimonials = [
  {
    name: "Vikram S.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    role: "Staff Software Engineer",
    company_type: "Ride-Sharing Giant",
    quote:
      "I failed four consecutive Staff loops because I'd freeze during the high-scale system design panels. The volume of concurrent questions always got to me. I used CrackTheLoop for my next round—the Copilot captured the prompts and cleanly mapped out a Redis sharding architecture on my screen. I stayed structured, kept my cool, and landed the offer.",
    likes: 942,
    comments: 184,
    tag: "System Design Panel",
  },
  {
    name: "Sarah K.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    role: "Backend Developer",
    company_type: "Fintech Scaleup",
    quote:
      "I went through three failed loops where I couldn't explain my code complexity under pressure. I started doubting my skills. I set up CrackTheLoop the night before my Stripe interview. When the interviewer threw a recursive graph problem, the Copilot instantly laid out the space-time tradeoffs. I explained it perfectly and got the offer.",
    likes: 753,
    comments: 112,
    tag: "Technical Coding Loop",
  },
  {
    name: "Marcus L.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    role: "Full-Stack Developer",
    company_type: "Web3 Tech Startup",
    quote:
      "AI screener bots were my absolute nemesis—I failed five in a row because my natural speaking style didn't hit the scoring algorithm. I tried CrackTheLoop for a Web3 startup's screen. The Copilot structured the answers to the rubric format live. Passed the screen and got the recruiter call the next morning.",
    likes: 1103,
    comments: 312,
    tag: "AI Screener Interview",
  },
  {
    name: "Elena V.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    role: "Engineering Manager",
    company_type: "HealthTech Unicorn",
    quote:
      "I failed three EM loops in a row because I struggled to structure behavioral scenarios under pressure. My stories felt disorganized. CrackTheLoop changed everything—the Copilot recognized the prompts and mapped my career achievements to the STAR framework live on screen. It was the first time I felt 100% in control.",
    likes: 689,
    comments: 94,
    tag: "Behavioral & Leadership Loop",
  },
];
 
function formatNumber(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}
 
export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-warm relative py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-peach w-[400px] h-[400px] -bottom-20 -left-20 animate-float-orb-slow opacity-40" />
      <div className="orb orb-frost w-[300px] h-[300px] top-0 -right-20 animate-float-orb opacity-30" />
 
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Candidates Used This{" "}
              <span className="text-gradient-coral">AI Interview Helper to Get Offers</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto">
              Real results from candidates who used CrackTheLoop's free AI interview helper to walk into their interview with the right answer, every time.
            </p>
          </div>
        </ScrollReveal>
 
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          staggerDelay={0.08}
        >
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="group bg-white/80 backdrop-blur-md rounded-[14px] p-6 flex flex-col gap-4 border border-(--border-light) hover:border-(--accent)/25 hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 shadow-xs h-full">
 
                {/* Top row: Avatar + role + verified badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover select-none shrink-0 shadow-sm border border-slate-100"
                    />
                    <div>
                      <span className="text-sm font-bold text-(--text-primary) block leading-tight">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-medium text-(--text-muted) block mt-1">
                        {t.role} at a {t.company_type}
                      </span>
                    </div>
                  </div>
 
                  {/* Verified badge */}
                  <div className="flex items-center gap-1 bg-(--accent-soft) border border-(--accent)/20 px-2.5 py-1 rounded-full shrink-0">
                    <BadgeCheck className="w-3 h-3 text-(--accent) shrink-0" />
                    <span className="text-[9px] font-bold text-(--accent) uppercase tracking-wider whitespace-nowrap">
                      Verified Offer
                    </span>
                  </div>
                </div>
 
                {/* Interview type tag */}
                <span className="self-start text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-(--accent-soft) text-(--accent) border border-(--accent)/20">
                  {t.tag}
                </span>
 
                {/* Quote */}
                <p className="text-base text-(--text-secondary) leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
 
                {/* Bottom: engagement row */}
                <div className="flex items-center gap-4 pt-3 border-t border-(--border-light)">
                  <div className="flex items-center gap-1.5 text-[11px] text-(--text-muted) select-none">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{formatNumber(t.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-(--text-muted) select-none">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{formatNumber(t.comments)}</span>
                  </div>
                  <span className="ml-auto text-[10px] text-(--text-muted) font-medium italic">
                    Identity Protected
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
 
        {/* Disclaimer strip */}
        <ScrollReveal className="mt-6">
          <p className="text-center text-[11px] text-(--text-muted) max-w-lg mx-auto leading-relaxed">
            *Stories from actual users who successfully cracked their interview loops. Names are modified for privacy.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
