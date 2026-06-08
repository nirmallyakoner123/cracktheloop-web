# Implementation Plan - SEO-Focused Feature Pages

We will create three highly-detailed, SEO-optimized landing pages for CrackTheLoop's core features under the `/features/` route:
1. **Live Audio Transcription** (`/features/live-transcription`)
2. **Resume & JD Alignment** (`/features/resume-jd-alignment`)
3. **Stealth Overlay HUD** (`/features/stealth-overlay`)

Each page will have 4 key sections: Navbar, Feature Hero with an interactive visual mockup, custom FAQs specific to the feature, and CtaFooter.

---

## 1. Global Component Enhancements

### [Faq Component](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/components/landing/Faq.tsx) [MODIFY]
Refactor the FAQ component to accept an optional `faqList` prop. If provided, the custom list will override the general FAQs. This allows each subpage to render relevant technical questions instead of general pricing/setup questions.
```typescript
interface FaqProps {
  faqList?: { q: string; a: string }[];
}
```

### [Navbar Component](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/components/landing/Navbar.tsx) [MODIFY]
Introduce dynamic routing path checks. Since hash links (e.g. `#features`) fail when navigated from subpages, we will use `usePathname` from `next/navigation` to prefix hash links with a leading slash (`/`) when the user is not on the homepage (`/`).

---

## 2. Feature Pages Structure

### 2.1 [Live Audio Transcription Page](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/features/live-transcription/page.tsx) [NEW]
* **SEO Keyword Focus**: Real-time audio transcription copilot, speech-to-text interview helper, live loopback audio extraction.
* **Layout Sections**:
  1. `Navbar`
  2. **Hero & Intro**: Title: "Instant, Real-Time Audio Capture & Live Transcription". Detail-rich subtitle explaining why WASAPI loopback and micro-buffering outperform generic Web Speech APIs.
  3. **Visual Mockup**: Interactive Web Audio API node visualization showing loopback and microphone inputs downsampling into mono 16kHz signed PCM chunks and WebSocket streaming.
  4. **Custom FAQs**:
     - *How does local loopback audio capture work?*
     - *Is there any latency or lag during transcription?*
     - *Does it require installing virtual sound cards or virtual audio cables?*
     - *Can it differentiate between the interviewer's voice and my voice?*
     - *Are my private conversations recorded or stored?*
  5. `CtaFooter`

### 2.2 [Resume & Job Description Alignment Page](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/features/resume-jd-alignment/page.tsx) [NEW]
* **SEO Keyword Focus**: Resume JD alignment AI, interview keyword matcher, personalized project talking points, structured interview helper.
* **Layout Sections**:
  1. `Navbar`
  2. **Hero & Intro**: Title: "Personalized Answer Structuring Aligned to the Target Job". Subtitle showing how project keyword extraction matches your talking points.
  3. **Visual Mockup**: High-fidelity dual-card view:
     - Left card: Scans JD requirements and highlights core keywords (e.g., *API integration*, *scalability*, *Next.js*).
     - Right card: Auto-extracts corresponding resume accomplishments and weaves them into structured STAR responses dynamically.
  4. **Custom FAQs**:
     - *What file formats are supported for resume uploads?*
     - *How does the matching algorithm select which project is relevant?*
     - *Is my resume data sold or used for model training?*
     - *Can I configure different company profiles for different interview tracks?*
     - *Can I override or edit the suggestions?*
  5. `CtaFooter`

### 2.3 [Stealth Overlay HUD Page](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/features/stealth-overlay/page.tsx) [NEW]
* **SEO Keyword Focus**: Zoom invisible screen share helper, stealth interview copilot HUD, Win32 display affinity bypass.
* **Layout Sections**:
  1. `Navbar`
  2. **Hero & Intro**: Title: "Zoom-Invisible Stealth HUD Overlay". Subtitle explaining how the native client excludes the overlay from video compositors.
  3. **Visual Mockup**: Double-pane window simulation comparison:
     - Candidate's screen: Glassmorphic HUD overlay showing scrolling notes.
     - Screen share view: Clean background displaying only the web browser/IDE with no trace of the HUD.
  4. **Custom FAQs**:
     - *Is the overlay 100% invisible on Zoom, Teams, Meet, and Slack?*
     - *Does this work on macOS and Windows?*
     - *How does Win32 Display Affinity bypass recording tools?*
     - *Can browser-based video portals detect the desktop overlay?*
     - *Can I adjust the overlay transparency and position?*
  5. `CtaFooter`

---

## 3. Verification Plan

### Automated Build Verification
- Execute `npm run build` to verify there are no TypeScript, Next.js page generation, or build errors.

### Design and Styling Checks
- Validate that all pages run in the premium light-gray mist theme (`bg-[var(--bg-mist)]`).
- Verify correct App Router SEO metadata on each page.
- Test responsive rendering for Mobile (375px), Tablet (768px), and Desktop (1440px).
