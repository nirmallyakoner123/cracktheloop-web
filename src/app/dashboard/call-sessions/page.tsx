"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  PhoneCall, 
  Plus, 
  Trash2, 
  Play, 
  History, 
  FileText, 
  Clock, 
  Settings2, 
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle,
  X,
  Loader2,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { 
  getMockSessions, 
  getMockResumes, 
  saveMockSession, 
  deleteMockSession, 
  MockCallSession, 
  MockResume 
} from "@/lib/mockService";

export default function CallSessionsPage() {
  const router = useRouter();
  
  const [sessions, setSessions] = useState<MockCallSession[]>([]);
  const [resumes, setResumes] = useState<MockResume[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // New session form fields
  const [sessionType, setSessionType] = useState<"interview" | "call">("interview");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [model, setModel] = useState("GPT-4o Mini");
  const [language, setLanguage] = useState("English");
  const [attachedResumeId, setAttachedResumeId] = useState("");

  useEffect(() => {
    setSessions(getMockSessions());
    const mockResumes = getMockResumes();
    setResumes(mockResumes);
    if (mockResumes.length > 0) {
      setAttachedResumeId(mockResumes[0].id);
    }
    setLoading(false);
  }, []);

  const handleOpenConfig = () => {
    setShowConfigModal(true);
  };

  const handleProceedToLimits = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfigModal(false);
    setShowLimitModal(true);
  };

  const handleCreateSession = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: MockCallSession = {
      id: newSessionId,
      title: `${company || "General"} ${sessionType === "interview" ? "Technical Interview" : "Speech Session"}`,
      company: company || "General Practice",
      jobDescription: jobDescription,
      sessionType: sessionType,
      model: model,
      language: language,
      resumeId: attachedResumeId,
      autoGenerate: true,
      saveTranscript: true,
      status: "active",
      created_at: new Date().toISOString(),
      durationMinutes: 10
    };

    saveMockSession(newSession);
    setShowLimitModal(false);
    
    // Redirect to Live Connection Workspace
    router.push(`/call-session/${newSessionId}`);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Are you sure you want to delete this session record?")) {
      deleteMockSession(id);
      setSessions(getMockSessions());
    }
  };

  return (
    <main className="flex-1 w-full px-6 md:px-10 py-8 flex flex-col gap-6 select-none">
      
      {/* Header section */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <Link 
            href="/dashboard"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition mb-1"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Back to Onboarding
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "var(--font-display)" }}>
            <PhoneCall className="w-8 h-8 text-(--accent)" />
            Call Sessions
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Configure live interview streams or look back at logs and performance telemetry from previous evaluations.
          </p>
        </div>

        <button
          onClick={handleOpenConfig}
          className="bg-(--accent) hover:bg-(--accent-bright) text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg flex items-center gap-2 active:scale-95 transition shadow-sm cursor-pointer shadow-(--accent)/10 animate-pulse-glow"
        >
          <Plus className="w-4 h-4" />
          Start Free Session
        </button>
      </section>

      {/* Main content split */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Active / Previous session logs */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-450" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Sessions & Transcripts Log</h3>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                  No sessions recorded yet. Configure a test session above to explore the live AI copilot overlay.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                      <th className="pb-3.5 pl-2">Session Title</th>
                      <th className="pb-3.5">Target / Company</th>
                      <th className="pb-3.5">AI Engine</th>
                      <th className="pb-3.5">Started At</th>
                      <th className="pb-3.5">Status</th>
                      <th className="pb-3.5 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((sess) => (
                      <tr 
                        key={sess.id}
                        className="border-b border-slate-100/70 last:border-0 hover:bg-slate-50/40 transition duration-150"
                      >
                        <td className="py-4 pl-2 font-bold text-slate-800 flex items-center gap-2">
                          <PhoneCall className={`w-3.5 h-3.5 ${sess.status === "active" ? "text-emerald-500 animate-pulse" : "text-slate-400"}`} />
                          <span>{sess.title}</span>
                        </td>
                        <td className="py-4 text-slate-600">{sess.company}</td>
                        <td className="py-4 text-slate-500 font-mono text-[11px]">{sess.model}</td>
                        <td className="py-4 text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(sess.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                        </td>
                        <td className="py-4">
                          {sess.status === "active" ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-black uppercase px-2 py-0.5 rounded">
                              Active Live
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[8px] font-black uppercase px-2 py-0.5 rounded">
                              Completed
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right pr-2">
                          <div className="flex justify-end gap-2">
                            {sess.status === "active" ? (
                              <Link
                                href={`/call-session/${sess.id}`}
                                className="bg-emerald-600 hover:bg-emerald-750 text-white border border-emerald-600 px-3.5 py-1.5 rounded text-[10px] font-extrabold uppercase tracking-wider active:scale-95 transition flex items-center gap-1"
                              >
                                Connect <Play className="w-2.5 h-2.5 fill-current" />
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="bg-slate-100 text-slate-400 border border-slate-200 px-3.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-not-allowed"
                              >
                                Saved Log
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteSession(sess.id, e)}
                              className="p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 1: Configure Call Parameters */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-6 animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowConfigModal(false)}
              className="text-slate-400 hover:text-slate-650 absolute top-5 right-5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-(--accent)" />
              Call Configuration
            </h3>
            <p className="text-xs text-slate-500 font-semibold mb-5 leading-normal">
              Customize target requirements to pre-load custom STAR prompt cheat sheets and evaluation heuristics.
            </p>

            <form onSubmit={handleProceedToLimits} className="flex flex-col gap-4">
              
              {/* Session type Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Session Objective</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "interview", label: "Technical Interview", desc: "For coding/system design" },
                    { id: "call", label: "Conversational Call", desc: "For behavioral/general chat" }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSessionType(opt.id as any)}
                      className={`p-3 border rounded-xl text-left cursor-pointer transition ${
                        sessionType === opt.id 
                          ? "border-(--accent) bg-(--accent-soft)/20 text-slate-800 shadow-xs" 
                          : "border-slate-200 hover:border-slate-300 text-slate-500"
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[9.5px] font-medium opacity-80 mt-0.5 block">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company & Job Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Company / Target Org</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe, Acme Logistics"
                    className="w-full text-xs font-semibold text-slate-850 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Job Description / Scope Outline (Optional)</label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job details or focus topics here to feed AI Context..."
                    className="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* AI Engine & Language selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100/80 pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">AI Copilot Model Engine</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full text-xs font-bold text-slate-750 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/40 transition"
                  >
                    <option>GPT-4o Mini</option>
                    <option>GPT-4o Core</option>
                    <option>Claude 3.5 Sonnet</option>
                    <option>Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Primary Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full text-xs font-bold text-slate-750 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/40 transition"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>French</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>

              {/* Attached Resume */}
              <div className="flex flex-col gap-1.5 border-t border-slate-100/80 pt-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex justify-between items-center">
                  <span>Attach Candidate Resume Context</span>
                  <Link 
                    href="/dashboard/resumes"
                    className="text-[9px] text-(--accent) hover:underline lowercase font-extrabold"
                  >
                    + Manage CVs
                  </Link>
                </label>

                {resumes.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[10px] font-semibold text-amber-700 leading-normal flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span>No resumes found. The copilot will use default general configurations. Add a CV first for customized answer guides.</span>
                    </div>
                  </div>
                ) : (
                  <select
                    value={attachedResumeId}
                    onChange={(e) => setAttachedResumeId(e.target.value)}
                    className="w-full text-xs font-bold text-slate-755 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/40 transition"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.personalDetails.name || "Unnamed"})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-(--accent) hover:bg-(--accent-bright) text-white rounded-lg font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-(--accent)/10 cursor-pointer flex justify-center items-center gap-1"
              >
                <span>Proceed to Verification</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Limit Warning / Verify HUD */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-6 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLimitModal(false)}
              className="text-slate-400 hover:text-slate-650 absolute top-5 right-5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-rose-100 pb-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-950 uppercase tracking-wide">
                  Trial Limits & Checklists
                </h3>
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">PREPARATION STANDARDS</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex gap-3">
                <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-xs font-bold text-slate-800">10-Minute Free Call Limit</strong>
                  <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                    Free test sessions automatically terminate after 10 minutes. Refill credits to unlock unlimited streaming calls.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex gap-3">
                <FileText className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-xs font-bold text-slate-800">Screen Share Required</strong>
                  <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                    The live workspace requires you to share the target video call tab (with audio enabled) so the AI can transcribe standard questions.
                  </p>
                </div>
              </div>

            </div>

            <button
              onClick={handleCreateSession}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition duration-200 shadow-md shadow-rose-600/10 active:scale-95 cursor-pointer flex justify-center items-center gap-1.5"
            >
              <span>Initialize Live HUD Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
