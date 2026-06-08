"use client";

import { useState } from "react";
import { FileText, Briefcase, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Filter } from "lucide-react";
import Navbar from "../../components/landing/Navbar";
import CtaFooter from "../../components/landing/CtaFooter";
import Faq from "../../components/landing/Faq";

export default function ResumeJdAlignmentContent() {
  const [selectedKeyword, setSelectedKeyword] = useState<string>("api-integration");

  const jdKeywords = [
    { id: "api-integration", label: "API Integration", category: "Core Backend" },
    { id: "react-nextjs", label: "React / Next.js", category: "Frontend Stack" },
    { id: "scalability", label: "System Scalability", category: "Infrastructure" },
    { id: "team-leadership", label: "Stakeholder Alignment", category: "Soft Skills" },
  ];

  const resumeBulletPoints: Record<string, { project: string; points: string[]; match: string }> = {
    "api-integration": {
      project: "E-commerce Payment Gateway Refactor",
      match: "98% Match Relevance",
      points: [
        "Integrated payment gateways using webhooks, securing 100% transactional reliability.",
        "Designed asynchronous task queues to handle checkout retry logic for 50k+ daily transactions.",
        "Refactored JSON payload processing to shave 200ms off database checkout response paths."
      ]
    },
    "react-nextjs": {
      project: "Analytics Dashboard Migration",
      match: "95% Match Relevance",
      points: [
        "Migrated customer dashboard to Next.js, boosting organic page speed scores from 55 to 94.",
        "Leveraged server components to reduce bundle sizes by 40% and eliminate layout shift.",
        "Implemented dynamic code splitting and clean loading states for a smoother UI experience."
      ]
    },
    "scalability": {
      project: "Distributed Media Ingestion Pipeline",
      match: "92% Match Relevance",
      points: [
        "Redesigned media compression pipeline, reducing backend operational costs by 35%.",
        "Set up Redis caching layers, scaling request load tolerance from 1k to 10k RPS.",
        "Leveraged horizontal database scaling and read replicas to drop memory usage spikes by 60%."
      ]
    },
    "team-leadership": {
      project: "Legacy Platform Modernization",
      match: "88% Match Relevance",
      points: [
        "Led cross-functional team of 6 engineers to deliver modernized app ahead of schedule.",
        "Implemented structured RFC process to align engineering and product objectives.",
        "Mentored junior engineers on clean-code patterns, improving review cycle speeds by 25%."
      ]
    }
  };

  const starOutlines: Record<string, { s: string; t: string; a: string; r: string }> = {
    "api-integration": {
      s: "Payment checkout system was failing during flash sales due to high concurrent API request spikes.",
      t: "Implement secure payment retry logic and reduce payment API handler response overhead.",
      a: "Built asynchronous BullMQ queues, structured webhook listeners, and optimized checkout database write query loops.",
      r: "Eliminated checkout timeout exceptions entirely and reduced processing times by 200ms, recovering $45k/mo in abandoned carts."
    },
    "react-nextjs": {
      s: "The customer dashboard bundle size was 4.2MB, resulting in a sluggish 5-second initial load time.",
      t: "Rebuild dashboard structure to load under 1.5 seconds and optimize SEO structure metrics.",
      a: "Migrated dashboard routes to Next.js, isolated static elements in RSCs, and applied aggressive bundle splits.",
      r: "Reduced bundle download size by 40%, boosting Lighthouse mobile speed scores to 94 and initial page load to 1.1s."
    },
    "scalability": {
      s: "Sudden marketing campaign spikes crashed feed servers under 1,200 concurrent user requests.",
      t: "Scale API ingestion paths to withstand 10,000+ Requests Per Second under tight budget caps.",
      a: "Offloaded media tasks to serverless nodes, set up Redis caches, and established read-only DB replicas.",
      r: "Successfully sustained 10k RPS load tests at 0.05% error rate while decreasing operational server costs by 35%."
    },
    "team-leadership": {
      s: "Legacy codebase rewrite was stalled due to conflicting design visions between design and backend teams.",
      t: "Establish development alignment, rebuild project velocity, and deliver within a 6-week release window.",
      a: "Introduced strict RICE metrics to resolve disputes and implemented technical RFCs to document decisions.",
      r: "Shipped the complete refactored platform 3 days early with 94% stakeholder satisfaction rates."
    }
  };

  const customFaqs = [
    {
      q: "What file formats are supported for resume uploads?",
      a: "We support standard text-based formats including PDF and Microsoft Word (.docx). The system automatically parses layouts, work history, and achievements.",
    },
    {
      q: "How does the matching algorithm select which project is relevant?",
      a: "CrackTheLoop processes the semantic context of your resume and the target job description. When an interviewer asks a question, our context engine matches the topic to your exact achievements, showing you the best talking points.",
    },
    {
      q: "Is my resume data secure?",
      a: "Yes. All resumes and job description uploads are stored locally in secure transient containers during your active session. We never sell, log, or store your private career details on our servers.",
    },
    {
      q: "Can I configure multiple target profiles for different roles?",
      a: "Yes. You can upload different versions of your resume and save multiple job descriptions. Easily toggle profiles inside the dashboard based on the target role.",
    },
    {
      q: "Can I customize the suggestions in real-time?",
      a: "Absolutely. You can edit the matched metric points, rewrite key details, or add custom reminders inside the dashboard. The assistant will prioritize your adjustments."
    }
  ];

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6 select-none">
        <div className="inline-flex items-center gap-2 bg-(--accent-soft) border border-(--accent)/20 px-4 py-1.5 rounded-full text-xs font-semibold text-(--accent)">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Smart Context Alignment
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-(--text-primary) leading-none max-w-3xl font-display" style={{ fontFamily: "var(--font-display)" }}>
          Your Resume, Surfaced at the <br />
          <span className="text-gradient-coral">Exact Right Moment</span>
        </h1>
        <p className="text-(--text-muted) text-base md:text-lg max-w-2xl leading-relaxed">
          When interviewers ask about a topic, we surface yourpayment refactoring project - not a generic template. Speak about your actual impact, naturally.
        </p>
      </section>

      {/* Interactive Keyword Matcher Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white border border-(--border-light) rounded-[20px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center border-b border-slate-100 pb-5 mb-8 gap-4 select-none">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
                <Filter className="w-5 h-5 text-(--accent)" /> Relevance Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-1">Select a key job requirement below to preview how our matching system surfaces your relevant experience.</p>
            </div>
            {/* Horizontal tab selectors */}
            <div className="flex flex-wrap gap-2">
              {jdKeywords.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKeyword(k.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${selectedKeyword === k.id
                      ? "bg-(--accent) text-white shadow-sm"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Card: Extracted Resume Project */}
            <div className="bg-slate-50/50 border border-slate-200/70 rounded-[12px] p-6 flex flex-col justify-between select-none">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wide text-slate-400">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Matched Experience
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-2 py-0.5 rounded-full">
                    {resumeBulletPoints[selectedKeyword].match}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-3">{resumeBulletPoints[selectedKeyword].project}</h3>
                <ul className="space-y-3">
                  {resumeBulletPoints[selectedKeyword].points.map((pt, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600 leading-relaxed font-medium">
                      <span className="text-(--accent) font-bold mt-0.5 shrink-0">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-slate-200/60 pt-4 text-[10px] font-mono text-slate-450">
                ✓ Extracted from: Work History Section
              </div>
            </div>

            {/* Right Card: Live STAR Suggestions */}
            <div className="bg-white border border-(--border-light) rounded-[12px] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-(--accent)/3 rounded-full blur-2xl" />
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wide text-(--accent) mb-4">
                  <Briefcase className="w-4 h-4 text-(--accent)" />
                  Live STAR Answer Outline
                </span>

                <div className="space-y-3.5 font-medium">
                  {[
                    { label: "S", name: "Situation", val: starOutlines[selectedKeyword].s },
                    { label: "T", name: "Task", val: starOutlines[selectedKeyword].t },
                    { label: "A", name: "Action", val: starOutlines[selectedKeyword].a },
                    { label: "R", name: "Result", val: starOutlines[selectedKeyword].r },
                  ].map((item) => (
                    <div key={item.label} className="text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                        <span className="w-4 h-4 bg-(--accent-soft) text-(--accent) rounded-full flex items-center justify-center text-[9px] font-black">{item.label}</span>
                        <span>{item.name}</span>
                      </div>
                      <p className="text-slate-600 leading-normal pl-5">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-white border border-(--border-light) rounded-[20px] p-8 shadow-sm flex flex-col gap-5 select-none">
          <span className="text-[10px] text-(--accent) font-mono font-bold tracking-widest uppercase">Ethics & privacy guarantee</span>
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
            <p>
              Many tools store resumes globally to train their public models. At CrackTheLoop, we run a secure, stateless document parser.
            </p>
            <div className="flex gap-2.5 items-start">
              <span className="w-2 h-2 rounded-full bg-(--accent) mt-1.5 shrink-0" />
              <span><strong>Secure Connections:</strong> All uploads are encrypted using secure protocols to prevent interception.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-2 h-2 rounded-full bg-(--accent) mt-1.5 shrink-0" />
              <span><strong>No Model Training:</strong> Your private work metrics are never shared, logged, or saved to public database systems.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-2 h-2 rounded-full bg-(--accent) mt-1.5 shrink-0" />
              <span><strong>Stateless Storage:</strong> Resumes and JDs are processed in-memory during active sessions, and automatically wiped the moment you log off.</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-6 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
            Never Guess What <br />
            <span className="text-gradient-coral">Interviewers Look For</span>
          </h2>
          <p className="text-(--text-muted) text-sm leading-relaxed mb-6 font-medium">
            Interviewers judge answers based on specific skill keywords and structured frameworks (like STAR). Our matching engine scans the job description, pulls these requirements, and highlights them directly within your dashboard suggestions.
          </p>
          <ul className="space-y-3.5 text-xs text-slate-700 font-medium select-none">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Highlights STAR framework structures for a concise delivery.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Surfaces precise metrics (percentages, numbers) from your resume.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matches specific technologies, methodologies, and soft skills listed in the target JD.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Feature Custom FAQ Section */}
      <Faq faqList={customFaqs} />

      {/* CTA Footer */}
      <CtaFooter />
    </div>
  );
}
