import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description:
    "Choose the CrackTheLoop plan that fits your interview timeline. Start free with 50 credits, then upgrade to Starter Pass ($4.99, 100 credits) or Pro Pass ($19.99, 500 credits). No hidden fees - pay only for active session time.",
  alternates: {
    canonical: "/pricing",
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
      "Start free. Upgrade when you're ready. 50 free credits, then Starter Pass at $4.99 or Pro Pass at $19.99. Only pay for active interview session time.",
    url: "/pricing",
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
      "50 free credits to start. Then Starter Pass at $4.99 or Pro Pass at $19.99. 1 credit = 1 minute of live AI interview session.",
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
