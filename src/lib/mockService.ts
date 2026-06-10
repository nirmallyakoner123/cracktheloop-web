"use client";

export interface MockResume {
  id: string;
  title: string;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  summary: string;
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
  }>;
  otherExperience: Array<{
    title: string;
    description: string;
  }>;
  created_at: string;
}

export interface MockCallSession {
  id: string;
  title: string;
  company: string;
  jobDescription: string;
  sessionType: "interview" | "call";
  model: string;
  language: string;
  resumeId: string;
  autoGenerate: boolean;
  saveTranscript: boolean;
  status: "active" | "completed";
  created_at: string;
  durationMinutes: number;
}

const DEFAULT_RESUMES: MockResume[] = [
  {
    id: "resume-1",
    title: "Senior Backend Engineer Resume",
    personalDetails: {
      name: "Arjun Sharma",
      email: "arjun.sharma@example.com",
      phone: "+91 98765 43210",
      address: "Bangalore, India",
    },
    summary: "Experienced Systems Engineer with 6+ years building scalable, high-throughput microservices. Specialized in Node.js, Redis Pub/Sub, WebSockets, and Kafka clustering.",
    education: [
      {
        school: "BITS Pilani",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
        startDate: "2016",
        endDate: "2020",
        description: "Graduated with Honors. Focused on Distributed Systems and Databases.",
      }
    ],
    workExperience: [
      {
        company: "Acme Logistics",
        position: "Senior Software Engineer",
        startDate: "2022-06",
        endDate: "Present",
        location: "Bangalore",
        description: "Led redesign of core notification service to handle 50k req/sec during flash sales. Implemented Redis cache-aside sharding, reducing DB latency by 35%.",
      },
      {
        company: "Tech Startups Inc",
        position: "Software Engineer II",
        startDate: "2020-07",
        endDate: "2022-05",
        location: "Remote",
        description: "Built and optimized real-time dashboard analytics with React and Socket.io. Scaled web sockets layer to 10k concurrent active clients.",
      }
    ],
    otherExperience: [
      {
        title: "Redis Clustering Open Source Contributor",
        description: "Contributed performance optimizations to node-redis clustering support libraries.",
      }
    ],
    created_at: new Date().toISOString(),
  }
];

const DEFAULT_SESSIONS: MockCallSession[] = [
  {
    id: "session-1",
    title: "Acme Log Systems Round",
    company: "Acme Logistics",
    jobDescription: "System Design for high-throughput messaging backend.",
    sessionType: "interview",
    model: "GPT-4o Mini",
    language: "English",
    resumeId: "resume-1",
    autoGenerate: true,
    saveTranscript: true,
    status: "completed",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 10,
  }
];

export function getMockResumes(): MockResume[] {
  if (typeof window === "undefined") return DEFAULT_RESUMES;
  const stored = localStorage.getItem("ctl_mock_resumes");
  if (!stored) {
    localStorage.setItem("ctl_mock_resumes", JSON.stringify(DEFAULT_RESUMES));
    return DEFAULT_RESUMES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_RESUMES;
  }
}

export function getMockResumeById(id: string): MockResume | undefined {
  return getMockResumes().find((r) => r.id === id);
}

export function saveMockResume(resume: MockResume) {
  if (typeof window === "undefined") return;
  const resumes = getMockResumes();
  const idx = resumes.findIndex((r) => r.id === resume.id);
  if (idx > -1) {
    resumes[idx] = resume;
  } else {
    resumes.push(resume);
  }
  localStorage.setItem("ctl_mock_resumes", JSON.stringify(resumes));
}

export function deleteMockResume(id: string) {
  if (typeof window === "undefined") return;
  const resumes = getMockResumes().filter((r) => r.id !== id);
  localStorage.setItem("ctl_mock_resumes", JSON.stringify(resumes));
}

export function getMockSessions(): MockCallSession[] {
  if (typeof window === "undefined") return DEFAULT_SESSIONS;
  const stored = localStorage.getItem("ctl_mock_sessions");
  if (!stored) {
    localStorage.setItem("ctl_mock_sessions", JSON.stringify(DEFAULT_SESSIONS));
    return DEFAULT_SESSIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_SESSIONS;
  }
}

export function getMockSessionById(id: string): MockCallSession | undefined {
  return getMockSessions().find((s) => s.id === id);
}

export function saveMockSession(session: MockCallSession) {
  if (typeof window === "undefined") return;
  const sessions = getMockSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx > -1) {
    sessions[idx] = session;
  } else {
    sessions.push(session);
  }
  localStorage.setItem("ctl_mock_sessions", JSON.stringify(sessions));
}

export function deleteMockSession(id: string) {
  if (typeof window === "undefined") return;
  const sessions = getMockSessions().filter((s) => s.id !== id);
  localStorage.setItem("ctl_mock_sessions", JSON.stringify(sessions));
}
