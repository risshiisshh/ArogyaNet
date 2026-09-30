# Backend Architecture Specification (BAS)
## ArogyaNet

---

## 1. Architecture Overview

For the hackathon MVP, ArogyaNet is designed as a streamlined, client-driven React SPA with deterministic resilience rules and direct or proxied Gemini AI inference:

```
[ Frontend (React + Vite + TypeScript SPA) ]
        |
        | reads / syncs
        v
[ Typed Static Telemetry Dataset (JSON/Data Modules) ]
        |
        | sends computed telemetry summaries
        v
[ Gemini API (Google AI Studio / @google/genai) ]
        |
        | returns natural-language alerts, routes & recommendations
        v
[ React View Layer renders interactive cards & maps ]
```

A lightweight backend service (e.g., Express / FastAPI / Serverless Functions) can optionally sit between the frontend and Gemini to proxy API calls and protect the key. In the client-only mode, the application uses `VITE_GEMINI_API_KEY` with graceful fallback to deterministic operational logic if offline or rate-limited.

## 2. Minimal Backend / Service Layer (Optional)

If a proxy API or serverless route layer is deployed:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/phcs` | GET | Return the full list of PHCs with current status |
| `/api/phcs/:id` | GET | Return detailed record for one PHC |
| `/api/alerts` | GET | Compute forecasts, call Gemini, return generated alerts |
| `/api/recommendations` | GET | Send network state to Gemini, return redistribution suggestions |
| `/api/ask` | POST | Accept a free-text question, forward to Gemini with dataset context, return answer |

When running as a pure React SPA, these operations are encapsulated in modular frontend service modules (`src/services/` and `src/lib/gemini.ts`).

## 3. Data Schema

### 3.1 PHC Record
```json
{
  "phc_id": "PHC001",
  "phc_name": "Rampur PHC",
  "district": "Sitapur",
  "beds_total": 20,
  "beds_occupied": 18,
  "staff_total": 6,
  "staff_present": 4,
  "inventory": [
    {
      "medicine_name": "Amoxicillin",
      "quantity": 40,
      "daily_consumption_rate": 15,
      "reorder_threshold": 50
    },
    {
      "medicine_name": "ORS Sachets",
      "quantity": 20,
      "daily_consumption_rate": 8,
      "reorder_threshold": 30
    }
  ]
}
```

### 3.2 Sample Dataset Size
- 15-20 PHC records
- 2-3 districts
- 4-6 medicine types per PHC (keep it consistent across PHCs so redistribution logic has matching item names to compare)

## 4. Core Computation Layer (before calling Gemini)

Do NOT ask Gemini to do arithmetic from scratch — compute the numbers yourself first, then ask Gemini to *explain and reason* over the computed results. This is both more reliable and cheaper.

```javascript
function getDaysUntilStockout(item) {
  return item.quantity / item.daily_consumption_rate;
}

function classifyPHCStatus(phc) {
  const bedOccupancyPct = phc.beds_occupied / phc.beds_total;
  const critical = phc.inventory.some(i => i.quantity <= i.reorder_threshold) || bedOccupancyPct > 0.9;
  const low = phc.inventory.some(i => getDaysUntilStockout(i) <= 3);
  if (critical) return "critical";
  if (low) return "low";
  return "healthy";
}
```

## 5. Gemini Prompt Templates

### 5.1 Alert Generation Prompt
```
System: You are a health resource monitoring assistant. You will be given
computed stock data for health centres. Generate short, clear, prioritized
warnings for administrators. Do not invent numbers — only use the data given.
Keep each alert to one sentence.

User: Here is the current stock forecast data:
[
  { "phc_name": "Rampur PHC", "medicine": "ORS Sachets", "days_until_stockout": 2.5 },
  { "phc_name": "Sitapur PHC", "medicine": "Insulin", "days_until_stockout": 1.2 }
]

Generate a prioritized list of warnings, most urgent first.
```

### 5.2 Redistribution Recommendation Prompt
```
System: You are a supply chain optimization assistant for public health
centres. You will be given the full inventory state of a network of PHCs.
Identify centres with surplus stock and centres with critical shortages of
the SAME medicine, and suggest specific transfers. For each suggestion,
give: source PHC, destination PHC, medicine, quantity to move, and one
sentence of reasoning. Only suggest transfers where a genuine surplus and
genuine deficit both exist for the same item.

User: Here is the full network inventory state:
[ ...full PHC array as per schema above... ]

Suggest the top 3 most urgent redistribution actions.
```

### 5.3 Admin Q&A Prompt (stretch feature)
```
System: You are an assistant answering questions about a public health
centre network using only the data provided. If the answer isn't in the
data, say so rather than guessing.

User: Data: [...full PHC array...]
Question: "Which PHCs need urgent restocking today?"
```

## 6. Error Handling & Demo Safety

- Wrap every Gemini API call in try/catch with a sensible fallback message
- Pre-generate and cache at least one full set of alerts + recommendations from a test run, so if the live API call is slow or fails during the demo, you can fall back to the cached version without the audience noticing
- Set a reasonable timeout (e.g., 8-10 seconds) on API calls with a loading state in the UI

## 7. Environment & Config

```bash
# Vite client environment configuration (.env)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 8. Future Scope (mentioned in pitch, not built for MVP)

- Replace static JSON with a real database (Firebase/PostgreSQL) for live updates
- Multi-country data schema to support actual BRICS cross-border model sharing
- Real IoT/sensor integration at PHC level for live stock updates
- Role-based access for district vs. state vs. national level views
