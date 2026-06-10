"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, FileText, CheckCircle2, MessageSquare, Users, Star, Zap, Terminal, ShieldCheck, Coins, Network, Code2 } from "lucide-react";
import { Parallax } from "./ScrollReveal";
import Link from "next/link";

const companyList = [
  { name: "Google", src: "/images/landing-logo-google.webp" },
  { name: "Razorpay", src: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" },
  { name: "Microsoft", src: "/images/landing-logo-microsoft.webp" },
  { name: "Zoho", src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/ZOHO.svg" },
  { name: "Amazon", src: "/images/landing-logo-amazon.webp" },
  { name: "Zomato", src: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" },
  { name: "Meta", src: "/images/landing-logo-meta.webp" },
  { name: "Paytm", src: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
  { name: "Tesla", src: "/images/landing-logo-tesla.webp" },
  { name: "Apple", src: "https://cdn.svgporn.com/logos/apple.svg", showText: true, textClass: "font-semibold tracking-tight text-slate-800 text-sm md:text-base ml-1.5" },
  { name: "Stripe", src: "https://cdn.svgporn.com/logos/stripe.svg" },
  { name: "Netflix", src: "https://cdn.svgporn.com/logos/netflix.svg" },
  { name: "Airbnb", src: "https://cdn.svgporn.com/logos/airbnb.svg" },
  { name: "Spotify", src: "https://cdn.svgporn.com/logos/spotify.svg" },
  { name: "Datadog", src: "https://cdn.svgporn.com/logos/datadog.svg" },
  { name: "Snowflake", src: "https://cdn.svgporn.com/logos/snowflake.svg" },
  { name: "NVIDIA", src: "https://cdn.svgporn.com/logos/nvidia.svg" },
  { name: "Dropbox", src: "https://cdn.svgporn.com/logos/dropbox.svg" },
  { name: "Shopify", src: "https://cdn.svgporn.com/logos/shopify.svg" },
  { name: "Twilio", src: "https://cdn.svgporn.com/logos/twilio.svg" },
  { name: "MongoDB", src: "https://cdn.svgporn.com/logos/mongodb.svg" },
  { name: "Atlassian", src: "https://cdn.svgporn.com/logos/atlassian.svg" },
  { name: "PayPal", src: "https://cdn.svgporn.com/logos/paypal.svg" },
  { name: "HubSpot", src: "https://cdn.svgporn.com/logos/hubspot.svg" },
  { name: "Twitch", src: "https://cdn.svgporn.com/logos/twitch.svg" },
  { name: "Pinterest", src: "https://cdn.svgporn.com/logos/pinterest.svg" },
  { name: "LinkedIn", src: "https://cdn.svgporn.com/logos/linkedin-icon.svg", showText: true, textClass: "font-bold tracking-tight text-[#0A66C2] text-sm md:text-base ml-1" },
  { name: "Oracle", src: "https://cdn.svgporn.com/logos/oracle.svg" },
  { name: "Slack", src: "https://cdn.svgporn.com/logos/slack.svg" },
  { name: "Adobe", src: "https://cdn.svgporn.com/logos/adobe.svg" },
  { name: "GitHub", src: "https://cdn.svgporn.com/logos/github-icon.svg", showText: true, textClass: "font-bold tracking-tight text-slate-800 text-sm md:text-base ml-1" },
  { name: "Figma", src: "https://cdn.svgporn.com/logos/figma.svg", showText: true, textClass: "font-bold tracking-tight text-slate-800 text-sm md:text-base ml-1.5" }
];

export default function Hero() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [streamedText, setStreamedText] = useState("");
  const [tilt, setTilt] = useState({ x: 2, y: -3 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates relative to card center (ranges between -0.5 and 0.5)
    const pctX = (x / rect.width) - 0.5;
    const pctY = (y / rect.height) - 0.5;

    // Maximum tilt angle (in degrees)
    const maxTilt = 10;

    // Calculate 3D rotations:
    // Mouse on right makes right side go down (negative rotateY)
    // Mouse on bottom makes bottom side go down (positive rotateX)
    setTilt({
      x: pctY * maxTilt,
      y: -pctX * maxTilt
    });
  };

  const handleMouseLeave = () => {
    // Smoothly restore default tilt of rotateX(2deg) rotateY(-3deg)
    setTilt({ x: 2, y: -3 });
  };

  const simulatorQuestions = [
    {
      id: 0,
      tabLabel: "Behavioral",
      icon: Users,
      question: "Tell me about a time you disagreed with a PM on scope or timeline. How did you resolve it?",
      answerParagraph: "We disagreed on timeline due to database tech debt. I proposed a cached polling compromise for Q3 and deferred the real-time pipeline to Q4. This launched 3 days early, kept DB load stable, and saved 40% dev hours."
    },
    {
      id: 1,
      tabLabel: "System Design",
      icon: Network,
      question: "How would you design a real-time notification service (like Slack mobile/browser alerts) at scale?",
      answerParagraph: "I would establish open WebSocket connections for active clients, utilizing Redis Pub/Sub routing. Offline messages would push to APNS/FCM. To buffer spikes, messages route through Kafka to worker pools."
    },
    {
      id: 2,
      tabLabel: "Coding & Tech",
      icon: Code2,
      question: "Implement a custom debounce function in JavaScript. How does it handle leading/trailing edge calls?",
      answerParagraph: "A debounce function returns a closure holding a timeout ID. Each invocation clears active timers via clearTimeout and registers a new setTimeout. The execution context is bound using function.apply."
    }
  ];

  const currentQ = simulatorQuestions[activeQuestion];

  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setActiveQuestion((prev) => (prev + 1) % simulatorQuestions.length);
    }, 8500); // 8.5 seconds rotation to allow full reading
    return () => clearInterval(timer);
  }, [isAutoplay, simulatorQuestions.length]);

  // Word-by-word typewriter/streaming effect
  useEffect(() => {
    setStreamedText("");
    const words = currentQ.answerParagraph.split(" ");
    let currentWordIndex = 0;
    let accumulatedText = "";

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        accumulatedText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex];
        setStreamedText(accumulatedText);
        currentWordIndex++;
      } else {
        clearInterval(interval);
      }
    }, 45); // Stream a new word every 45ms

    return () => clearInterval(interval);
  }, [activeQuestion, currentQ.answerParagraph]);

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-gradient-mesh relative min-h-screen flex flex-col pt-36 md:pt-35 pb-12 overflow-hidden"
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Orbs with parallax */}
      <Parallax speed={0.2} className="absolute -top-20 -right-40">
        <div className="orb orb-peach w-[600px] h-[600px] animate-float-orb" />
      </Parallax>
      <Parallax speed={0.4} className="absolute top-1/2 -left-40">
        <div className="orb orb-slate w-[400px] h-[400px] animate-float-orb-slow" />
      </Parallax>
      <Parallax speed={0.15} className="absolute -bottom-20 right-1/4">
        <div className="orb orb-frost w-[350px] h-[350px] animate-float-orb" style={{ animationDelay: "5s" }} />
      </Parallax>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-12 items-start my-auto py-6">
          {/* Left - Copy */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >

            <h1
              className="font-bold tracking-tight text-slate-900 text-4xl md:text-5xl lg:text-5xl leading-[1]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Invisible Edge in Every <span className="text-gradient-coral">Technical Interview</span>
            </h1>
 
            <p className="text-base md:text-lg leading-relaxed font-normal text-(--text-muted) max-w-xl">
              Never let your mind go blank. Sits on your desktop, listens to the interview, and provides structured response outlines and memory prompts in real-time during live sessions.
            </p>
 
            <div className="flex flex-col gap-6 mt-4 max-w-xl">
              {/* Action Button */}
              <div>
                <Link href="/login?mode=signup&plan=Free%20Trial" className="btn-primary-glow inline-flex cursor-pointer !py-4 !px-8">
                  Try Live Interview Copilot
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
 
              {/* Trust Details & Referral Link */}
              <div className="flex flex-col gap-1.5 pl-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  50 Free Credits · No Credit Card Required
                </span>
                <Link
                  href="#referral-program"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("referral-program");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm text-indigo-650 hover:text-indigo-850 font-bold flex items-center gap-1 transition-all duration-300 hover:translate-x-0.5 select-none cursor-pointer"
                >
                  <span>🎁 Share with friends: Earn up to 500 bonus credits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
 
              {/* Divider and Platforms Row */}
              <div className="border-t border-slate-200/80 pt-5 mt-1 flex flex-col sm:flex-row sm:items-center gap-4 pl-1">
                <span className="text-xs font-bold text-slate-500 select-none tracking-wide shrink-0">
                  Runs alongside live interviews on:
                </span>
                <div className="flex items-center gap-5">
                  {[
                    { name: "Google Meet", src: "https://cdn.svgporn.com/logos/google-meet.svg" },
                    { name: "Zoom", src: "https://cdn.svgporn.com/logos/zoom.svg" },
                    { name: "Microsoft Teams", src: "https://cdn.svgporn.com/logos/microsoft-teams.svg" }
                  ].map((plat, i) => (
                    <img 
                      key={i} 
                      src={plat.src} 
                      alt={plat.name} 
                      title={plat.name}
                      className="h-6.5 w-auto object-contain transition-all duration-300 hover:scale-110 filter hover:drop-shadow-2xs cursor-default select-none opacity-85 hover:opacity-100" 
                    />
                  ))}
                </div>
              </div>
            </div>
 
            {/* Social Proof Review Rating & Avatars */}
            <motion.div
              className="flex flex-wrap items-center gap-6 mt-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex -space-x-3 select-none">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="Candidate" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" alt="Candidate" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" alt="Candidate" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" alt="Candidate" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
              </div>
 
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-current stroke-current" />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-(--text-primary)">4.9 / 5 from 180+ beta testers</span>
                </div>
                <div className="text-sm font-medium text-(--text-muted)">
                  Trusted by <span className="text-(--text-primary) font-extrabold">180+ engineers in beta</span> across top tech
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Interactive Mock Interview Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="perspective-[1200px]"
          >
            <div
              className="simulator-perspective-card glass-light rounded-[20px] p-3 md:p-4 border border-(--border-light) relative bg-white/80 backdrop-blur-md"
              style={{
                transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {/* Accent glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-br from-(--accent)/5 via-transparent to-slate-200/20 rounded-[22px] -z-10 blur-sm" />

              {/* Window Controls Header with Merged Simulator Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-(--border-light) pb-3">
                {/* Left: Window Dots & Mobile Live Indicator */}
                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 select-none">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <span className="hidden sm:inline text-[10px] font-mono text-slate-400 select-none">
                      /copilot-session
                    </span>
                  </div>

                  {/* Mobile Live Indicator */}
                  <div className="flex sm:hidden items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Live
                    </span>
                  </div>
                </div>

                {/* Center: Merged Simulator Tabs */}
                <div className="flex gap-1 p-0.5 bg-slate-100/80 rounded-full border border-slate-200/60 select-none justify-center w-full sm:w-auto overflow-x-auto">
                  {simulatorQuestions.map((q) => {
                    const isActive = activeQuestion === q.id;
                    const IconComponent = q.icon;
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setActiveQuestion(q.id);
                          setIsAutoplay(false);
                        }}
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap ${isActive
                            ? "bg-white text-(--accent) shadow-xs border border-slate-200/30"
                            : "text-slate-500 hover:text-slate-800"
                          }`}
                      >
                        <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{q.tabLabel}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Pulsing Live Indicator (desktop only) */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Live
                  </span>
                </div>
              </div>

              {/* Main Panel Grid with Enter/Exit Animations on State Change */}
              <motion.div
                key={activeQuestion}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Panel: Question Detected */}
                  <div className="bg-(--bg-mist) rounded-[8px] p-4 border border-(--border-light) flex flex-col gap-3 shadow-2xs h-[220px] md:h-[350px]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-(--text-secondary)">
                      <MessageSquare className="w-3.5 h-3.5 text-(--accent)" />
                      Question Detected
                    </div>
                    <div className="bg-white p-5 rounded-[6px] border border-slate-200/80 shadow-2xs flex-1 flex items-center justify-center">
                      <p className="text-sm md:text-base font-medium text-(--text-primary) italic leading-relaxed text-center">
                        &quot;{currentQ.question}&quot;
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-medium text-(--text-muted) pt-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Listening Live...
                      </span>
                      <span>Confidence: 99%</span>
                    </div>
                  </div>

                  {/* Right Panel: AI Suggested Answer Stream */}
                  <div className="bg-(--bg-mist) rounded-[8px] p-4 border border-(--border-light) flex flex-col gap-4 shadow-2xs h-[220px] md:h-[350px]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-(--text-secondary)">
                      <Sparkles className="w-3.5 h-3.5 text-(--accent)" />
                      Live AI Answer Stream
                    </div>
                    <div className="bg-white p-4.5 rounded-[6px] border border-slate-200/80 shadow-2xs flex-1 flex flex-col items-start justify-start overflow-hidden">
                      <p className="text-xs md:text-sm font-mono text-(--text-secondary) leading-relaxed text-left">
                        {streamedText}
                        {streamedText.length < currentQ.answerParagraph.length && (
                          <span className="inline-block w-1.5 h-3.5 bg-(--accent) ml-1 align-middle animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Company Trust Logo Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-6 border-t border-(--border-light) flex flex-col items-center gap-4 w-full overflow-hidden"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-infinite {
              animation: marquee 35s linear infinite;
            }
            .animate-marquee-infinite:hover {
              animation-play-state: paused;
            }
          `}} />

          <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-(--text-secondary) text-center select-none">
            Built for candidates targeting offers at
          </span>
          
          <div 
            className="relative w-full overflow-hidden py-2"
            style={{
              maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)'
            }}
          >
            <div className="flex w-max gap-12 animate-marquee-infinite items-center">
              {/* First group */}
              <div className="flex gap-12 items-center shrink-0">
                {companyList.map((comp, idx) => (
                  <div key={`c1-${idx}`} className="group flex items-center justify-center cursor-default select-none shrink-0">
                    <img 
                      src={comp.src} 
                      alt={comp.name} 
                      className="h-5 md:h-6 w-auto object-contain transition-all duration-300 opacity-90 group-hover:opacity-100" 
                    />
                    {comp.showText && (
                      <span className={`text-slate-800 transition-all duration-300 opacity-90 group-hover:opacity-100 ${comp.textClass}`} style={{ fontFamily: "var(--font-display)" }}>
                        {comp.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* Duplicate group for infinite loop */}
              <div className="flex gap-12 items-center shrink-0" aria-hidden="true">
                {companyList.map((comp, idx) => (
                  <div key={`c2-${idx}`} className="group flex items-center justify-center cursor-default select-none shrink-0">
                    <img 
                      src={comp.src} 
                      alt={comp.name} 
                      className="h-5 md:h-6 w-auto object-contain transition-all duration-300 opacity-90 group-hover:opacity-100" 
                    />
                    {comp.showText && (
                      <span className={`text-slate-800 transition-all duration-300 opacity-90 group-hover:opacity-100 ${comp.textClass}`} style={{ fontFamily: "var(--font-display)" }}>
                        {comp.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
