"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  History, 
  Loader2, 
  FileText, 
  ExternalLink,
  Sparkles,
  Search,
  Calendar,
  MessageSquare,
  Mic,
  ArrowRight
} from "lucide-react";

export default function InterviewsListPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("ctl_token");
    if (!savedToken) {
      router.push("/login");
      return;
    }

    async function loadInterviews() {
      try {
        const res = await fetch("/api/interviews", {
          headers: { "Authorization": `Bearer ${savedToken}` }
        });
        const data = await res.json();
        if (res.ok) {
          setInterviews(data.interviews || []);
          setFilteredInterviews(data.interviews || []);
        }
      } catch (err) {
        console.error("Failed to load interview sessions", err);
      } finally {
        setLoading(false);
      }
    }

    loadInterviews();
  }, [router]);

  // Handle local searching of interviews
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredInterviews(interviews);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredInterviews(
        interviews.filter(item => 
          item.role?.toLowerCase().includes(q) || 
          item.company?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, interviews]);

  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5 md:py-6 flex flex-col gap-6 relative select-none">
      
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-(--accent)/3 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/3 blur-[120px]"></div>
      </div>

      {/* Title block */}
      <section className="flex flex-col gap-2">
        <span className="text-[10px] text-(--accent) font-black uppercase tracking-widest">
          User Dashboard
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          Saved Session History
        </h1>
        <p className="text-xs text-slate-500 font-medium">Browse transcripts, technical grading metrics, and AI recommendations.</p>
      </section>

      {/* Main Table view */}
      <section className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 flex flex-col gap-5 shadow-sm relative z-10">
        
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <History className="w-5 h-5 text-(--accent)" />
            Interview Transcripts
          </h2>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role or company..."
              className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-xs text-slate-800 pl-10 focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/10 transition font-bold shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50/50 border border-red-100 flex items-center justify-center text-[#E8503A] shadow-sm mb-2">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            {searchQuery ? (
              <p className="text-slate-500 text-xs font-bold">No interviews match your search term.</p>
            ) : (
              <>
                <h3 className="text-slate-800 text-sm font-black uppercase tracking-wider">No Sessions Recorded Yet</h3>
                <p className="text-slate-500 text-xs max-w-sm leading-relaxed font-semibold mt-0.5">
                  Activate the Web Copilot HUD or Desktop app during your live interview sessions, and click "Save Session" to compile your transcripts here.
                </p>
                <Link
                  href="/copilot"
                  className="mt-3 px-5 py-2.5 bg-[#E8503A] hover:bg-[#F06B57] rounded-lg font-bold text-xs uppercase tracking-wider text-white shadow-md shadow-[#E8503A]/10 hover:brightness-110 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  Open Copilot HUD <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-5">Role Title</th>
                  <th className="py-4 px-5">Company</th>
                  <th className="py-4 px-5">Date Recorded</th>
                  <th className="py-4 px-5">Spoken Turns</th>
                  <th className="py-4 px-5">Overall Grade</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 font-semibold text-slate-600">
                {filteredInterviews.map((session) => {
                  const score = session.report?.overall_score;
                  let scoreBadge = null;
                  
                  if (score !== undefined) {
                    if (score >= 85) {
                      scoreBadge = (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full font-extrabold text-[10px] flex items-center gap-1.5 w-fit shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {score}/100 (Expert)
                        </span>
                      );
                    } else if (score >= 70) {
                      scoreBadge = (
                        <span className="bg-teal-50 text-teal-700 border border-teal-200/80 px-2.5 py-1 rounded-full font-extrabold text-[10px] flex items-center gap-1.5 w-fit shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          {score}/100 (Strong)
                        </span>
                      );
                    } else if (score >= 50) {
                      scoreBadge = (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-full font-extrabold text-[10px] flex items-center gap-1.5 w-fit shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {score}/100 (Average)
                        </span>
                      );
                    } else {
                      scoreBadge = (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-1 rounded-full font-extrabold text-[10px] flex items-center gap-1.5 w-fit shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {score}/100 (Needs Improvement)
                        </span>
                      );
                    }
                  } else {
                    scoreBadge = (
                      <span className="bg-slate-50 text-slate-400 border border-slate-200/60 px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                        Not Evaluated
                      </span>
                    );
                  }

                  return (
                    <tr key={session._id} className="hover:bg-slate-50/70 transition-all duration-200 group">
                      <td className="py-4.5 px-5 font-bold text-slate-800 select-text text-sm">
                        {session.role}
                      </td>
                      <td className="py-4.5 px-5 text-slate-500 font-bold select-text">
                        {session.company || "General"}
                      </td>
                      <td className="py-4.5 px-5 text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(session.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </td>
                      <td className="py-4.5 px-5">
                        <span className="bg-indigo-50/60 text-indigo-700 border border-indigo-100/80 px-2.5 py-1 rounded-full font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 w-fit">
                          <MessageSquare className="w-3 h-3 text-indigo-600" /> {session.transcript?.length || 0} Turns
                        </span>
                      </td>
                      <td className="py-4.5 px-5">
                        {scoreBadge}
                      </td>
                      <td className="py-4.5 px-5 text-right">
                        <button
                          onClick={() => router.push(`/dashboard/interviews/${session._id}`)}
                          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm group-hover:border-slate-300 group-hover:shadow-md"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" /> 
                          Report Details 
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-650 transition-colors" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
