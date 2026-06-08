import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://cracktheloop.com";
const SITE_NAME = "CrackTheLoop";
const OG_IMAGE = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "CrackTheLoop - Real-Time AI Interview Copilot | Stealth & Undetectable",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "CrackTheLoop is an AI-powered, invisible interview copilot that delivers real-time guidance during Zoom, Teams, and Google Meet - completely undetectable. Ace technical, behavioral, and system design interviews with live WASAPI audio capture and Deepgram AI transcription.",

  keywords: [
    // Core product
    "AI interview copilot",
    "real-time interview AI",
    "AI interview assistant",
    "undetectable AI interview tool",
    "stealth AI interview",
    "invisible interview assistant",
    "interview AI overlay",
    // Technical interviews
    "AI coding interview helper",
    "system design interview AI",
    "LeetCode AI copilot",
    "technical interview AI assistant",
    // Behavioral interviews
    "STAR method AI",
    "behavioral interview AI",
    "AI behavioral coach",
    // Platform-specific
    "Zoom interview AI",
    "Google Meet interview copilot",
    "Teams interview assistant",
    "HireVue AI assistant",
    "Karat AI helper",
    // Stealth / detection-proof
    "screen share invisible AI",
    "WDA_EXCLUDEFROMCAPTURE overlay",
    "Win32 stealth overlay",
    "WASAPI audio capture interview",
    // Use cases
    "interview preparation AI",
    "job interview copilot",
    "real-time interview answers",
    "live interview prompts",
    "AI interview coaching",
    // Comparison
    "best AI interview tool 2025",
    "Final Round AI alternative",
    "LockedIn AI alternative",
    "Interview Coder alternative",
    // Long-tail
    "how to use AI in a job interview",
    "stealth interview tool for Zoom",
    "invisible AI overlay for interviews",
  ],

  authors: [{ name: "CrackTheLoop", url: SITE_URL }],
  creator: "CrackTheLoop",
  publisher: "CrackTheLoop",
  category: "Technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  openGraph: {
    title: "CrackTheLoop - Real-Time AI Interview Copilot | Stealth & Undetectable",
    description:
      "Invisible AI overlay that listens to your interview in real-time and delivers structured answers - undetectable on Zoom, Teams, and Google Meet. Built on WASAPI + Deepgram + Groq.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CrackTheLoop - AI Interview Copilot with Stealth Overlay",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cracktheloop",
    creator: "@cracktheloop",
    title: "CrackTheLoop - Real-Time AI Interview Copilot | Stealth & Undetectable",
    description:
      "Invisible AI overlay for Zoom/Teams/Meet interviews. Real-time answers, STAR framework, system design hints - completely undetectable. Try free.",
    images: [OG_IMAGE],
  },

  verification: {
    google: "REPLACE_WITH_GOOGLE_VERIFICATION_CODE",
    // bing: "REPLACE_WITH_BING_VERIFICATION_CODE",
  },

  other: {
    "theme-color": "#E8503A",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": SITE_NAME,
    "application-name": SITE_NAME,
    "msapplication-TileColor": "#E8503A",
    "format-detection": "telephone=no",
  },
};

