# CrackTheLoop - Brand & Design System Guidelines

This document outlines the visual identity and design system for **CrackTheLoop**, ensuring a unified, premium developer tool aesthetic across the Desktop (Tauri) and Web (Next.js) environments.

---

## 🎨 1. Brand Color Palette

Use these exact hex codes and RGB values to maintain visual harmony. The color system is tailored for dynamic, high-contrast dark modes and sleek glassmorphic controls.

| Color Role | Hex Code | RGB Value | Tailwind Utility Class | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Base (Dark)** | `#0B0D19` | `rgb(11, 13, 25)` | `bg-[#0B0D19]` | App backgrounds, heavy section containers, sidebar headers. |
| **Accent Loop (Purple)** | `#6610F2` | `rgb(102, 16, 242)` | `text-[#6610F2]` | Brand gradients, active button outlines, primary focus states. |
| **Accent Velocity (Blue)** | `#0D6EFD` | `rgb(13, 110, 253)` | `text-[#0D6EFD]` | Brand gradients, links, interactive call-to-actions. |
| **Teal Flash** | `#0DCAF0` | `rgb(13, 202, 240)` | `text-[#0DCAF0]` | Gradient highlights, success states, subtle borders. |
| **Text Primary (Slate)** | `#0F172A` | `rgb(15, 23, 42)` | `text-slate-900` | Heavy typography, headers on white pages. |
| **Text Secondary (Muted)** | `#64748B` | `rgb(100, 116, 139)` | `text-slate-500` | Subtitles, helper text, captions. |

### 🚀 2. Gradient Standard
The primary brand gradient blends our **Accent Loop (Purple)**, **Accent Velocity (Blue)**, and **Teal Flash**:
- **Tailwind class**: `bg-gradient-to-r from-[#6610F2] via-[#0D6EFD] to-[#0DCAF0]`
- **Linear Gradient CSS**: `linear-gradient(135deg, #6610f2 0%, #0d6efd 50%, #0dcaf0 100%)`

---

## ✍️ 2. Typography Guidelines

To present metric data, telemetry, and setup menus cleanly, apply these rules:

1. **Primary Headers (UI & Marketing)**:
   - **Font Families**: `Poppins`, `Inter`, or `Montserrat` (geometric sans-serif).
   - **Usage**: Used for all landing page headers, application dashboard titles, and heavy bold navigation elements.
2. **Mono / Code Typography**:
   - **Font Families**: `JetBrains Mono` or `Fira Code`.
   - **Usage**: Displaying technical statistics, system loopback statuses, OCR results, prompts, and license/API keys.

---

## 🖼️ 3. SVG Brand Assets

The following core assets are available in the `/public` folder of both the web and desktop client structures:

### 1. Primary Full-Color Mark (`logo.svg`)
- **Visuals**: Full color app icon on a dark `#0b0d19` background with a glowing gradient loop and shortcut arrow.
- **Best For**: Desktop app launch icons, loading page centers, about-dialog boxes.

### 2. Minimalist Monochromatic Mark (`logo-mono.svg`)
- **Visuals**: High-contrast outline version in Slate.
- **Best For**: Low-opacity watermark placements, navbar stamps, minimal stealth view layouts.

### 3. Horizontal Web Header - Light Mode (`logo-horizontal-light.svg`)
- **Visuals**: Flat horizontal lockup containing the gradient mark and dark text `#0f172a`.
- **Best For**: Marketing landing pages, white documents, billing screens.

### 4. Horizontal Web Header - Dark Mode (`logo-horizontal-dark.svg`)
- **Visuals**: Horizontal lockup containing the gradient mark and white text over a `#0B0D19` dark banner.
- **Best For**: Desktop setups, black header cards, web app dashboards.

---

## 🛠️ 4. Tailwind Configuration Reference

To integrate these color tokens seamlessly inside Tailwind CSS v4 or v3 configurations:

### Tailwind v4 (`app.css` / `index.css`)
```css
@theme {
  --color-brand-base: #0B0D19;
  --color-brand-purple: #6610F2;
  --color-brand-blue: #0D6EFD;
  --color-brand-teal: #0DCAF0;
}
```

### Tailwind v3 (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#0B0D19',
          purple: '#6610F2',
          blue: '#0D6EFD',
          teal: '#0DCAF0',
        }
      }
    }
  }
}
```
