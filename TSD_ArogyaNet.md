# Technical Specification Document (TSD)
## ArogyaNet

---

## 1. System Overview

ArogyaNet is a web-based dashboard application that reads PHC (Primary Health Centre) operational data, displays it visually, and uses the Gemini API to generate warnings and redistribution recommendations. For the hackathon MVP, it is a single web app with no separate backend server required unless the team chooses to add one — API calls to Gemini can be made directly from the frontend or through a thin backend layer for key security.

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js (React) *or* Streamlit (Python) | Next.js for a polished custom look; Streamlit for maximum build speed if time is tight |
| Styling | Tailwind CSS (if Next.js) | Fast, clean, consistent UI without custom design system work |
| AI Layer | Google Gemini API (via Google AI Studio key) | Free tier available, strong reasoning over structured data, natural language generation |
| Data Storage | Static CSV/JSON file (MVP) | No database setup needed; simplest path for a hackathon timeline |
| Charts (optional) | Recharts (if Next.js) | Quick, clean line/bar charts for trend visualization |
| Map (optional) | Static grid layout, or Google Maps Embed if time allows | Avoid full geolocation complexity unless trivial to add |
| Hosting | Vercel (Next.js) or Streamlit Community Cloud | Free, fast deploy for demo purposes |

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
- Deploy via Vercel (Next.js) or Streamlit Cloud with environment variable for `GEMINI_API_KEY`
- Test the deployed link at least once before the presentation, not just localhost
