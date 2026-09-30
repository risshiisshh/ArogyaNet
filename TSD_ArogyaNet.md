# Technical Specification Document (TSD)
## ArogyaNet

---

## 1. System Overview

ArogyaNet is a web-based dashboard application built with **React (Vite + TypeScript)** that reads PHC (Primary Health Centre) operational telemetry, displays it through interactive visual dashboards, and uses the Google Gemini API to generate real-time warnings, decision intelligence, and cross-facility redistribution recommendations. For the hackathon MVP, it operates as a high-performance Single Page Application (SPA) with deterministic telemetry fallback and live Gemini AI integration.

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend Core | React 19 + Vite + TypeScript | Blazing fast HMR, strict type safety, modular component architecture |
| Routing | React Router v7 | Declarative client-side routing across all analytical views and detail pages |
| Styling & Theme | Tailwind CSS v4 + Design System Tokens (CSS Custom Properties) | Tokenized colors, typography, system-wide dark mode support (`ThemeContext`) |
| Interactive Components & Motion | Motion (`motion/react`) + GSAP | Rich physics-based animations (RubberSegment, StaggeredMenu, PromptBar) |
| Icons & Typography | Google Material Symbols + Hugeicons + Manrope/Inter font families | Modern, high-density public health operational aesthetic |
| AI Layer | Google Gemini API (`@google/genai` / REST) | Structured reasoning over live PHC telemetry, automated alerts, and natural language dialogue |
| Data Model & Telemetry | Typed JSON records + in-memory reactive state | Zero database friction for MVP with realistic Sitapur district health network data |
| Hosting | Vercel / Netlify / Cloudflare Pages | Instant global CDN distribution for static SPA assets |

## 3. Application Screens

1. **Dashboard (Home)** — grid/list of all PHCs with color-coded status cards
2. **PHC Detail View** — item-level stock table, bed occupancy %, staff attendance %, forecast per item
3. **Alerts Panel** — scrollable list of AI-generated early warnings, sorted by urgency
4. **Redistribution Panel** — AI-generated recommendations with source PHC, destination PHC, item, quantity, and one-line reasoning
5. *(Stretch)* **Admin Chat** — free-text question box that queries Gemini against the current dataset

## 4. Data Model (MVP)

Each PHC record contains:
- `phc_id`, `phc_name`, `district`
- `beds_total`, `beds_occupied`
- `staff_total`, `staff_present`
- `inventory`: list of `{ medicine_name, quantity, daily_consumption_rate, reorder_threshold }`

See BAS document for the full schema and sample data.

## 5. Core Logic

### 5.1 Status Classification (per PHC)
Computed client-side or in a small utility function:
- 🔴 Critical: any medicine at or below reorder threshold, or bed occupancy > 90%
- 🟡 Low: any medicine within 3 days of threshold at current consumption rate
- 🟢 Healthy: all items above threshold, bed occupancy < 90%

### 5.2 Stock-Out Forecast
Simple formula per medicine:
```
days_until_stockout = current_quantity / daily_consumption_rate
```
No ML model needed for MVP — this arithmetic is sufficient and transparent, and Gemini narrates the result.

### 5.3 AI Alert Generation
Send the computed forecast data (not raw guesswork) to Gemini with a prompt instructing it to phrase warnings clearly and prioritize by urgency. See BAS for exact prompt template.

### 5.4 AI Redistribution Recommendation
Send the full network's inventory state to Gemini and ask it to identify surplus-vs-deficit pairs and suggest specific transfers with brief reasoning. See BAS for exact prompt template.

## 6. Non-Functional Requirements

- **Performance:** Dashboard should load in under 2 seconds with ~20 PHC records
- **Reliability for demo:** All Gemini calls should have a fallback cached response in case of API failure during the live demo
- **Simplicity:** No authentication, no multi-user roles, no persistent database required for MVP
- **Clarity:** All AI outputs must be short, plain-language, and free of jargon — this is for administrators, not data scientists

## 7. Build Order (Recommended)

1. Finalize data schema and populate sample dataset (real + synthetic)
2. Build static dashboard UI reading from local JSON/CSV (no AI yet)
3. Add status color-coding and drill-down view
4. Integrate Gemini API for alert generation
5. Integrate Gemini API for redistribution recommendations
6. Add forecast/trend visuals (if time allows)
7. Polish UI, test edge cases, prepare fallback demo data
8. Deploy to hosting platform for a live, shareable link

## 8. Deployment Plan

- Push to GitHub repo
- Build production bundle via `npm run build` (`tsc && vite build`)
- Deploy via Vercel, Netlify, or Cloudflare Pages with environment variable `VITE_GEMINI_API_KEY`
- Test the deployed preview build before the presentation to ensure client-side routing and fallback telemetry perform smoothly
