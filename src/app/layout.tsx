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
    default: "CrackTheLoop - Real-Time AI Live Interview Copilot & Response Assistant",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "CrackTheLoop is a real-time AI live interview copilot that provides instant answer suggestions, structured frameworks, and talking points to help candidates communicate with clarity and avoid blank mind moments under pressure.",

  keywords: [
    // Core product
    "AI interview copilot",
    "real-time interview AI",
    "AI interview assistant",
    "live interview response coach",
    "live response assistant",
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
    // Privacy / Local processing
    "privacy-first interview HUD",
    "desktop interview HUD",
    "low latency live overlay",
    "WASAPI audio capture interview",
    // Use cases
    "interview preparation AI",
    "job interview copilot",
    "real-time interview answers",
    "live interview prompts",
    "AI interview coaching",
    // Comparison
    "best AI interview tool 2026",
    "Final Round AI alternative",
    "LockedIn AI alternative",
    "Interview Coder alternative",
    // Long-tail
    "how to use AI in a job interview",
    "AI interview coach for Zoom",
    "real-time response coach",
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
    title: "CrackTheLoop - Real-Time AI Live Interview Copilot & Response Assistant",
    description:
      "Real-time AI live interview copilot that listens to your session and provides structured talking points and answer templates. Built on local audio capture + Deepgram + Groq.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CrackTheLoop - AI Live Interview Copilot & Response HUD",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cracktheloop",
    creator: "@cracktheloop",
    title: "CrackTheLoop - Real-Time AI Live Interview Copilot & Response Assistant",
    description:
      "Real-time AI live interview copilot for Zoom/Teams/Meet. Real-time answers, STAR framework, and system design templates. Try free.",
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
  alternateName: ["CrackTheLoop AI Copilot", "CrackTheLoop Live Interview Assistant"],
  url: SITE_URL,
  description:
    "Real-time AI live interview copilot using local audio capture, Deepgram nova-3 speech-to-text, and LLM streaming to deliver structured response guidance and confidence support during video calls.",
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
      description: "15 free credits - a full 15-minute live practice session",
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
    "Privacy-first local desktop HUD overlay",
    "Real-time loopback audio capture",
    "Deepgram nova-3 speech-to-text in <100ms",
    "LLM streaming answers via Groq / Claude / GPT-4o",
    "STAR framework behavioral answer structure",
    "System design answer templates",
    "Interview goal selection & resume alignment",
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
    "CrackTheLoop builds privacy-first AI live copilots that help job seekers present their skills with clarity and avoid blank mind moments during technical and behavioral interviews.",
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
    "Real-time AI live interview copilot and response HUD for Zoom, Teams, and Google Meet.",
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
  name: "CrackTheLoop - Real-Time AI Live Interview Copilot",
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
      name: "How does the desktop HUD overlay work? Is it private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The desktop HUD overlay runs locally on your computer, sitting side-by-side with your video call. Using local display capturing rules, it ensures a distraction-free environment for you. Your audio and data stay 100% private and are processed locally on your hardware.",
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
        text: "Your data never leaves your device. Resume parsing and session transcripts are processed and stored in secure browser cookies only. We have no server-side logging of your resume content or conversation audio. Zero.",
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
        text: "The Browser Copilot works on all platforms including Mac and Linux. The native Desktop HUD Overlay is currently Windows-only, with macOS support on our roadmap for Q3 2026.",
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
        text: "No. CrackTheLoop functions as a real-time speech coach and visual reminder card. It does not speak or think for you—it helps you recall your achievements, match target role keywords, and structure answers under pressure using the STAR framework.",
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

