# 🌿 ArogyaNet (आरोग्यनेट)
### AI-Powered Public Health Telemetry & Resource Rebalancing Network

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-Streaming-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ArogyaNet** is an intelligent public health operational command center designed for district health administrations (specifically modeled after the Sitapur District health network in Uttar Pradesh, India). It bridges the gap between fragmented primary health centre (PHC) inventory telemetry and proactive decision-making. 

Powered by **Google Gemini 2.0 Flash**, ArogyaNet turns isolated PHC status logs into early stockout warnings, automated peer-to-peer redistribution matrices, and multi-vector crisis simulation modeling.

---

## 📑 Table of Contents

- [Core Value Proposition](#-core-value-proposition)
- [Key Features](#-key-features)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [AI Copilot & Fallback Engine](#-ai-copilot--fallback-engine)
- [Tech Stack](#-tech-stack)
- [Directory Structure](#-directory-structure)
- [Quick Start & Setup](#-quick-start--setup)
- [Environment Configuration](#-environment-configuration)
- [Interactive Features & Walkthroughs](#-interactive-features--walkthroughs)
- [Production Build & Deployment](#-production-build--deployment)
- [Roadmap & BRICS Scaling Blueprint](#-roadmap--brics-scaling-blueprint)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Core Value Proposition

In rural healthcare networks, supply imbalances are frequent: one PHC faces an acute stockout of critical IV fluids or antivenom, while a neighbouring facility 15 km away holds excess inventory expiring on shelves. 

Traditional health administration operates reactively with delayed monthly reports. **ArogyaNet introduces:**
1. **Real-Time Telemetry Enrichment:** Automated algorithmic scoring of inventory days-of-coverage, bed occupancy, and staff absenteeism.
2. **Proactive Shortage Anticipation:** Early warnings at 3-day and 7-day velocity thresholds before stockouts occur.
3. **Optimized Algorithmic Redistribution:** Peer-to-peer transfers with road distance, transit time, and cold-chain constraints.
4. **Context-Grounding Generative AI:** Gemini 2.0 assistant that reasons over verified live network telemetry with zero hallucinated facilities.

---

## 🌟 Key Features

### 1. 🏥 Real-Time PHC Command Center (`/`)
- Aggregated health score index across all 10 Primary Health Centres in Sitapur district.
- Real-time bed occupancy tracker with critical capacity indicators (>85% saturation warning).
- Staff attendance monitors and inventory status heatmaps.
- Dynamic interactive SVG/Canvas corridor map showing active PHC links, status colors, and active redistribution corridors.

### 2. ⚡ AI Early Warning System (`/alerts`)
- Continuous calculation of stock exhaustion timelines based on daily consumption velocity.
- Multi-tier alert classification: `Critical Shortage` (< 3 days), `Low Stock Warning` (< 7 days), `Bed Saturation`, and `Staff Shortage`.
- Direct action triggers: One-click generation of AI mitigation strategies and supply dispatch plans.
- Powered directly by reactive `NetworkDataContext`.

### 3. 🔄 Autonomous Peer Redistribution Matrix (`/redistributions`)
- Graph-based surplus-to-deficit matching engine balancing source donor facilities with receiving deficit facilities.
- Logistics feasibility metrics: Road distance (km), estimated transit time (mins), transport priority, and urgency level.
- Embedded Gemini AI operational rationale detailing clinical justification for each transfer.
- One-click CSV export utility (`exportUtils.ts`) for ground logistics and field ambulance drivers.

### 4. 🗺️ PHC Directory & Deep-Dive Detail View (`/phc` & `/phc/:id`)
- Comprehensive facility directory filterable by status (`Healthy`, `Needs Attention`, `Critical`).
- Individual facility dashboard providing:
  - Deep item-by-item pharmaceutical inventory logs (stock count, monthly consumption, reorder mark).
  - Bed capacity vs. occupancy breakdown.
  - Staff duty roster and doctor/nurse availability metrics.
  - Emergency contact coordinates and GPS locations.

### 5. 🧪 Epidemiological & Crisis Simulator (`/simulator`)
Stress-test district resilience under multi-hazard emergency scenarios:
- **Monsoon Flash Flood & Waterborne Outbreak:** Spikes ORS/Zinc and IV fluid consumption by 300%; floods low-lying transit corridors.
- **Supply Chain Disruption & National Highway Blockade:** Halts external depot deliveries; forces 100% intra-district peer rebalancing.
- **Viral Fever & Dengue Surge:** Floods inpatient bed capacity and antipyretic reserves.
- Dynamically injects stress parameters into the global network state, immediately reflecting in alerts and redistribution pipelines.

### 6. 💬 ArogyaNet Copilot (`/assistant`)
- Full multi-turn conversational AI specialized in district health operations.
- Direct Server-Sent Events (SSE) streaming with word-by-word progressive typewriter rendering.
- Telemetry grounding: Generates system prompts with live PHC statistics, preventing hallucination.
- Resilient zero-API-key fallback: Deterministic local inference engine answering operational queries even offline or without a Gemini API token.
- Multi-turn conversation retention through `ChatContext` persisting across navigation.

### 7. 🌍 BRICS Global Health Innovation Hub (`/brics`)
- Scalability blueprints translating the Sitapur model to other Global South geographies (e.g., South Africa's rural clinics, Brazil's SUS Amazon network).
- Cross-border frugal innovation frameworks and multilateral resource-sharing models.

### 8. 🎯 Judge & Evaluator Demo Tour (`JudgeDemoTour.tsx`)
- Built-in guided walkthrough walking hackathon judges and evaluators through key product scenarios in under 3 minutes.
- Quick scenario toggling, dataset inspection modal, and executive briefing generator.

---

## 🏛️ System Architecture & Data Flow

```
                     ┌───────────────────────────┐
                     │   Sitapur Telemetry Data  │
                     │     (src/data/phcs.json)  │
                     └─────────────┬─────────────┘
                                   │
                                   ▼
                     ┌───────────────────────────┐
                     │   NetworkDataContext      │
                     │  - Scenario Injector      │
                     │  - State Management       │
                     └─────────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│  domain.ts Engine│     │  Vite/React Pages │     │ assistantService  │
│ - enrichAllPHCs  │     │ - Dashboard       │     │ - Telemetry Ground│
│ - computeAlerts  │────►│ - Alerts          │◄────│ - Gemini 2.0 SSE  │
│ - computeTransfers│     │ - Redistributions │     │ - Local Fallback  │
│ - NetworkSummary │     │ - Simulator       │     └─────────┬─────────┘
└──────────────────┘     └───────────────────┘               │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │ Google Gemini   │
                                                    │ 2.0 Flash API   │
                                                    └─────────────────┘
```

---

## 🧠 AI Copilot & Fallback Engine

ArogyaNet is designed to function reliably in mission-critical, low-connectivity district environments.

### 1. Gemini 2.0 Flash Streaming Mode (When API Key is Provided)
- Directly connects via fetch with `ReadableStream` decoding Server-Sent Events (`alt=sse`).
- Telemetry Injection: First user prompt is prepended with a comprehensive structured summary of all 10 PHCs, active alerts, and top transfers.
- Stream cancellation: Supports `AbortController` to gracefully cancel responses mid-stream when the user stops generation.

### 2. Deterministic Local Reasoning Mode (Zero-Config / Offline Fallback)
- If `VITE_GEMINI_API_KEY` is not provided or the network is unavailable, `assistantService.ts` executes a rule-based inference pipeline using `domain.ts`.
- Evaluates queries for stockouts, bed capacity, staffing levels, transfer recommendations, and specific facility queries.
- Streams the computed data with simulated typewriter delays (12–30ms per word) for a continuous UI experience.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** (`react`, `react-dom`) | Modern concurrent React rendering |
| **Language** | **TypeScript 5** | End-to-end typed domain entities and interfaces |
| **Bundler & Build Tool**| **Vite 8.3** (Rolldown engine) | Sub-second HMR and production bundle optimization |
| **Routing** | **React Router v7** | Client-side routing with SPA fallback |
| **Styling & Design** | **Tailwind CSS v4** + Design Tokens | Custom dark/light mode, Warm Stone & Forest Teal palette |
| **Animations & FX** | **Motion** + **GSAP** | Physics-based micro-interactions and smooth page transitions |
| **Iconography** | **HugeIcons** & **Lucide React** | Clean, accessible clinical and interface icons |
| **AI Integration** | **Google Gemini 2.0 Flash** | Natural language reasoning via SSE streaming API |
| **State Architecture** | **React Context API** | `NetworkDataContext`, `ChatContext`, `ThemeContext` |

---

## 📁 Directory Structure

```
ArogyaNet/
├── public/
│   ├── _redirects               # SPA routing fallback for Netlify/Cloudflare
│   └── favicon.ico              # ArogyaNet brand icon
├── src/
│   ├── App.tsx                  # Main router and modal mounts
│   ├── main.tsx                 # Application bootstrap with Context providers
│   ├── index.css                # Tailwind directives & design system CSS variables
│   ├── components/
│   │   ├── DatasetModal/        # Raw JSON telemetry inspection modal
│   │   ├── ExecutiveBriefModal/ # Executive summary generator for CMOs
│   │   ├── InteractiveMap/      # Dynamic district corridor visualization
│   │   ├── JudgeDemoTour/       # Interactive 3-minute guided product tour
│   │   ├── Layout.tsx           # Shell layout with responsive navigation
│   │   ├── Navigation.tsx       # Top navbar with quick actions and theme toggle
│   │   ├── PromptBar/           # Assistant query input bar
│   │   ├── RubberSegment/       # Animated elastic tab switcher
│   │   └── StaggeredMenu/       # Mobile navigation drawer with dark mode
│   ├── context/
│   │   ├── ChatContext.tsx      # Conversation state & streaming controller
│   │   ├── NetworkDataContext.tsx # PHC live telemetry & crisis scenario state
│   │   └── ThemeContext.tsx     # Dark/light theme persistence
│   ├── data/
│   │   └── phcs.json            # 10 Sitapur PHC records with geo-coords & inventory
│   ├── lib/
│   │   ├── domain.ts            # Mathematical scoring, alert generation & transfers
│   │   ├── exportUtils.ts       # CSV export helper for logistics manifests
│   │   └── gemini.ts            # Gemini 2.0 streaming client & SSE reader
│   ├── pages/
│   │   ├── Dashboard.tsx        # District command dashboard
│   │   ├── Alerts.tsx           # AI early warning alerts page
│   │   ├── Redistributions.tsx  # Resource redistribution matrix & export
│   │   ├── PHCNetwork.tsx       # PHC directory overview
│   │   ├── PHCDetail.tsx        # Individual PHC operational audit
│   │   ├── Simulator.tsx        # Multi-scenario crisis simulator
│   │   ├── Assistant.tsx        # AI clinical & operational assistant
│   │   ├── BRICS.tsx            # Global health replication framework
│   │   └── NotFound.tsx         # 404 error page with quick recovery links
│   └── services/
│       ├── assistantService.ts  # Multi-turn prompt orchestration & fallback
│       └── phcService.ts        # Query helpers for PHC data access
├── .env.example                 # Environment configuration template
├── package.json                 # Dependency definitions & run scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Production deployment configuration & cache headers
└── vite.config.ts               # Vite build config with vendor chunk splitting
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (v9+) or **pnpm** / **yarn**

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/risshiisshh/ArogyaNet.git
cd ArogyaNet

# Switch to the active feature branch
git checkout feature/stitch-design-system

# Install dependencies
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```
Open `.env` and configure your Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Note: If omitted, ArogyaNet automatically runs using its built-in local inference engine.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Environment Configuration

| Variable | Required | Default | Purpose |
| :--- | :---: | :---: | :--- |
| `VITE_GEMINI_API_KEY` | Optional | `""` | Google Gemini 2.0 API key for live generative AI responses. If omitted, uses local fallback. |

---

## 🧭 Interactive Features & Walkthroughs

### 🎯 Launching the Judge Demo Tour
Click **"Demo Tour"** in the top navigation or mobile menu to initiate a 4-step guided walkthrough covering:
1. **Overview Dashboard:** Network health index and live bed capacity metrics.
2. **Crisis Simulator:** Simulating a monsoon flash flood and observing real-time metric decay.
3. **Redistributions Engine:** Inspecting AI-calculated surplus-to-deficit transfer corridors.
4. **AI Assistant:** Asking operational questions to the district intelligence copilot.

### 📋 Executive Briefing Generator
Click **"Briefing"** in the navigation header to generate an instant CMO-level executive report summarizing network status, critical facilities, and required immediate actions.

### 📂 Raw Telemetry Inspector
Click **"Datasets"** to open the raw data viewer inspectable in JSON format across all 10 facilities.

---

## 🚢 Production Build & Deployment

### Build Command
```bash
# Run TypeScript verification followed by Vite production packaging
npm run build
```
The output will be generated in the `dist/` directory.

### Preview Bundle Locally
```bash
npm run preview
```

### Deployment Configuration
- **Vercel**: Configured via [vercel.json](file:///Users/rishabhshevde/My%20Projects/ArogyaNet/vercel.json) with client-side SPA routing rewrites and 1-year immutable asset caching (`Cache-Control: public, max-age=31536000, immutable`).
- **Netlify / Cloudflare Pages**: Handled automatically via [public/_redirects](file:///Users/rishabhshevde/My%20Projects/ArogyaNet/public/_redirects) (`/* /index.html 200`).
- **Chunk Optimization**: Configured in [vite.config.ts](file:///Users/rishabhshevde/My%20Projects/ArogyaNet/vite.config.ts) with Rolldown-compatible functional chunk splitting for `vendor-react`, `vendor-icons`, and `vendor-animation`.

---

## 🌐 Roadmap & BRICS Scaling Blueprint

- [x] Full React 19 + Vite migration with responsive Tailwind v4 styling.
- [x] Multi-scenario epidemiological crisis simulator.
- [x] Gemini 2.0 streaming assistant with deterministic local fallback.
- [x] Automated redistribution matrix with CSV manifest export.
- [ ] **Phase 2:** Integration with India's Ayushman Bharat Digital Mission (ABDM) sandbox APIs.
- [ ] **Phase 3:** Low-bandwidth SMS/USSD relay for remote ASHA workers and rural pharmacists without smartphone access.
- [ ] **Phase 4:** Drone-corridor dispatch integration for high-urgency antivenom and blood delivery.

---

## 🤝 Contributing

Contributions, bug reports, and feature proposals are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Push to the Branch (`git push origin feat/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Developed with 💚 for resilient public health systems everywhere.</sub>
</div>
