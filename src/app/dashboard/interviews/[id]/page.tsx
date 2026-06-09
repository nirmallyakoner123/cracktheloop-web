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
  HelpCircle,
  Mic,
  Cpu,
  TrendingUp
} from "lucide-react";

export default function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  useEffect(() => {
    const savedToken = getCookie("ctl_token");

    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);

    async function loadSession() {
      try {
        const res = await fetch(`/api/interviews/${id}`, {
          headers: { "Authorization": `Bearer ${savedToken}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSession(data.interview);
        } else {
          alert(data.message || data.error || "Failed to load session details");
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
    setGeneratingReport(true);
    try {
      const res = await fetch(`/api/interviews/${id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ provider: "openai", apiKey: "server" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to create evaluation");
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
      <div className="min-h-screen bg-(--bg-mist) flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-(--accent) animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col relative pb-16 print:bg-white print:text-black">
      
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 no-print">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-(--accent)/3 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/3 blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-6 flex justify-between items-center relative z-20 no-print">
        <button 
          onClick={() => router.push("/dashboard/interviews")}
          className="flex items-center gap-2 hover:text-slate-800 transition font-bold text-xs text-slate-500 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Interviews List
        </button>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#E8503A] hover:bg-[#F06B57] hover:brightness-110 text-white rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-md shadow-[#E8503A]/10 hover:shadow-[#E8503A]/20"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            Export to PDF
          </button>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-10 pt-4 flex flex-col gap-6 relative z-20 print:pt-0 select-none">
        
        {/* Title and metadata block */}
        <section className="border-b border-slate-200 pb-6 flex justify-between items-start print:border-black print:pb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 print:text-black" style={{ fontFamily: "var(--font-display)" }}>
              {session.role} Evaluation Report
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 print:text-black/80 font-semibold mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-(--accent) no-print" /> 
                Date: {new Date(session.created_at).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-500 no-print" /> 
                Turns: {session.transcript?.length || 0} spoken turns
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600 no-print" />
                Company: {session.company || "General Session"}
              </span>
            </div>
          </div>
        </section>

        {/* Evaluation Summary Report Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start relative z-10">
          
          {/* Main report grading card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm print-card flex flex-col gap-4">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3 print:text-black print:border-black select-none" style={{ fontFamily: "var(--font-display)" }}>
                <Award className="w-5 h-5 text-(--accent)" />
                Grading Performance
              </h2>

              {session.report ? (
                (() => {
                  const score = session.report.overall_score;
                  const commScore = session.report.communication_score;
                  const techScore = session.report.technical_score;

                  const getScoreColors = (val: number) => {
                    if (val >= 85) return { text: "text-emerald-600", bg: "bg-emerald-500 animate-pulse", track: "bg-emerald-100/50", border: "border-emerald-250/20", label: "Expert" };
                    if (val >= 70) return { text: "text-teal-600", bg: "bg-teal-500", track: "bg-teal-100/50", border: "border-teal-250/20", label: "Strong" };
                    if (val >= 50) return { text: "text-amber-600", bg: "bg-amber-500", track: "bg-amber-100/50", border: "border-amber-250/20", label: "Average" };
                    return { text: "text-rose-600", bg: "bg-rose-500", track: "bg-rose-100/50", border: "border-rose-250/20", label: "Needs Work" };
                  };

                  const overallColors = getScoreColors(score);
                  const commColors = getScoreColors(commScore);
                  const techColors = getScoreColors(techScore);

                  return (
                    <div className="flex flex-col gap-6">
                      {/* Overall score box */}
                      <div className="flex flex-col items-center py-4 bg-slate-50/70 border border-slate-200/50 rounded-xl print-card relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-[#E8503A]"></div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black select-none">Overall Score</span>
                        <span className={`text-5xl font-black mt-2 tracking-tight ${overallColors.text}`}>{score}</span>
                        <span className={`mt-2.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${overallColors.text} bg-white border border-slate-200/60 shadow-sm`}>
                          {overallColors.label}
                        </span>
                      </div>

                      {/* Individual metric progress bars */}
                      <div className="flex flex-col gap-4 font-semibold text-xs">
                        {/* Comm score */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center select-none">
                            <span className="text-slate-500 font-bold print:text-black/80">Communication Flow</span>
                            <span className={`font-black ${commColors.text}`}>{commScore}/100</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${commColors.bg}`}
                              style={{ width: `${commScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Tech score */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center select-none">
                            <span className="text-slate-500 font-bold print:text-black/80">Technical Accuracy</span>
                            <span className={`font-black ${techColors.text}`}>{techScore}/100</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${techColors.bg}`}
                              style={{ width: `${techScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8 flex flex-col items-center gap-4">
                  <p className="text-xs text-slate-450 italic font-medium leading-relaxed">No report has been compiled for this interview yet.</p>
                  <button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="no-print w-full py-2.5 bg-[#E8503A] hover:bg-[#F06B57] text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md shadow-[#E8503A]/10 hover:brightness-110 active:scale-95 transition flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {generatingReport ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Analyzing Transcript...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
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
                className="no-print w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-lg text-xs font-black uppercase tracking-wider flex justify-center items-center gap-2 transition active:scale-95 text-slate-700 hover:text-slate-900 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {generatingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-(--accent)" />}
                Re-generate Report Evaluation
              </button>
            )}
          </div>

          {/* Detailed Feedback & Improvements */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            
            {/* Feedback card */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm print-card flex flex-col gap-3">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 print:text-black print:border-black select-none flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <FileText className="w-5 h-5 text-(--accent)" />
                Interview Evaluation Feedback
              </h2>
              {session.report ? (
                <p className="text-xs text-slate-650 leading-relaxed font-semibold whitespace-pre-wrap select-text print:text-black">
                  {session.report.feedback}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-8">Generate the AI Evaluation report to view qualitative feedback.</p>
              )}
            </div>

            {/* Improvement Guide card */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm print-card flex flex-col gap-3">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 print:text-black print:border-black select-none flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Technical Improvement Guide
              </h2>
              {session.report ? (
                <p className="text-xs text-slate-650 leading-relaxed font-semibold whitespace-pre-wrap select-text print:text-black">
                  {session.report.improvement_guide}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-8">Generate the AI Evaluation report to view technical guidance details.</p>
              )}
            </div>

          </div>

        </section>

        {/* Complete conversation transcript timeline */}
        <section className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm print-card relative z-10">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 print:text-black print:border-black select-none flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <MessageSquare className="w-5 h-5 text-(--accent)" />
            Chronological Conversation Log
          </h2>

          <div className="flex flex-col gap-4 mt-6 divide-y divide-slate-100 print:divide-black/10">
            {session.transcript && session.transcript.length > 0 ? (
              session.transcript.map((turn: any, index: number) => {
                let senderIcon = null;
                let senderName = "";
                let senderStyles = "";
                let bubbleStyles = "";

                if (turn.sender === "interviewer") {
                  senderIcon = <Mic className="w-3.5 h-3.5 text-sky-500" />;
                  senderName = "Interviewer";
                  senderStyles = "text-sky-600";
                  bubbleStyles = "bg-sky-50/50 text-slate-700 border-sky-100/70 hover:border-sky-200";
                } else if (turn.sender === "candidate") {
                  senderIcon = <User className="w-3.5 h-3.5 text-indigo-500" />;
                  senderName = "You (Candidate)";
                  senderStyles = "text-indigo-600";
                  bubbleStyles = "bg-indigo-50/40 text-slate-700 border-indigo-100/50 hover:border-indigo-200";
                } else {
                  senderIcon = <Cpu className="w-3.5 h-3.5 text-[#E8503A]" />;
                  senderName = "Copilot";
                  senderStyles = "text-[#E8503A]";
                  bubbleStyles = "bg-red-50/30 text-slate-700 border-red-100/40 hover:border-red-200";
                }

                return (
                  <div key={index} className="flex flex-col gap-1.5 pt-4 first:pt-0">
                    <div className="flex justify-between items-center select-none">
                      <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${senderStyles}`}>
                        {senderIcon}
                        {senderName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold">
                        {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs px-3.5 py-2.5 rounded-lg border leading-relaxed font-semibold select-text print:text-black print:bg-slate-100 print:border-slate-200 transition-colors duration-200 ${bubbleStyles}`}>
                      {turn.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">No transcript data saved.</p>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1600px] mx-auto px-6 md:px-10 pt-16 text-center text-xs text-slate-400 mt-auto select-none flex justify-between items-center border-t border-slate-100 no-print">
        <span>© 2026 CrackTheLoop. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-600/70 font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          Stealth Evasion Shield Enabled
        </span>
      </footer>
    </div>
  );
}
