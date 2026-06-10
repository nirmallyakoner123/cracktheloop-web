"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Loader2, 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderPlus,
  Sparkles,
  Info
} from "lucide-react";
import Link from "next/link";
import { 
  getMockResumeById, 
  saveMockResume, 
  MockResume 
} from "@/lib/mockService";

export default function ResumeEditorPage() {
  const router = useRouter();
  const params = useParams();
  const resumeId = params.resumeId as string;

  const [resume, setResume] = useState<MockResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  
  // Active editing section scrolling helper
  const [activeSection, setActiveSection] = useState("personal");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const data = getMockResumeById(resumeId);
    if (data) {
      setResume(data);
    } else {
      router.push("/dashboard/resumes");
    }
    setLoading(false);
  }, [resumeId, router]);

  // Debounced auto-save simulator
  const triggerAutoSave = (updatedResume: MockResume) => {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveMockResume(updatedResume);
      setSaveStatus("saved");
    }, 700);
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-20 bg-(--bg-mist)">
        <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  // Input change handlers
  const handleTitleChange = (val: string) => {
    const updated = { ...resume, title: val };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handlePersonalChange = (field: keyof MockResume["personalDetails"], val: string) => {
    const updated = {
      ...resume,
      personalDetails: {
        ...resume.personalDetails,
        [field]: val
      }
    };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleSummaryChange = (val: string) => {
    const updated = { ...resume, summary: val };
    setResume(updated);
    triggerAutoSave(updated);
  };

  // Education array handlers
  const handleAddEducation = () => {
    const updated = {
      ...resume,
      education: [
        ...resume.education,
        {
          school: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEdu = [...resume.education];
    updatedEdu.splice(index, 1);
    const updated = { ...resume, education: updatedEdu };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleEducationChange = (index: number, field: string, val: string) => {
    const updatedEdu = [...resume.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: val };
    const updated = { ...resume, education: updatedEdu };
    setResume(updated);
    triggerAutoSave(updated);
  };

  // Work experience array handlers
  const handleAddWork = () => {
    const updated = {
      ...resume,
      workExperience: [
        ...resume.workExperience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          location: "",
          description: ""
        }
      ]
    };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleRemoveWork = (index: number) => {
    const updatedWork = [...resume.workExperience];
    updatedWork.splice(index, 1);
    const updated = { ...resume, workExperience: updatedWork };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleWorkChange = (index: number, field: string, val: string) => {
    const updatedWork = [...resume.workExperience];
    updatedWork[index] = { ...updatedWork[index], [field]: val };
    const updated = { ...resume, workExperience: updatedWork };
    setResume(updated);
    triggerAutoSave(updated);
  };

  // Other experience array handlers
  const handleAddOther = () => {
    const updated = {
      ...resume,
      otherExperience: [
        ...resume.otherExperience,
        {
          title: "",
          description: ""
        }
      ]
    };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleRemoveOther = (index: number) => {
    const updatedOther = [...resume.otherExperience];
    updatedOther.splice(index, 1);
    const updated = { ...resume, otherExperience: updatedOther };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleOtherChange = (index: number, field: string, val: string) => {
    const updatedOther = [...resume.otherExperience];
    updatedOther[index] = { ...updatedOther[index], [field]: val };
    const updated = { ...resume, otherExperience: updatedOther };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const sections = [
    { id: "personal", label: "Candidate Profile", icon: User },
    { id: "work", label: "Job Experience", icon: Briefcase },
    { id: "education", label: "Education History", icon: GraduationCap },
    { id: "projects", label: "Projects & Contributions", icon: FolderPlus }
  ];

  return (
    <main className="flex-1 w-full px-6 md:px-10 py-6 flex flex-col gap-6 select-none">
      
      {/* Top action row */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/resumes"
            className="p-2 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition"
            title="Back to Resumes"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex flex-col gap-1">
            <input 
              type="text" 
              value={resume.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-lg font-black text-slate-800 focus:outline-none border-b border-transparent focus:border-(--accent)/40 pb-0.5 max-w-sm"
              placeholder="Resume Title"
            />
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Editor Console Mode</p>
          </div>
        </div>

        {/* Auto-save telemetry */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-lg font-bold text-xs select-none shrink-0 self-start sm:self-center">
          {saveStatus === "saving" ? (
            <div className="flex items-center gap-1.5 text-amber-600">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Autosaving changes...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Changes saved locally</span>
            </div>
          )}
        </div>
      </section>

      {/* Editor Split Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar Index (Fixed on Desktop) */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-xl p-4 flex flex-col gap-2.5 shadow-xs sticky top-6">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest px-3 mb-1">Resume Sections</span>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isCurrent = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  const el = document.getElementById(`section-${sec.id}`);
                  if (el) {
                    const container = el.closest(".overflow-y-auto");
                    if (container) {
                      let top = 0;
                      let current: HTMLElement | null = el;
                      while (current && current !== container && container.contains(current)) {
                        top += current.offsetTop;
                        current = current.offsetParent as HTMLElement | null;
                      }
                      container.scrollTo({
                        top: top - 20, // 20px padding from the top for aesthetics
                        behavior: "smooth"
                      });
                    } else {
                      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                    }
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition duration-150 border text-left cursor-pointer ${
                  isCurrent 
                    ? "bg-(--accent-soft) text-(--accent) border-(--accent)/15 shadow-xs" 
                    : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? "text-(--accent)" : "text-slate-400"}`} />
                {sec.label}
              </button>
            );
          })}

          <div className="border-t border-slate-100 pt-3.5 mt-2 flex flex-col gap-2">
            <div className="flex gap-2 items-start p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[10.5px] leading-relaxed text-indigo-900 font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>We stream resume properties dynamically into your live interview transcript dashboard to align answers.</span>
            </div>
          </div>
        </div>

        {/* Dynamic Form Editor Pane */}
        <div className="lg:col-span-3 flex flex-col gap-6 pb-20">
          
          {/* Section 1: Personal Profile */}
          <div 
            id="section-personal"
            className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-5 scroll-mt-6"
          >
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-(--accent)" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Candidate Profile Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Candidate Full Name</label>
                <input 
                  type="text" 
                  value={resume.personalDetails.name}
                  onChange={(e) => handlePersonalChange("name", e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition"
                  placeholder="e.g. Nirmallya Koner"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Primary Email Address</label>
                <input 
                  type="email" 
                  value={resume.personalDetails.email}
                  onChange={(e) => handlePersonalChange("email", e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition"
                  placeholder="e.g. name@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Phone / Mobile Line</label>
                <input 
                  type="text" 
                  value={resume.personalDetails.phone}
                  onChange={(e) => handlePersonalChange("phone", e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition"
                  placeholder="e.g. +91 99999 88888"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Location / City State</label>
                <input 
                  type="text" 
                  value={resume.personalDetails.address}
                  onChange={(e) => handlePersonalChange("address", e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition"
                  placeholder="e.g. Kolkata, India"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-slate-100/50 pt-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Executive Career Summary</label>
              <textarea 
                rows={4}
                value={resume.summary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 focus:bg-white transition resize-none leading-relaxed"
                placeholder="Write a brief overview of your skills, core strengths, and industry experience..."
              />
            </div>
          </div>

          {/* Section 2: Work Experience */}
          <div 
            id="section-work"
            className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-6 scroll-mt-6"
          >
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-(--accent)" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Work Experience</h3>
              </div>
              
              <button
                onClick={handleAddWork}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 border border-slate-250/70 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            {resume.workExperience.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold">No work experience entries added yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {resume.workExperience.map((work, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-slate-50/50 border border-slate-200/80 rounded-xl flex flex-col gap-4 relative"
                  >
                    <button
                      onClick={() => handleRemoveWork(idx)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[10px] font-bold text-(--accent) bg-(--accent-soft) px-2.5 py-0.5 rounded border border-(--accent)/10 self-start">
                      Position #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Company Name</label>
                        <input 
                          type="text" 
                          value={work.company}
                          onChange={(e) => handleWorkChange(idx, "company", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Acme Corp"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Role Title</label>
                        <input 
                          type="text" 
                          value={work.position}
                          onChange={(e) => handleWorkChange(idx, "position", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-855 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Senior Systems Architect"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Start Date</label>
                        <input 
                          type="text" 
                          value={work.startDate}
                          onChange={(e) => handleWorkChange(idx, "startDate", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Jan 2022"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">End Date</label>
                        <input 
                          type="text" 
                          value={work.endDate}
                          onChange={(e) => handleWorkChange(idx, "endDate", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Present"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Location</label>
                        <input 
                          type="text" 
                          value={work.location}
                          onChange={(e) => handleWorkChange(idx, "location", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Remote / San Francisco, CA"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Responsibilities & Accomplishments</label>
                        <textarea 
                          rows={3}
                          value={work.description}
                          onChange={(e) => handleWorkChange(idx, "description", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition resize-none leading-relaxed"
                          placeholder="- Spearheaded backend migration to Redis Pub/Sub cluster..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Education */}
          <div 
            id="section-education"
            className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-6 scroll-mt-6"
          >
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-(--accent)" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Education History</h3>
              </div>
              
              <button
                onClick={handleAddEducation}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 border border-slate-250/70 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Education
              </button>
            </div>

            {resume.education.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold">No education entries added yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {resume.education.map((edu, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-slate-50/50 border border-slate-200/80 rounded-xl flex flex-col gap-4 relative"
                  >
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove education"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100 self-start">
                      Education #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Institution Name</label>
                        <input 
                          type="text" 
                          value={edu.school}
                          onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Stanford University"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Degree Awarded</label>
                        <input 
                          type="text" 
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-855 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Bachelor of Science"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Field of Study</label>
                        <input 
                          type="text" 
                          value={edu.fieldOfStudy}
                          onChange={(e) => handleEducationChange(idx, "fieldOfStudy", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Computer Science"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Timeline Dates</label>
                        <input 
                          type="text" 
                          value={`${edu.startDate ? edu.startDate + " - " : ""}${edu.endDate || ""}`}
                          onChange={(e) => {
                            const val = e.target.value;
                            const split = val.split("-");
                            const start = split[0]?.trim() || "";
                            const end = split[1]?.trim() || "";
                            handleEducationChange(idx, "startDate", start);
                            handleEducationChange(idx, "endDate", end);
                          }}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. 2018 - 2022"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Activities / Core accomplishments</label>
                        <textarea 
                          rows={2}
                          value={edu.description}
                          onChange={(e) => handleEducationChange(idx, "description", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-800 px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition resize-none leading-relaxed"
                          placeholder="GPA 3.8, Member of computer science student union..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Projects & Contributions */}
          <div 
            id="section-projects"
            className="bg-white border border-slate-200/60 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-6 scroll-mt-6"
          >
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-(--accent)" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Projects & Other Experience</h3>
              </div>
              
              <button
                onClick={handleAddOther}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 border border-slate-250/70 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            {resume.otherExperience.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold">No project entries added yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {resume.otherExperience.map((proj, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-slate-50/50 border border-slate-200/80 rounded-xl flex flex-col gap-4 relative"
                  >
                    <button
                      onClick={() => handleRemoveOther(idx)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Project / Contribution Name</label>
                        <input 
                          type="text" 
                          value={proj.title}
                          onChange={(e) => handleOtherChange(idx, "title", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-850 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition"
                          placeholder="e.g. Redis Clustering Library contributor"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Project Description</label>
                        <textarea 
                          rows={2}
                          value={proj.description}
                          onChange={(e) => handleOtherChange(idx, "description", e.target.value)}
                          className="w-full text-xs font-semibold text-slate-800 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-(--accent)/50 transition resize-none leading-relaxed"
                          placeholder="Implemented key features to Node.js library to prevent connection drop timeouts..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

    </main>
  );
}
