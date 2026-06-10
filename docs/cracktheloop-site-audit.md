# CrackTheLoop — Full Site Audit
**Site:** cracktheloop-web.vercel.app
**Audit Date:** June 2026
**Pages Reviewed:** Homepage, Pricing Page

---

## SECTION 1 — CRITICAL BUGS (Fix Immediately)

---

### 1. Pricing Mismatch Across Three Layers

**What's wrong:**
The pricing page shows three completely different prices depending on where you look:
- OG meta description says: `$9.99/mo`
- HTML source / what Google indexes: `$19/month` Starter
- What Indian users see in browser: `₹399 one-time`

This means a user who finds the site via Google sees `$9.99` in the search preview, lands on the page, and sees `$19` or `₹399`. That's a trust killer before they even read the copy.

**Solution:**
- Sync all meta tags (`og:description`, `twitter:description`) to reflect the actual displayed price
- If geo-based pricing is intentional, implement hreflang and region-specific meta tags
- At minimum, remove the hardcoded `$9.99` from OG tags immediately — it's factually wrong for every version

---

### 2. Google Verification Placeholder Live in Production

**What's wrong:**
Both the homepage and pricing page have this in the HTML head:
```
meta-google-site-verification: REPLACE_WITH_GOOGLE_VERIFICATION_CODE
```
This is a placeholder that was never replaced. Google Search Console cannot verify the site. Anyone who views source sees it — it looks unprofessional.

**Solution:**
- Go to Google Search Console → add property → copy the real verification code
- Replace `REPLACE_WITH_GOOGLE_VERIFICATION_CODE` with the actual code in your Next.js metadata config
- Deploy and verify

---

### 3. Domain `cracktheloop.com` Not Purchased But Used Everywhere

**What's wrong:**
Every canonical tag, OG URL, og:image URL, and Twitter card image points to `https://cracktheloop.com` — a domain that isn't purchased. This means:
- OG images are broken when shared on social media (they 404)
- Google sees a canonical pointing to a domain that doesn't exist
- Any backlinks built now point to a dead URL

**Solution:**
- Either purchase `cracktheloop.com` immediately (highest priority)
- Or update all canonical/OG tags to point to `cracktheloop-web.vercel.app` as a temporary fix
- Once domain is purchased, set up proper redirect and update all references

---

### 4. Download Buttons Are Dead Links

**What's wrong:**
Both "Windows (.exe)" and "macOS (.dmg)" download CTAs in the nav and on the product section anchor to `#platform-picker` — a section that either doesn't exist or does nothing. Users click, nothing happens.

**Solution:**
- If the desktop app is not ready: replace the button with a "Notify Me When Available" waitlist CTA
- If it is ready: provide a real direct download URL
- Never have a CTA that does nothing — it breaks trust more than having no CTA at all

---

### 5. Free Plan Data Inconsistency (India vs Global)

**What's wrong:**
- Indian users see: 50 credits, no expiry ("Credits never expire")
- Global HTML version shows: 15 credits, 7-day trial validity

The "First 100 users" banner also says 50 free credits, consistent with the India version — but the HTML that Google crawls and shares globally says 15 credits. So the better deal is invisible to most of the world, and anyone sharing the link internationally will show a worse offer.

**Solution:**
- Sync the HTML/server-rendered content to match what users actually see
- If the 50-credit offer is a limited-time promo, mark it as such with an end date
- Ensure the promotional banner and the plan card always show the same number

---

### 6. Double Title Tag

**What's wrong:**
The pricing page title reads: `Pricing & Plans - CrackTheLoop | CrackTheLoop`

"CrackTheLoop" appears twice. This looks broken in browser tabs and in Google search results.

**Solution:**
Change to: `Pricing & Plans — CrackTheLoop`
Format should be: `Page Name — Brand Name` (one instance of brand name only)

---

## SECTION 2 — TRUST & CREDIBILITY ISSUES

---

### 7. Testimonials Look Fabricated

**What's wrong:**
All four testimonials use:
- Single letter avatars (G, S, A, M)
- Unverifiable company affiliations (Google L5, Stripe Staff, Amazon SDE-II, Meta IC4)
- Zero last names, zero LinkedIn links, zero profile photos
- A footer note: *"All testimonials are anonymized. Names and company affiliations are not disclosed."*

This reads as a legal disclaimer for made-up testimonials. Any skeptical user — which is most users — will ignore all four. Worse, it can actively damage trust.

