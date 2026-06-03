"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  ArrowLeft, 
  FileText, 
  Award, 
  Download, 
  Sparkles, 
  Loader2,
  Calendar,
  MessageSquare,
  Volume2,
  User,
  Settings,
  HelpCircle
} from "lucide-react";

export default function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // LLM setup for report generation
  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("ctl_token");
    const savedProvider = localStorage.getItem("ctl_active_llm_provider") || "groq";
    const savedApiKey = localStorage.getItem("ctl_llm_key") || "";

    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);
    setProvider(savedProvider);
    setApiKey(savedApiKey);

    async function loadSession() {
      try {
        const res = await fetch(`/api/interviews/${id}`, {
          headers: { "Authorization": `Bearer ${savedToken}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSession(data.interview);
        } else {
          alert(data.error || "Failed to load session details");
          router.push("/dashboard/interviews");
        }
      } catch (err) {
        console.error(err);
        router.push("/dashboard/interviews");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [id, router]);

  async function handleGenerateReport() {
    if (!apiKey.trim()) {
      alert("An API Key is required to run LLM evaluation.");
      setShowConfig(true);
      return;
    }
    setGeneratingReport(true);
    try {
      const res = await fetch(`/api/interviews/${id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ provider, apiKey })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create evaluation");
      setSession((prev: any) => ({ ...prev, report: data.report }));
      alert("Evaluation Report generated successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGeneratingReport(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D19] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative pb-16 print:bg-white print:text-black">
      
      {/* Hide elements when printing */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: 1px solid #ddd !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .print-title {
            color: black !important;
          }
        }
      `}</style>

      {/* Background radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow no-print"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0DCAF0]/10 bg-blur-glow no-print"></div>

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 no-print">
        <button 
          onClick={() => router.push("/dashboard/interviews")}
          className="flex items-center gap-2 hover:text-white transition font-bold text-xs text-slate-400 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Interviews List
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            Config LLM Evaluator
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-md shadow-indigo-500/10 text-white"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            Export to PDF
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-6 pt-6 flex flex-col gap-8 relative z-20 print:pt-0">
        
        {/* LLM Evaluator Config Console */}
        {showConfig && (
          <section className="glow-card rounded-2xl p-5 bg-[#0a0e1c] border border-white/10 flex flex-col gap-4 no-print animate-fade-in">
            <span className="text-[10px] text-white/50 font-black uppercase tracking-widest border-b border-white/5 pb-1.5 flex items-center gap-1">
              ⚙️ LLM Evaluator Configuration
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select LLM Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="bg-[#050811] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="groq">Groq (Llama-3.1)</option>
                  <option value="openai">OpenAI (GPT-4o-mini)</option>
                  <option value="xai">Grok (xAI)</option>
                  <option value="anthropic">Claude (Claude-3.5-Haiku)</option>
                  <option value="gemini">Gemini (Gemini-1.5-Flash)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LLM API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste LLM API key here..."
                  className="w-full bg-[#050811] border border-white/10 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-sky-400 transition"
                />
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.setItem("ctl_active_llm_provider", provider);
                localStorage.setItem("ctl_llm_key", apiKey);
                setShowConfig(false);
                alert("Keys configured successfully!");
              }}
              className="py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition uppercase tracking-wider text-slate-200"
            >
              Save Settings
            </button>
          </section>
        )}

        {/* Title and metadata block */}
        <section className="border-b border-white/5 pb-6 flex justify-between items-start print:border-black print:pb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white print:text-black">
              {session.role} Evaluation Report
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 print:text-black/80 font-semibold mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400 no-print" /> 
                Date: {new Date(session.created_at).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400 no-print" /> 
                Turns: {session.transcript?.length || 0} spoken turns
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400 no-print" />
                Company: {session.company || "General Session"}
              </span>
            </div>
          </div>
        </section>

        {/* Evaluation Summary Report Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main report grading card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glow-card rounded-2xl p-6 bg-[#0c1125]/90 border-white/5 print-card">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3 print:text-black print:border-black">
                <Award className="w-4 h-4 text-sky-400" />
                Grading Performance
              </h2>

              {session.report ? (
                <div className="flex flex-col gap-5 mt-4">
                  {/* Overall score */}
                  <div className="flex flex-col items-center py-4 bg-[#0a0e1c] border border-white/5 rounded-2xl print-card">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Overall Score</span>
                    <span className="text-4xl font-black text-emerald-400 mt-1">{session.report.overall_score}/100</span>
                  </div>

                  {/* Individual metrics */}
                  <div className="flex flex-col gap-3 font-semibold text-xs">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-slate-400 print:text-black/80">Communication Flow</span>
                      <span className="text-white print:text-black font-extrabold">{session.report.communication_score}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 print:text-black/80">Technical Accuracy</span>
                      <span className="text-white print:text-black font-extrabold">{session.report.technical_score}/100</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 flex flex-col items-center gap-4">
                  <p className="text-xs text-slate-400 italic">No report has been compiled for this interview yet.</p>
                  <button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="no-print w-full py-3 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl font-bold text-xs text-white uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {generatingReport ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Analyzing Transcript...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate AI Evaluation
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Recalibrate / re-generate option */}
            {session.report && (
              <button
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="no-print w-full py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold flex justify-center items-center gap-1.5 transition active:scale-95 text-slate-200 cursor-pointer disabled:opacity-50"
              >
                {generatingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-sky-400" />}
                Re-generate Report Evaluation
              </button>
            )}
          </div>

          {/* Detailed Feedback & Improvements */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Feedback card */}
            <div className="glow-card rounded-2xl p-6 bg-[#0c1125]/90 border-white/5 print-card">
              <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-3 print:text-black print:border-black">
                📋 Interview Evaluation Feedback
              </h2>
              {session.report ? (
                <p className="text-xs text-slate-350 leading-relaxed font-medium mt-4 whitespace-pre-wrap select-text print:text-black">
                  {session.report.feedback}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic mt-4 text-center py-4">Generate the AI Evaluation report to view qualitative feedback.</p>
              )}
            </div>

            {/* Improvement Guide card */}
            <div className="glow-card rounded-2xl p-6 bg-[#0c1125]/90 border-white/5 print-card">
              <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-3 print:text-black print:border-black">
                🚀 Reconciled Technical Improvement Guide
              </h2>
              {session.report ? (
                <p className="text-xs text-slate-350 leading-relaxed font-medium mt-4 whitespace-pre-wrap select-text print:text-black">
                  {session.report.improvement_guide}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic mt-4 text-center py-4">Generate the AI Evaluation report to view technical guidance details.</p>
              )}
            </div>

          </div>

        </section>

        {/* Complete conversation transcript timeline */}
        <section className="glow-card rounded-2xl p-6 md:p-8 bg-[#0c1125]/90 border-white/5 print-card">
          <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-3 print:text-black print:border-black">
            💬 Chronological Conversation Log
          </h2>

          <div className="flex flex-col gap-4 mt-6 divide-y divide-white/5 print:divide-black/10">
            {session.transcript && session.transcript.length > 0 ? (
              session.transcript.map((turn: any, index: number) => (
                <div key={index} className="flex flex-col gap-1.5 pt-4 first:pt-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${
                      turn.sender === "interviewer" ? "text-sky-400" :
                      turn.sender === "candidate" ? "text-purple-400" :
                      "text-emerald-400"
                    }`}>
                      {turn.sender === "interviewer" ? "🗣️ Interviewer" :
                       turn.sender === "candidate" ? "🎙️ You" :
                       "🤖 Copilot"}
                    </span>
                    <span className="text-[8px] text-slate-500 font-semibold">
                      {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 bg-slate-950/45 px-4 py-3 rounded-2xl border border-white/5 leading-relaxed font-medium select-text print:text-black print:bg-slate-100 print:border-slate-200">
                    {turn.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">No transcript data saved.</p>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 pt-24 text-center text-xs text-slate-650 mt-auto select-none flex justify-between items-center border-t border-white/5 no-print">
        <span>© 2026 CrackTheLoop. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-500/70 font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Stealth Evasion Shield Enabled
        </span>
      </footer>
    </div>
  );
}
