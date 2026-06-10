"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  FileUp, 
  FileEdit, 
  AlertTriangle, 
  Loader2, 
  CheckCircle,
  Briefcase,
  GraduationCap,
  Calendar,
  ChevronRight,
  ArrowLeft,
  X
} from "lucide-react";
import Link from "next/link";
import { 
  getMockResumes, 
  saveMockResume, 
  deleteMockResume, 
  MockResume 
} from "@/lib/mockService";

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<MockResume[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfFile, setPdfFile] = useState<{ name: string; size: string } | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  
  // Parsing state simulator
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);
  const [parsingProgress, setParsingProgress] = useState(0);

  const parsingSteps = [
    "Reading file bytes and extracting raw text...",
    "Identifying resume structural sections...",
    "Parsing contact details, employment history, and education...",
    "Aligning qualifications with CrackTheLoop system schemas...",
    "Finalizing parsed resume profiles..."
  ];

  useEffect(() => {
    setResumes(getMockResumes());
    setLoading(false);
  }, []);

  const handleOpenMethodSelect = () => {
    setShowMethodModal(true);
  };

  const handleSelectManual = () => {
    const newId = `resume-${Date.now()}`;
    const newResume: MockResume = {
      id: newId,
      title: "Untitled Resume",
      personalDetails: {
        name: "",
        email: "",
        phone: "",
        address: ""
      },
      summary: "",
      education: [],
      workExperience: [],
      otherExperience: [],
      created_at: new Date().toISOString()
    };
    saveMockResume(newResume);
    setShowMethodModal(false);
    router.push(`/dashboard/resumes/${newId}`);
  };

  const handleSelectPdf = () => {
    setShowMethodModal(false);
    setShowPdfModal(true);
    setPdfFile(null);
    setPdfTitle("");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setPdfFile({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB" });
        setPdfTitle(file.name.replace(/\.[^/.]+$/, ""));
      } else {
        alert("Please drop a valid PDF file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB" });
      setPdfTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleStartParsing = () => {
    if (!pdfFile) return;
    setIsParsing(true);
    setParsingStep(0);
    setParsingProgress(0);

    // Simulate parsing over 2.5s with step updates
    const duration = 2500;
    const intervalTime = 50;
    const stepsCount = parsingSteps.length;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setParsingProgress(progress);

      const stepIndex = Math.min(
        Math.floor((progress / 100) * stepsCount),
        stepsCount - 1
      );
      setParsingStep(stepIndex);

      if (elapsed >= duration) {
        clearInterval(interval);
        
        // Save mock parsed resume
        const newId = `resume-${Date.now()}`;
        const newResume: MockResume = {
          id: newId,
          title: pdfTitle || "Parsed Resume",
          personalDetails: {
            name: "Nirmallya Koner",
            email: "nirmallya@example.com",
            phone: "+91 99999 88888",
            address: "Kolkata, India"
          },
          summary: "Passionate Full Stack Developer with experience in Next.js, Node.js, and cloud engineering. Specialized in building premium user interfaces and real-time streaming tools.",
          education: [
            {
              school: "Jadavpur University",
              degree: "Bachelor of Engineering",
              fieldOfStudy: "Computer Science & Engineering",
              startDate: "2020",
              endDate: "2024",
              description: "Focused on Software Architecture, Web Security, and Distributed Systems."
            }
          ],
          workExperience: [
            {
              company: "Innovate Labs",
              position: "Frontend Engineering Intern",
              startDate: "2023-05",
              endDate: "2023-11",
              location: "Remote",
              description: "Developed and optimized key features of a SaaS platform using Next.js 13 App Router, resulting in a 20% improve in page load speeds."
            }
          ],
          otherExperience: [
            {
              title: "Open Source Contributor",
              description: "Contributed code modifications and UI components to UI library packages."
            }
          ],
          created_at: new Date().toISOString()
        };
        
        saveMockResume(newResume);
        
        setTimeout(() => {
          setIsParsing(false);
          setShowPdfModal(false);
          router.push(`/dashboard/resumes/${newId}`);
        }, 300);
      }
    }, intervalTime);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Are you sure you want to delete this resume?")) {
      deleteMockResume(id);
      setResumes(getMockResumes());
    }
  };

  return (
    <main className="flex-1 w-full px-6 md:px-10 py-8 flex flex-col gap-6">
      
      {/* Header */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <Link 
            href="/dashboard"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Onboarding
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "var(--font-display)" }}>
            <FileText className="w-8 h-8 text-(--accent)" />
            CVs & Resumes
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your resumes. The AI Copilot uses active resumes to tailor live guidance to your actual work history.
          </p>
        </div>

        <button
          onClick={handleOpenMethodSelect}
          className="bg-(--accent) hover:bg-(--accent-bright) text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg flex items-center gap-2 active:scale-95 transition shadow-sm cursor-pointer shadow-(--accent)/10"
        >
          <Plus className="w-4 h-4" />
          Add Resume
        </button>
      </section>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
        </div>
      ) : resumes.length === 0 ? (
        /* Empty State */
        <section className="flex-1 flex flex-col items-center justify-center py-16 px-6 bg-white border border-slate-200/60 rounded-2xl shadow-xs text-center max-w-2xl mx-auto w-full gap-6">
          <div className="w-16 h-16 rounded-full bg-(--accent-soft) flex items-center justify-center text-(--accent) animate-pulse border border-(--accent)/10">
            <FileText className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">No Resumes Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
              Uploading a resume is optional but highly recommended. It unlocks tailored, company-specific cheat sheets and allows the AI to suggest stories matching your past work.
            </p>
          </div>
          <button
            onClick={handleOpenMethodSelect}
            className="bg-(--accent) hover:bg-(--accent-bright) text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-md shadow-(--accent)/10"
          >
            <Upload className="w-4 h-4" />
            Upload Your First Resume
          </button>
        </section>
      ) : (
        /* Grid list of Resumes */
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumes.map((resume) => (
            <Link
              key={resume.id}
              href={`/dashboard/resumes/${resume.id}`}
              className="bg-white border border-slate-250 border-slate-200/80 hover:border-(--accent)/40 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5 group cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-(--accent-soft) text-(--accent) rounded-lg flex items-center justify-center shrink-0 border border-(--accent)/5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-(--accent) transition duration-150">
                        {resume.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                        Added {new Date(resume.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(resume.id, e)}
                    className="p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {resume.personalDetails.name && (
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-semibold">
                    <div>
                      <span className="text-slate-400 font-medium">Candidate: </span>
                      <span className="text-slate-700">{resume.personalDetails.name}</span>
                    </div>
                    {resume.personalDetails.email && (
                      <div>
                        <span className="text-slate-400 font-medium">Email: </span>
                        <span className="text-slate-700 truncate block sm:inline">{resume.personalDetails.email}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-counts visualization */}
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-450" /> {resume.workExperience.length} Jobs</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-slate-450" /> {resume.education.length} Edu</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100/70 pt-3 text-[10px] font-extrabold uppercase tracking-wider text-(--accent) group-hover:translate-x-0.5 transition duration-200">
                <span>Configure & Edit details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Modal 1: Selection Method Selection */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-6 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowMethodModal(false)}
              className="text-slate-400 hover:text-slate-600 absolute top-5 right-5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-800 uppercase tracking-wide mb-2">
              Select Resume Method
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
              Choose how you want to add your credentials to the CrackTheLoop platform.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleSelectPdf}
                className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-(--accent)/30 rounded-xl transition duration-200 cursor-pointer flex gap-4 items-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-(--accent-soft) text-(--accent) flex items-center justify-center shrink-0 border border-(--accent)/5 group-hover:scale-105 transition duration-200">
                  <FileUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">Simulate PDF Parser</h4>
                  <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-0.5">
                    Drop a PDF file to run our mock structural parser and extract skills.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition duration-200" />
              </button>

              <button
                onClick={handleSelectManual}
                className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-(--accent)/30 rounded-xl transition duration-200 cursor-pointer flex gap-4 items-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-105 transition duration-200">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">Create Manually</h4>
                  <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-0.5">
                    Start with a clean template and fill in your details step-by-step.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition duration-200" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: PDF Dropzone and Simulator */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-6 animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-250 border-slate-200 rounded-2xl p-6 shadow-2xl relative">
            
            {/* Display loader if isParsing */}
            {isParsing ? (
              <div className="py-8 flex flex-col items-center justify-center gap-6 select-none">
                <div className="relative flex items-center justify-center">
                  <Loader2 className="w-14 h-14 text-(--accent) animate-spin" />
                  <FileText className="w-6 h-6 text-(--accent) absolute" />
                </div>

                <div className="flex flex-col gap-2 text-center w-full max-w-xs">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    Simulating AI Resume Parsing
                  </h4>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed h-10 flex items-center justify-center px-2">
                    {parsingSteps[parsingStep]}
                  </p>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative border border-slate-200/50">
                  <div
                    className="bg-gradient-to-r from-(--accent) to-indigo-500 h-full rounded-full transition-all duration-75"
                    style={{ width: `${parsingProgress}%` }}
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[10.5px] text-amber-800 font-bold max-w-sm">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-600" />
                  <span>Do not reload the browser or exit this tab. Parsing resumes takes a few moments.</span>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="text-slate-400 hover:text-slate-650 absolute top-5 right-5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-black text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-(--accent)" />
                  Upload PDF Resume
                </h3>
                <p className="text-xs text-slate-500 font-semibold mb-5 leading-normal">
                  Mock the upload process of a CV/Resume PDF. Supported extension: `.pdf` (Max 10MB)
                </p>

                <div className="flex flex-col gap-4">
                  {/* Dropzone area */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-colors select-none ${
                      pdfFile 
                        ? "border-emerald-400 bg-emerald-50/10" 
                        : "border-slate-200 hover:border-(--accent)/35 bg-slate-50/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
                      pdfFile 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-250" 
                        : "bg-white text-slate-400 border-slate-200"
                    }`}>
                      <FileUp className="w-6 h-6" />
                    </div>

                    {pdfFile ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{pdfFile.name}</span>
                        <span className="text-[10px] text-slate-450 font-semibold uppercase">{pdfFile.size}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-slate-700">Drag & drop your PDF resume here</span>
                        <span className="text-[10.5px] text-slate-450 font-semibold">or click below to browse files</span>
                      </div>
                    )}

                    <label className="mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 transition">
                      Browse Files
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Optional File Title Override */}
                  {pdfFile && (
                    <div className="flex flex-col gap-1.5 animate-fade-in">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Resume Record Title
                      </label>
                      <input
                        type="text"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer CV"
                        className="w-full text-xs font-bold text-slate-850 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition"
                      />
                    </div>
                  )}

                  <button
                    disabled={!pdfFile}
                    onClick={handleStartParsing}
                    className={`w-full py-3.5 rounded-lg text-center font-bold text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center gap-1.5 ${
                      pdfFile
                        ? "bg-(--accent) hover:bg-(--accent-bright) text-white cursor-pointer shadow-md shadow-(--accent)/10 active:scale-95"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                  >
                    <span>Start Simulated Parse</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
