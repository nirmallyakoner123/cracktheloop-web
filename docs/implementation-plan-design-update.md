# Implementation Plan - Pricing & Select Plan Refactoring with Free Trial

We will update the `/pricing` and `/select-plan` pages to display all 4 options from `cracktheloop.plans.json`, including the Free Trial ($0). We will also apply the light-gray mist design system (`bg-[var(--bg-mist)]`) to the `/select-plan` page to maintain consistency with the rest of the site, fully preserving checkout, cache update, and cookie logic.

---

## 1. Pricing Page Updates (`/pricing`)

### [Page Component](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/pricing/page.tsx) [MODIFY]
- **Render 4 Plan Cards**:
  - Update the grid columns from `grid-cols-1 md:grid-cols-3` to `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` to fit all 4 plans.
  - **Free Trial Card**: Display Free Trial at $0 with features: 15 AI Fuel Credits, Limit of 1 Interview session, Limit of 1 AI Report analysis, and 7-day trial validity.
  - **Starter Card**: $19/month, 100 credits, and standard features.
  - **Pro Card**: $39/month, 300 credits, and premium stealth features.
  - **Elite Card**: $79/month, 1000 credits, and advanced API context models.
- **Redirection flow**:
  - When clicking "Start Free Trial" or "Upgrade to Pro", route to `/select-plan?plan=[Plan Name]`.

---

## 2. Select Plan Page Updates (`/select-plan`)

### [Page Component](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/select-plan/page.tsx) [MODIFY]
- **Design & Theme Upgrade**:
  - Change background from dark `#0B0D19` to `bg-[var(--bg-mist)] text-[var(--text-primary)]`.
  - Style loader page, error messages, and info block for clean light-themed legibility.
  - Convert the 4 cards from dark containers to premium white cards matching the pricing page structure.
- **Auto-Activation Flow for Free Trial**:
  - If a user reaches the page with `?plan=Free Trial` and is logged in, automatically trigger the `handleSelectTrial()` API handler. This immediately redirects them to their `/dashboard` with 15 trial credits, eliminating friction.
- **Preserved Functionality**:
  - Retain token reading from `localStorage`.
  - Keep fetch post parameters to `/api/billing/trial` and `/api/billing/checkout` identical.
  - Maintain the Suspense wrapper boundary.

---

## 3. Verification Plan

- Run `npm run build` to confirm static page generation and compilation passes.
- Verify checkout redirects on the pricing page and test selection redirects on the `/select-plan` route.