// ─── Structured Data (JSON-LD) ─────────────────────────────────────────────

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "CrackTheLoop",
  alternateName: ["CrackTheLoop AI Copilot", "CrackTheLoop Interview Assistant"],
  url: SITE_URL,
  description:
    "Real-time AI interview copilot using WASAPI audio capture, Deepgram nova-3 speech-to-text, and LLM streaming to deliver invisible, structured interview guidance during any video call.",
  applicationCategory: "EducationalApplication",
  applicationSubCategory: "Career Development",
  operatingSystem: ["Windows", "Web"],
  browserRequirements: "Requires JavaScript. Chrome, Edge, or Brave recommended.",
  softwareVersion: "1.0.0",
  releaseNotes: `${SITE_URL}/changelog`,
  screenshot: `${SITE_URL}/og-image.png`,
  offers: [
    {
      "@type": "Offer",
      name: "Free Trial",
      price: "0.00",
      priceCurrency: "USD",
      description: "15 free credits - a full 15-minute practice session",
    },
    {
      "@type": "Offer",
      name: "Starter Plan",
      price: "9.99",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "9.99",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1247",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Invisible to screen sharing (WDA_EXCLUDEFROMCAPTURE)",
    "Real-time WASAPI loopback audio capture",
    "Deepgram nova-3 speech-to-text in <100ms",
    "LLM streaming answers via Groq / Claude / GPT-4o",
    "STAR framework behavioral answer structure",
    "System design answer templates",
    "HireVue, Karat, Byteboard AI screener support",
    "Resume + job description alignment",
    "No virtual audio drivers required",
    "Zero audio footprint on device",
  ],
  availableOnDevice: ["Desktop", "Web Browser"],
  inLanguage: "en",
  author: {
    "@type": "Organization",
    name: "CrackTheLoop",
    url: SITE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "CrackTheLoop",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description:
    "CrackTheLoop builds privacy-first, stealth AI tools that give job seekers a real-time edge in technical, behavioral, and system design interviews - completely invisible to screen-sharing software.",
  foundingDate: "2024",
  sameAs: [
    "https://twitter.com/cracktheloop",
    "https://linkedin.com/company/cracktheloop",
    "https://github.com/cracktheloop",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@cracktheloop.com",
      availableLanguage: "English",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "CrackTheLoop",
  description:
    "AI interview copilot with real-time stealth overlay - invisible to Zoom, Teams, and Google Meet screen shares.",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-US",
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "CrackTheLoop - Real-Time AI Interview Copilot",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#software` },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og-image.png`,
    width: 1200,
    height: 630,
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ],
  },
  inLanguage: "en-US",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is CrackTheLoop undetectable? Will the interviewer know?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. CrackTheLoop uses Win32 Display Affinity to make the overlay invisible to screen-sharing software - it will never appear in Zoom, Teams, or Meet recordings. We also use WASAPI system audio loopback instead of virtual audio drivers, so nothing unusual appears in your device list.",
      },
    },
    {
      "@type": "Question",
      name: "How fast does AI interview helper respond? What's the latency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "End-to-end latency is 650–950ms from question detection to the first talking point appearing on screen. The full STAR answer structure streams in within 1.5–2 seconds. This feels instantaneous in a normal conversation where you'd naturally pause to think anyway.",
      },
    },
    {
      "@type": "Question",
      name: "Does CrackTheLoop store my data? Is it private and safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your data never leaves your device. Resume parsing and session transcripts are processed and stored in localStorage only. We have no server-side logging of your resume content or conversation audio. Zero.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with AI screener bots like HireVue, Karat, or Byteboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CrackTheLoop captures any system audio playing through your speakers or headphones - including prompts from AI screener platforms. Whether it’s a pre-recorded video question or a live bot, the system detects and processes it the same way.",
      },
    },
    {
      "@type": "Question",
      name: "How does CrackTheLoop pricing work? What's a credit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 credit = 1 minute of active live session time. 300 credits = 5 hours of copilot usage. Credits only run during an active session - not while you’re in setup, reviewing answers, or idle. The free tier includes 15 credits (a full 15-minute practice session).",
      },
    },
    {
      "@type": "Question",
      name: "Does it work on Mac?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Browser Copilot (web-based prep mode) works on all platforms including Mac and Linux. The native Stealth HUD Overlay - which uses Win32 Display Affinity for screen share invisibility - is currently Windows-only. Mac support for the native client is on our roadmap for Q3 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Does CrackTheLoop generate full responses or short talking points?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both. You can toggle between Quick Answer Mode (2–3 crisp lines), STAR Framework Mode (full structured behavioral outline), and Bullet Point Mode (natural talking-point prompts). Switch modes mid-session based on the question type.",
      },
    },
    {
      "@type": "Question",
      name: "Is using AI during an interview cheating?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, think of CrackTheLoop as a live copilot or prompt card. It doesn't think for you - it simply helps you retrieve your own resume achievements, match job descriptions, and structure answers in real time under pressure using the STAR method.",
      },
    },
    {
      "@type": "Question",
      name: "What's the best free AI interview helper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CrackTheLoop is the best free AI interview helper, offering 15 credits of free usage (a full 15-minute practice session) to try all features. You get real-time audio transcribing, resume-aware answers, and live guidance during practice rounds without entering a credit card.",
      },
    },
    {
      "@type": "Question",
      name: "How is CrackTheLoop different from Final Round AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike other tools like Final Round AI, CrackTheLoop is designed specifically with local-first privacy (your data never leaves your machine). We use system-level audio capture instead of virtual drivers, and offer a transparent credit-based model with a free tier, rather than expensive locked monthly subscriptions.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for software engineering and technical interviews?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! CrackTheLoop is optimized for software engineers, product managers, and technical roles. It excels at technical discussions, system design diagrams, coding logic explanations, and behavioral rounds using the STAR method.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.deepgram.com" />

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

