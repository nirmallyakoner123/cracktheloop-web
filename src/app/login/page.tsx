"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Sparkles, ArrowRight, Loader2, Lock, Gift, Mail, User, EyeOff, Zap, Cpu, CreditCard, Mic, Terminal } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Auth / Form mode: "signin" or "signup"
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Real-time validation helpers for premium visual feedback
  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;
  const isNameValid = name.trim().length > 0;

  // Live HUD simulator scenarios cycling in the right preview column
  const simulatorScenarios = [
    {
      topic: "React / Frontend",
      question: "How do you optimize a large list rendering that lags during scrolling?",
      suggestion: "Use virtualization (react-window), add memoized row components, and ensure unique key attributes.",
      latency: "0.14s"
    },
    {
      topic: "System Design",
      question: "How would you handle hot-key partition bottlenecks in a sharded cache?",
      suggestion: "Implement local cache layers, add random scatter prefixes, or replicate hot-keys across read-replicas.",
      latency: "0.19s"
    },
    {
      topic: "Node.js / Backend",
      question: "Explain optimistic locking and write a function to demonstrate concurrency control.",
      suggestion: "const save = (doc) => db.update({ ...doc, ver: doc.ver + 1 }).where('ver = ?', doc.ver);",
      latency: "0.18s"
    },
    {
      topic: "Algorithms",
      question: "Write an optimal function to find the maximum subarray sum.",
      suggestion: "Kadane's Algorithm: Maintain max_so_far and max_ending_here. Time complexity: O(N), Space complexity: O(1).",
      latency: "0.12s"
    }
  ];

  const [currentScenario, setCurrentScenario] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % simulatorScenarios.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const scenario = simulatorScenarios[currentScenario];

  // Check URL ref query or local storage
  useEffect(() => {
    if (getCookie("ctl_token")) {
      window.location.replace("/dashboard");
      return;
    }

    const modeParam = searchParams.get("mode");
    if (modeParam === "signup") {
      setMode("signup");
    }

    const urlRef = searchParams.get("ref");
    if (urlRef) {
      setCookie("ctl_ref", urlRef);
      setReferralCode(urlRef);
      setMode("signup"); // Auto-toggle to signup if referred
    } else {
      const savedRef = getCookie("ctl_ref");
      if (savedRef) {
        setReferralCode(savedRef);
      }
    }
  }, [searchParams, router]);

  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: mode === "signup" ? name : undefined,
          referralCode: mode === "signup" ? referralCode : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Authentication failed");
      }

      setCookie("ctl_token", data.token);
      setCookie("ctl_user", JSON.stringify(data.user));

      setMessage(mode === "signup" ? "Account created successfully! Redirecting to dashboard..." : "Sign in successful! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 1000);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen md:h-screen md:max-h-screen w-screen flex flex-col md:flex-row relative overflow-y-auto md:overflow-hidden bg-white select-none">
      
      {/* Left Column: Input Form */}
      <div className="w-full md:w-[42%] lg:w-[40%] flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-(--bg-mist) relative min-h-screen md:h-screen md:max-h-screen overflow-y-auto md:overflow-hidden gap-8 lg:gap-10">
        
        {/* Floating gradient background elements for Left Section */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-(--accent)/4 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/3 blur-[100px] pointer-events-none"></div>

        {/* Top Header Bar for branding & trust */}
        <div className="w-full max-w-[460px] mx-auto flex items-center justify-between z-20 select-none">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer">
            <img src="/logo.png" className="h-8 w-auto object-contain" alt="Logo" />
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Crack<span className="text-(--accent) font-black">TheLoop</span>
            </span>
          </Link>
        </div>

        {/* Form container: integrated directly into the left column background without a card border/shadow */}
        <div className="w-full max-w-[460px] mx-auto flex flex-col gap-5.5 relative z-10 animate-fade-in">
          
          <div className="flex flex-col gap-2 text-left select-none">
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-850 mt-1 animate-slide-in" style={{ fontFamily: "var(--font-display)" }}>
              {mode === "signin" ? "Access Live Copilot Dashboard" : "Join CrackTheLoop Beta"}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold -mt-0.5">
              <span>Trusted by 3.4k+ developers</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-semibold mt-1">
              {mode === "signin" 
                ? "Enter your credentials to authorize and launch your copilot dashboard." 
                : "Get started with 15 free credits to use during your live sessions. Zero risk, 100% free."}
            </p>
          </div>

          {/* Animated Credit Voucher (Endowment Hook - Real Ticket Design) */}
          {mode === "signup" && (
            <div className="relative overflow-hidden bg-gradient-to-r from-rose-500/5 to-orange-500/5 rounded-2xl flex items-stretch shadow-xs select-none animate-fade-in h-[88px]">
              {/* Perforated Cutouts / Notches */}
              <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-(--bg-mist)"></div>
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-(--bg-mist)"></div>
              <div className="absolute left-[72%] top-[-6px] w-3 h-3 rounded-full bg-(--bg-mist)"></div>
              <div className="absolute left-[72%] bottom-[-6px] w-3 h-3 rounded-full bg-(--bg-mist)"></div>
              
              {/* Perforated Divider */}
              <div className="absolute left-[72%] top-2 bottom-2 border-l border-dashed border-slate-350"></div>

              {/* Left Ticket Stub (Info) */}
              <div className="w-[72%] p-3 pl-5 flex flex-col justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-(--accent) flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse"></span>
                    Live AI Response Copilot Onboarding Pass
                  </span>
                  <span className="text-sm font-black text-slate-800 tracking-tight">
                    15 FREE LIVE CREDITS
                  </span>
                </div>
                <div className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wide">
                  No Credit Card Required
                </div>
              </div>

              {/* Right Ticket Stub (Action Status) */}
              <div className="w-[28%] flex flex-col items-center justify-center bg-slate-50/40 p-2 pl-3">
                <span className="bg-(--accent) text-white font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-xs shadow-(--accent)/15 animate-pulse">
                  UNCLAIMED
                </span>
              </div>
            </div>
          )}

          {message && (
            <div className={`p-3.5 rounded-xl border text-center text-xs font-semibold ${
              message.toLowerCase().includes("sent") || message.toLowerCase().includes("successful") || message.toLowerCase().includes("choose") || message.toLowerCase().includes("loading")
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse"
                : "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handlePasswordAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              
              {/* Full Name (Sign Up only) */}
              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-450 font-black uppercase tracking-widest pl-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full bg-white border px-4 py-3 pl-11 pr-10 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 font-semibold shadow-xs ${
                        isNameValid 
                          ? "border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/5 bg-emerald-50/5" 
                          : "border-slate-200 focus:border-(--accent) focus:ring-(--accent)/5"
                      }`}
                    />
                    <User className="w-4 h-4 text-slate-455 absolute left-4 top-3.5" />
                    {isNameValid && (
                      <span className="absolute right-4 top-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700 animate-scale-in">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-450 font-black uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className={`w-full bg-white border px-4 py-3 pl-11 pr-10 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 font-semibold shadow-xs ${
                      isEmailValid 
                        ? "border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/5 bg-emerald-50/5" 
                        : "border-slate-200 focus:border-(--accent) focus:ring-(--accent)/5"
                    }`}
                  />
                  <Mail className="w-4 h-4 text-slate-455 absolute left-4 top-3.5" />
                  {isEmailValid && (
                    <span className="absolute right-4 top-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700 animate-scale-in">
                      ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-455 font-black uppercase tracking-widest pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-white border px-4 py-3 pl-11 pr-10 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 font-semibold shadow-xs ${
                      isPasswordValid 
                        ? "border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/5 bg-emerald-50/5" 
                        : "border-slate-200 focus:border-(--accent) focus:ring-(--accent)/5"
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-455 absolute left-4 top-3.5" />
                  {isPasswordValid && (
                    <span className="absolute right-4 top-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700 animate-scale-in">
                      ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Referral Code (Sign Up only, optional) */}
              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-450 font-black uppercase tracking-widest pl-1 flex items-center gap-1">
                    Referral Code <span className="text-[8.5px] text-slate-400 font-medium lowercase tracking-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="REF-XXXXXX"
                      className={`w-full bg-white border px-4 py-3 pl-11 pr-10 rounded-xl text-xs text-(--accent) placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 font-mono font-semibold shadow-xs ${
                        referralCode.trim().length > 0 
                          ? "border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/5 bg-emerald-50/5" 
                          : "border-slate-200 focus:border-(--accent) focus:ring-(--accent)/5"
                      }`}
                    />
                    <Gift className="w-4 h-4 text-slate-455 absolute left-4 top-3.5" />
                    {referralCode.trim().length > 0 && (
                      <span className="absolute right-4 top-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700 animate-scale-in">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.includes("@") || password.length < 6 || (mode === "signup" && !name.trim())}
                className="btn-primary-glow w-full mt-3 !py-3.5 !px-6 justify-center !rounded-xl font-bold text-xs text-white uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-(--accent)/10 hover:shadow-(--accent)/20 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "signup" ? "Claim 15 Credits & Enter" : "Authorize & Launch HUD"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Dynamic mode switcher text link */}
          <div className="text-center text-xs text-slate-500 font-semibold mt-1 select-none">
            {mode === "signin" ? (
              <>
                New to CrackTheLoop?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                  className="text-(--accent) hover:text-(--accent-bright) font-extrabold transition cursor-pointer underline decoration-2 decoration-(--accent)/20 hover:decoration-(--accent)/50 underline-offset-4 ml-0.5"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setMessage("");
                  }}
                  className="text-(--accent) hover:text-(--accent-bright) font-extrabold transition cursor-pointer underline decoration-2 decoration-(--accent)/20 hover:decoration-(--accent)/50 underline-offset-4 ml-0.5"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
          
        </div>

        {/* Left Column Footer */}
        <footer className="w-full max-w-[460px] mx-auto pt-4 border-t border-slate-200/50 flex items-center justify-center select-none">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-slate-550"><Shield className="w-3.5 h-3.5 text-emerald-500" /> WebRTC Shield</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
            <span className="flex items-center gap-1.5 text-slate-550">🔒 SSL Encrypted</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
            <span className="flex items-center gap-1.5 text-slate-550">🛡️ Client-Side Sandbox</span>
          </div>
        </footer>
      </div>

      {/* Right Column: Product Showcase & Trust Metrics (Horizontal split grid to fill blank space and avoid scroll) */}
      <div className="hidden md:flex md:w-[58%] lg:w-[60%] bg-[#0B0F1A] text-white flex-col justify-between p-8 lg:p-12 relative overflow-hidden border-l border-white/5 select-none h-screen max-h-screen">
        
        {/* Rich atmospheric glows - slowly animating for dynamic premium feeling */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-(--accent)/15 blur-[120px] pointer-events-none animate-float-orb"></div>
        <div className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-500/12 blur-[120px] pointer-events-none animate-float-orb-slow"></div>
        <div className="absolute top-[35%] left-[25%] w-[400px] h-[400px] rounded-full bg-emerald-500/6 blur-[110px] pointer-events-none animate-float-orb" style={{ animationDuration: "14s" }}></div>

        {/* Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer">
            <img src="/logo.png" className="h-8 w-auto object-contain" alt="Logo" />
            <span className="text-sm font-bold tracking-tight text-white">
              Crack<span className="text-(--accent) font-black">TheLoop</span>
            </span>
          </Link>
          <span className="text-[9px] font-black bg-white/10 text-white/90 border border-white/10 px-2.5 py-1 rounded-full tracking-widest uppercase">
            Privacy-First Overlay
          </span>
        </div>

        {/* Core Showcase content (2-column layout to fill space horizontally and fit on screen) */}
        <div className="relative z-10 my-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          
          {/* Left Sub-Column: Tagline & Stats */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-(--accent) font-black uppercase tracking-widest pl-0.5">
                LIVE INTERVIEW COPILOT
              </span>
              <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-slate-100 leading-tight">
                Answer with Clarity <br />
                Under Pressure.
              </h3>
              <p className="text-slate-400 text-xs xl:text-sm font-semibold leading-relaxed mt-1">
                CrackTheLoop runs locally on your desktop to serve as your communication assistant. It listens to the live call and displays response outlines and talking points to help you communicate clearly and avoid blank mind moments.
              </p>
            </div>

            {/* Bottom Statistics (Visual summary dashboard card) */}
            <div className="grid grid-cols-3 gap-3.5 border-t border-white/5 pt-6">
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="block text-xl lg:text-2xl font-black text-white leading-none">3.4k+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 block">Loops Cracked</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="block text-xl lg:text-2xl font-black text-emerald-400 leading-none">98.4%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 block">Success Rate</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="block text-xl lg:text-2xl font-black text-white leading-none">100%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 block">Money Back</span>
              </div>
            </div>
          </div>

          {/* Right Sub-Column: HUD mock and benefits list */}
          <div className="flex flex-col gap-5">
            {/* Interactive Mock HUD window */}
            <div className="w-full rounded-2xl bg-[#131826]/90 border border-white/8 shadow-2xl relative overflow-hidden group transition-all duration-300">
              {/* macOS style header bar */}
              <div className="bg-white/4 border-b border-white/5 px-4 py-3 flex items-center justify-between">
                {/* Window control circles */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500/80"></span>
                  <span className="w-2 h-2 rounded-full bg-amber-500/80"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                </div>
                {/* Tab */}
                <div className="bg-[#1C2336] border border-white/5 px-2.5 py-0.5 rounded-md text-[8.5px] font-mono text-slate-300 tracking-wide flex items-center gap-1.5">
                  <span>copilot-stream.wav</span>
                  <div className="flex items-center gap-0.5 h-2 select-none">
                    <div className="w-[1.2px] h-1.5 bg-emerald-500 rounded-full animate-bounce-audio" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-[1.2px] h-1.5 bg-emerald-500 rounded-full animate-bounce-audio" style={{ animationDelay: "0.3s" }}></div>
                    <div className="w-[1.2px] h-1.5 bg-emerald-500 rounded-full animate-bounce-audio" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-[1.2px] h-1.5 bg-emerald-500 rounded-full animate-bounce-audio" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
                {/* Live tag */}
                <div className="flex items-center gap-1 text-[8px] font-black text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  LIVE FEED ({scenario.latency})
                </div>
              </div>

              {/* HUD Content Area */}
              <div className="p-4.5 flex flex-col gap-4 min-h-[185px] justify-between">
                {/* Interviewer Audio Log */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Interviewer Input (Speech-to-Text)
                  </span>
                  <div className="bg-[#1C2336] border border-white/5 p-3 rounded-xl text-xs lg:text-[13px] text-slate-200 font-semibold leading-relaxed shadow-inner transition-all duration-500">
                    "{scenario.question}"
                  </div>
                </div>

                {/* Copilot HUD output */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-emerald-450 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Live Response HUD Suggestions
                  </span>
                  <div className="bg-emerald-950/20 border border-emerald-500/15 p-3.5 rounded-xl text-xs lg:text-[13px] text-emerald-200 font-bold leading-relaxed font-mono relative transition-all duration-500">
                    <span className="text-emerald-450 font-black block text-[8px] uppercase tracking-widest mb-1">// {scenario.topic} Focus Outline</span>
                    {scenario.suggestion}
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Badge List (Grid format - upgraded with colored SVG vector icons) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 bg-white/3 border border-white/5 px-3.5 py-2.5 rounded-xl hover:bg-white/5 transition-all">
                <EyeOff className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-350 uppercase tracking-wide">Privacy-First HUD</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/3 border border-white/5 px-3.5 py-2.5 rounded-xl hover:bg-white/5 transition-all">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="text-xs font-bold text-slate-350 uppercase tracking-wide">Under 200ms Latency</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/3 border border-white/5 px-3.5 py-2.5 rounded-xl hover:bg-white/5 transition-all">
                <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs font-bold text-slate-350 uppercase tracking-wide">Context-Aware AI</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/3 border border-white/5 px-3.5 py-2.5 rounded-xl hover:bg-white/5 transition-all">
                <CreditCard className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-slate-350 uppercase tracking-wide">Pay-As-You-Go Billing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0D19] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
