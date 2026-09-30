# 🌿 ArogyaNet (आरोग्यनेट)
### AI-Powered Public Health Telemetry & Resource Rebalancing Network

ArogyaNet is an intelligent public health operational command center designed for district health administrations (specifically modeled after the Sitapur District health network in Uttar Pradesh, India). It transforms fragmented primary health centre (PHC) inventory and operational data into proactive early warnings, AI-driven stock redistribution recommendations, and multi-scenario disaster resilience simulations.

---

## 🌟 Key Features

1. **🏥 Real-Time PHC Operational Dashboard**
   - Live telemetry monitoring across 10 Primary Health Centres.
   - Aggregate network readiness scoring, bed occupancy tracking, staff attendance rates, and stock status heatmaps.
   - Dynamic interactive corridor map displaying active logistics and transfer routes.

2. **⚡ AI Early Warning System (`/alerts`)**
   - Proactive alert generation detecting stockouts before they happen (3-day and 7-day consumption velocity thresholds).
   - Categorized by severity (*Critical*, *Warning*, *Informational*).
   - One-click trigger to generate mitigation plans.

3. **🔄 Autonomous Resource Redistribution Matrix (`/redistributions`)**
   - Algorithmic surplus-to-deficit matching matrix.
   - Calculates transfer distance, transit times, and vehicle logistics.
   - Live Gemini AI reasoning explaining the operational rationale behind each transfer.

4. **🧪 Epidemiological & Crisis Simulator (`/simulator`)**
   - Stress-test the health network against:
     - **Monsoon Flash Flood & Waterborne Outbreak** (Spikes ORS/Zinc and IV fluid demand).
     - **Supply Chain Disruption & National Highway Blockade** (Halts external depot deliveries).
     - **Viral Fever & Dengue Surge** (Tests bed capacity and antipyretic reserves).

5. **🌍 BRICS Global Health Innovation Hub (`/brics`)**
   - Cross-border frugal innovation frameworks.
   - Adaptation blueprints for South Africa, Brazil, and fellow Global South nations facing rural healthcare logistics hurdles.

6. **💬 AI Clinical & Operational Assistant (`/assistant`)**
   - Natural language interface with context-aware Gemini 2.0 reasoning over live Sitapur network telemetry.

7. **🎯 Judge & Evaluator Demo Tour**
   - Guided step-by-step interactive walkthrough showcasing end-to-end user journeys in under 3 minutes.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ArogyaNet.git
cd ArogyaNet

# Install dependencies
npm install

# (Optional) Add your Gemini API key for live AI reasoning
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=your_key_here

# Start the development server
npm run dev
```

The application will be running at `http://localhost:3000/` (or next available port).

---

## 🛠️ Architecture & Tech Stack

- **Core:** React 19, TypeScript, Vite
- **Routing:** React Router v7
- **Styling & Design System:** Tailwind CSS v4 + Design System CSS Variables (Warm Stone & Forest Teal palette)
- **Animations:** Motion (`motion/react`) & GSAP physics
- **AI Reasoning:** Google Gemini 2.0 API (`@google/genai` with deterministic local fallback)
- **Telemetry Data:** Realistic Sitapur district PHC datasets (`phcs.json`, `districts.json`)

---

## 📦 Production Build & Deployment

```bash
# Type-check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel / Netlify / Cloudflare Pages
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** `VITE_GEMINI_API_KEY` (optional)
