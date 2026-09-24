# Backend Architecture Specification (BAS)
## ArogyaNet

---

## 1. Architecture Overview

For the hackathon MVP, the "backend" is intentionally lightweight:

```
[ Frontend (Next.js / Streamlit) ]
        |
        | reads
        v
[ Static Dataset (JSON/CSV) ]
        |
        | sends computed summaries
        v
[ Gemini API (Google AI Studio) ]
        |
        | returns natural-language alerts & recommendations
        v
[ Frontend renders results ]
```

If time allows, a thin backend (Next.js API routes, or a small Flask/FastAPI service) can sit between the frontend and Gemini to keep the API key secure and to pre-process data before sending it to the model. This is recommended over calling Gemini directly from client-side code.

## 2. Recommended Minimal Backend (if used)

A small API layer with the following endpoints is sufficient:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/phcs` | GET | Return the full list of PHCs with current status |
| `/api/phcs/:id` | GET | Return detailed record for one PHC |
| `/api/alerts` | GET | Compute forecasts, call Gemini, return generated alerts |
| `/api/recommendations` | GET | Send network state to Gemini, return redistribution suggestions |
| `/api/ask` *(stretch)* | POST | Accept a free-text question, forward to Gemini with dataset context, return answer |

This keeps the Gemini API key server-side only, and lets the frontend stay simple.

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

```
GEMINI_API_KEY=your_key_here   # store server-side only, never expose in frontend code
```

## 8. Future Scope (mentioned in pitch, not built for MVP)

- Replace static JSON with a real database (Firebase/PostgreSQL) for live updates
- Multi-country data schema to support actual BRICS cross-border model sharing
- Real IoT/sensor integration at PHC level for live stock updates
- Role-based access for district vs. state vs. national level views
