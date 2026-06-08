import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans - CrackTheLoop",
  description:
    "Choose the CrackTheLoop plan that fits your interview timeline. Start free with 15 credits, then upgrade to Starter ($9.99/mo, 300 credits) or Pro ($19.99/mo, 1000 credits). No hidden fees - pay only for active session time.",
  alternates: {
    canonical: "https://cracktheloop.com/pricing",
  },
  keywords: [
    "AI interview copilot pricing",
    "CrackTheLoop plans",
    "interview AI subscription",
    "AI interview tool cost",
    "stealth AI interview pricing",
    "interview copilot free trial",
    "CrackTheLoop credits",
  ],
  openGraph: {
    title: "Pricing & Plans - CrackTheLoop AI Interview Copilot",
    description:
      "Start free. Upgrade when you're ready. 15 free credits, then Starter at $9.99/mo or Pro at $19.99/mo. Only pay for active interview session time.",
    url: "https://cracktheloop.com/pricing",
    siteName: "CrackTheLoop",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CrackTheLoop Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Plans - CrackTheLoop",
    description:
      "15 free credits to start. Then Starter $9.99/mo or Pro $19.99/mo. 1 credit = 1 minute of live AI interview session.",
    images: ["/og-image.png"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
