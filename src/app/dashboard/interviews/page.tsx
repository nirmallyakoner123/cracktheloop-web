"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  History, 
  Loader2, 
  FileText, 
  ExternalLink,
  Sparkles,
  Search,
  Calendar,
  MessageSquare
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
    <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-8 relative">
      
      {/* Title block */}
      <section className="flex flex-col gap-2">
        <span className="text-[10px] text-sky-400 font-black uppercase tracking-widest">User Dashboard</span>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          Saved Session History
        </h1>
        <p className="text-xs text-slate-500 font-medium">Browse transcripts, technical grading metrics, and AI recommendations.</p>
      </section>

      {/* Main Table view */}
      <section className="glow-card rounded-2xl p-6 md:p-8 bg-[#0c1125]/90 border border-white/5 flex flex-col gap-6">
        
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
          <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            Interview Transcripts
          </h2>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role or company..."
              className="w-full bg-[#050711] border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white pl-9 focus:outline-none focus:border-sky-450 transition font-medium"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <span className="text-3xl">🎙️</span>
            {searchQuery ? (
              <p className="text-slate-400 text-xs font-semibold">No interviews match your search term.</p>
            ) : (
              <>
                <p className="text-slate-400 text-sm font-semibold">No interview sessions recorded yet.</p>
                <p className="text-slate-500 text-xs max-w-sm leading-relaxed font-medium mt-0.5">
                  Activate the Web Copilot HUD or Desktop app during your live interview sessions, and click "Save Session" to compile your transcripts here.
                </p>
                <a
                  href="/copilot"
                  className="mt-2 px-5 py-2.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md hover:brightness-110 transition active:scale-95 cursor-pointer"
                >
                  Open Copilot HUD
                </a>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Role Title</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Date Recorded</th>
                  <th className="py-3.5 px-4">Spoken Turns</th>
                  <th className="py-3.5 px-4">Overall Grade</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-slate-350">
                {filteredInterviews.map((session) => (
                  <tr key={session._id} className="hover:bg-white/2 transition">
                    <td className="py-4 px-4 font-bold text-white select-text">{session.role}</td>
                    <td className="py-4 px-4 text-slate-400 select-text">{session.company || "General"}</td>
                    <td className="py-4 px-4 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(session.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-sky-500/10 text-sky-400 px-2.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider flex items-center gap-1 w-fit">
                        <MessageSquare className="w-3 h-3" /> {session.transcript?.length || 0} Turns
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {session.report ? (
                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-black text-[10px] flex items-center gap-1 w-fit">
                          ★ {session.report.overall_score}/100
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[10px]">Not Evaluated</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => router.push(`/dashboard/interviews/${session._id}`)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5 ml-auto text-[10px] font-black uppercase tracking-wider"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> 
                        Report Details 
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