**Solution:**
- Find even one real beta user willing to give a named testimonial with a LinkedIn link
- If anonymity is necessary, use job title + company type instead of specific big tech names: "Senior Engineer at a Series B fintech" is more believable than "Senior Engineer • Google" with no proof
- Add a photo (even an avatar with initials tied to a real profile) instead of a generic single letter
- Remove the anonymization disclaimer — it draws attention to the problem

---

### 8. "4.9/5 Early Beta Rating" Has No Source

**What's wrong:**
The homepage displays "4.9 / 5 early beta rating" with no number of raters, no platform, no link. It's a statistic with no backing. Anyone can write "4.9/5."

**Solution:**
- Add the number of raters: "4.9/5 from 47 beta testers"
- If collected via a form or survey, screenshot it and link to it or mention the source
- If the number is too small to be credible, remove the stat entirely and replace with a single strong named testimonial

---

### 9. No Founder / Human Presence Anywhere

**What's wrong:**
The entire site has zero mention of who built this, why they built it, or who is behind it. For a product that sits invisibly on your screen during a high-stakes career moment, this is a significant trust gap. People want to know who they're trusting.

**Solution:**
- Add a short "Built by" section or a founder note — even 2-3 sentences
- A real name and a LinkedIn link goes a long way
- Consider an "About" page or at minimum a footer mention: "Built by [Name], a dev who bombed interviews and decided to fix that."

---

### 10. The "Cheating" Question Is Not Proactively Addressed

**What's wrong:**
There's an FAQ entry for "Is using AI during an interview cheating?" but the homepage never proactively confronts the elephant in the room. Competitors like Final Round AI have an explicit Ethics section front and center. If you don't own this narrative, critics and skeptical users will define it for you.

**Solution:**
- Add a dedicated section above or near the FAQ with a confident, direct take
- Frame it around: "We believe interview pressure doesn't measure your actual ability. CrackTheLoop levels the playing field."
- Don't be defensive — be assertive about your position
- Link to your existing Ethics Charter page more prominently

---

## SECTION 3 — CONVERSION & UX ISSUES

---

### 11. Hero Headline Is Redundant

**What's wrong:**
Current headline: *"Your Real-Time AI Interview Assistant for Live Guidance"*

"Real-Time" and "Live Guidance" say the exact same thing. The headline wastes words repeating itself instead of communicating a unique benefit.

**Solution:**
Options to consider:
- *"The AI That Sits With You Inside Your Interview"*
- *"Real Answers. Your Voice. Zero Detection."*
- *"The Invisible Edge in Every Technical Interview"*

Lead with the most visceral benefit (invisibility + live help), not a category description.

---

### 12. Free Tier Subtitle Is Internal Language

**What's wrong:**
The Free Trial card says: *"Evaluate the platform first"*

This is how a product manager describes a tier to an engineer. It's not user-facing copy. Users don't "evaluate platforms." They try things to see if they work.

**Solution:**
Replace with something like:
- *"Try it free — no card needed"*
- *"Your first session, completely free"*
- *"15 minutes of live AI guidance, on us"*

---

### 13. "Instant Billing Activation & Client Keys" Leaking Into UI

**What's wrong:**
On the pricing page, there's a subtitle that reads: *"Instant Billing Activation & Client Keys"*

This is internal/backend terminology that has no meaning to a regular user. It appears to be a section label or a backend concept that leaked into the frontend.

**Solution:**
- Remove it entirely, or
- Replace with something user-facing like: *"Activate in seconds. Start your session immediately."*

---

### 14. Demo Section Is a Static Mockup Presented as Live

**What's wrong:**
The "See How Your AI Buddy Helps in Real Time" section shows a simulated STAR feed with steps showing "QUEUED." It looks interactive but isn't. Users who engage with it expecting to see a real product demo feel misled.

