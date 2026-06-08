import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo - CrackTheLoop AI Interview Copilot",
  description:
    "Try the CrackTheLoop pipeline live. See how WASAPI audio capture → Deepgram nova-3 transcription → LLM streaming → HUD overlay works in real-time. No download required - runs in your browser.",
  alternates: {
    canonical: "https://cracktheloop.com/demo",
  },
  keywords: [
    "AI interview copilot demo",
    "CrackTheLoop demo",
    "real-time interview AI demo",
    "Deepgram transcription demo",
    "stealth overlay demo",
    "interview AI trial",
    "AI interview simulator",
    "STAR framework demo",
  ],
  openGraph: {
    title: "Interactive Demo - CrackTheLoop AI Interview Copilot",
    description:
      "Live demo: WASAPI audio → Deepgram STT → LLM streaming → invisible HUD overlay. See the full interview AI pipeline in action - right in your browser.",
    url: "https://cracktheloop.com/demo",
    siteName: "CrackTheLoop",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CrackTheLoop Interactive Demo - AI Interview Pipeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Demo - CrackTheLoop AI Interview Copilot",
    description:
      "See how our stealth AI interview pipeline works. WASAPI → Deepgram → LLM → invisible HUD. Try it free, no download needed.",
    images: ["/og-image.png"],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