**Solution:**
- Build an actual interactive demo (even a simplified one) — this is a high-converting asset for a product like this
- If not possible immediately, clearly label it: *"Sample output — real sessions look like this"*
- Add a link to a proper demo video (the "Watch Demo First" CTA exists but there's no actual demo video linked properly)

---

### 15. No Annual Pricing Plan

**What's wrong:**
All plans are monthly only. Every competitor in this space offers annual billing. The absence of it signals the product is early-stage, and it leaves significant revenue on the table — users who would commit for a year at a discount.

**Solution:**
- Add an annual toggle on the pricing page (standard pattern: Monthly / Yearly, with "Save 30%" badge)
- Price suggestion: Annual plan at ~8-9x the monthly rate (effectively 2 months free)
- Even if not immediately available, add: *"Annual plans coming soon — save up to 30%"*

---

### 16. Referral CTA Requires Login With No Warning

**What's wrong:**
The homepage and pricing page both have a "Get My Invite Link" CTA. Clicking it redirects to the login page with no prior indication that a login is required. Users feel surprised and may drop off.

**Solution:**
- Add inline text under the CTA: *"Sign in to get your personal referral link"*
- Or show a mini modal: "You'll need an account to access your referral link — sign up free in 30 seconds"
- Don't silently redirect — always set user expectations before a redirect

---

### 17. Cookie Banner Covers Pricing Content on Mobile

**What's wrong:**
On mobile (visible in screenshot), the cookie consent banner sits at the bottom of the screen and overlaps the pricing cards. On a pricing page, this is particularly bad — it's covering the decision-making area right when a user is trying to convert.

**Solution:**
- Reduce the banner height on mobile
- Or use a top banner instead of bottom on mobile
- Auto-dismiss after scroll or after a few seconds if no interaction
- Ensure it doesn't overlap any interactive elements or pricing content

---

### 18. Comparison Table Uses "Generic AI" as Competitor

**What's wrong:**
The comparison table pits CrackTheLoop against "Generic AI" — a made-up category. Users making a purchase decision are actually comparing against Final Round AI, LockedIn AI, Interview Coder, and Interviews.chat. Comparing against a vague strawman is a missed opportunity.

**Solution:**
- Name actual competitors in the table (Final Round AI, LockedIn AI)
- This is standard practice in SaaS — it shows confidence and captures search traffic from competitor comparisons
- Even a two-column table (CrackTheLoop vs Final Round AI) would be more persuasive than vs "Generic AI"

---

## SECTION 4 — COPY & TONE INCONSISTENCIES

---

### 19. "AI Buddy" Tone Mismatch

**What's wrong:**
The section header reads: *"See How Your AI Buddy Helps in Real Time"*

The rest of the site is sharp, technical, and professional. "Buddy" is casual and friendly in a way that clashes with the overall tone. It also slightly undermines the product's positioning as a serious stealth tool.

**Solution:**
Replace with something on-brand:
- *"See Your Copilot in Action"*
- *"Watch the AI Work Live"*
- *"Real-Time Guidance — Here's What It Looks Like"*

---

### 20. "2025" vs "2026" Year Inconsistency

**What's wrong:**
The site copyright footer says `© 2026` (correct), but multiple sections and meta keywords reference *"best AI interview helper 2025."* This looks like stale copy and can reduce SEO relevance as the year progresses.

**Solution:**
- Update all "2025" keyword references in headings, body copy, and meta keywords to "2026"
- Set a calendar reminder to update these annually

---

### 21. OG Image Points to Non-Existent Domain

**What's wrong:**
`og:image: https://cracktheloop.com/og-image.png`

Since `cracktheloop.com` isn't purchased, this image 404s when the link is shared on LinkedIn, Twitter, WhatsApp, or any platform that renders link previews. Every social share of the site shows a broken/empty preview image.

**Solution:**
- Immediately update og:image to: `https://cracktheloop-web.vercel.app/og-image.png`
- Verify the image exists at that path
- After purchasing the domain, update it to the canonical domain URL

---

## PRIORITY MATRIX

| Priority | Issue | Effort |
|----------|-------|--------|
| 🔴 Critical | OG image broken (social shares broken) | Low |
| 🔴 Critical | Google verification placeholder live | Low |
| 🔴 Critical | Pricing mismatch in meta tags | Low |
| 🔴 Critical | Download CTAs go nowhere | Medium |
| 🔴 Critical | Domain not purchased, used everywhere | Medium |
| 🟠 High | Double title tag | Low |
| 🟠 High | Fake-looking testimonials | Medium |
| 🟠 High | Cookie banner blocking mobile pricing | Medium |
| 🟠 High | Referral CTA silent redirect | Low |
| 🟡 Medium | No annual pricing | Medium |
| 🟡 Medium | Demo is static mockup | High |
| 🟡 Medium | Comparison table vs "Generic AI" | Low |
| 🟡 Medium | Ethics/cheating narrative not owned | Medium |
| 🟡 Medium | No founder/human presence | Low |
| 🟢 Low | Headline redundancy | Low |
| 🟢 Low | "AI Buddy" tone mismatch | Low |
| 🟢 Low | "Evaluate the platform" copy | Low |
| 🟢 Low | "Instant Billing" label leak | Low |
| 🟢 Low | 2025 → 2026 year references | Low |
| 🟢 Low | Beta rating has no source | Low |

---

*Audit prepared based on live site review — cracktheloop-web.vercel.app*
