# ArogyaNet Design Specification for Google Stitch

## Product Direction

ArogyaNet is an AI-powered public-health resource resilience dashboard for district and state health administrators. It monitors Primary Health Centres (PHCs), predicts medicine stock-outs, highlights bed and staff pressure, and recommends safe redistribution actions across the network.

Design the product as a calm civic operations dashboard, not a consumer wellness app. The interface should feel modern, trustworthy, soft, and highly scannable, inspired by the attached reference image: a light canvas, floating rounded panels, pill navigation, large clear metrics, compact charts, and gentle status colors.

Primary user: a non-technical district health administrator who needs to understand risk and take action within seconds.

Core tagline: "See the shortage before it happens. Move resources before it's a crisis."

## Visual Style

Use a soft command-center layout with a premium dashboard feel:

- Warm light grey app background.
- Large rounded white workspace container.
- Floating white cards with subtle borders and very soft shadows.
- Black or deep navy active navigation pills.
- Soft purple, teal, amber, red, and green status accents.
- Rounded pill filters and action buttons.
- Friendly but official tone: approachable, calm, and decisive.
- No harsh enterprise table-heavy look unless the screen specifically needs inventory details.
- No stock photography, hero images, decorative gradients, maps as the main visual, or wellness/gym styling.

The attached reference image should guide the interaction density, card proportions, rounded edges, spacing, and pill-shaped controls. Replace fitness content with public health operations content.

## Design Tokens

### Colors

- App background: `#EDEEF0`
- Main workspace surface: `#F8F8FA`
- Card surface: `#FFFFFF`
- Raised muted surface: `#F3F4F6`
- Primary text: `#111318`
- Secondary text: `#626875`
- Muted text: `#8D93A1`
- Hairline border: `#E7E9EE`
- Soft shadow: `0 18px 45px rgba(17, 19, 24, 0.08)`

### Brand and Action Colors

- Primary action black: `#111318`
- Primary action hover: `#252830`
- Teal AI accent: `#0F8F88`
- Teal tint: `#E7F7F5`
- Purple accent: `#A994FF`
- Purple tint: `#EEE8FF`
- Amber accent: `#F2C94C`
- Amber tint: `#FFF2BF`
- Red critical: `#E05252`
- Red tint: `#FDEAEA`
- Green healthy: `#2FA86B`
- Green tint: `#E7F7EF`
- Blue info: `#4A90E2`
- Blue tint: `#EAF3FF`

### Typography

Use Inter, Manrope, or a similar clean rounded sans-serif.

- Page title: 34-40px, line-height 1.05, weight 700, letter spacing 0
- Section title: 20-24px, line-height 1.2, weight 700
- Card title: 17-19px, line-height 1.25, weight 700
- Body text: 14px, line-height 20px, weight 400
- Small/meta text: 12-13px, line-height 18px, weight 400
- Metric numerals: 44-64px, line-height 1, weight 600, tabular numerals
- Button labels: 14px, weight 600

Do not use negative letter spacing. Keep text compact and legible.

### Layout

Desktop canvas target: 1440px wide.

- Outer page padding: 44-56px
- Main app shell: centered, max width 1320-1440px, min height 860px, radius 28-36px
- App shell padding: 28-32px
- Top navigation height: 54-64px
- Card radius: 18-24px
- Button and chip radius: 999px for pills, 12px for rectangular controls
- Card padding: 20-28px
- Main grid gap: 16-24px

Keep the first viewport as a complete working dashboard. Do not create a marketing landing page.

## Navigation

Use a top pill navigation system like the reference image, not a dark left sidebar.

Top-left:

- Small circular product mark using a health cross plus connected-node motif.
- Product label may be shown as "ArogyaNet" near the mark on wider screens.

Main nav pills:

- Dashboard
- PHC Network
- Alerts
- Redistribution
- BRICS Network
- Assistant

Active nav:

- Black pill background `#111318`
- White text
- White/grey icon

Inactive nav:

- White pill background
- Soft border or shadow
- Secondary text
- Outline icon

Top-right utility icons:

- Search
- Notifications with red dot badge
- Refresh/sync
- Theme toggle or display mode toggle
- User avatar for District Admin

## Core Data Context

Use this project data consistently across screens.

Primary network:

- Country: India
- District: Sitapur District
- PHCs monitored: 18
- Critical PHCs: 2
- Needs attention: 3
- Healthy: 13

Primary PHCs:

- Rampur PHC: critical, 18/20 beds occupied, 4/6 staff present, ORS Sachets stockout in 2.5 days, Amoxicillin below reorder level.
- Maholi PHC: healthy, surplus ORS available.
- Biswan PHC: needs attention, insulin approaching reorder level.
- Khairabad PHC: healthy.
- Hargaon PHC: healthy.
- Laharpur PHC: needs attention.

Medicines:

- ORS Sachets
- Amoxicillin 250mg
- Insulin
- Paracetamol 500mg
- IV Fluids

Flagship recommendation:

- Transfer 120 ORS Sachets from Maholi PHC to Rampur PHC.
- Reason: Maholi stays above safe stock after transfer; Rampur gains 17.5 days of coverage and avoids stockout.

BRICS comparison demo network:

- South Africa, eThekwini Health Network.
- Umlazi CHC: critical ARV Medication shortage.
- Phoenix CHC: healthy ARV Medication surplus.
- Chatsworth CHC: needs attention.
- Recommendation: transfer 80 units of ARV Medication from Phoenix CHC to Umlazi CHC.

## Key Screens

### 1. Dashboard

Purpose: give a single-screen view of network health and urgent actions.

Structure:

- Top pill navigation and utility icons.
- Greeting/subtitle: "Good morning, District Admin"
- Large title: "PHC Network Overview"
- Small badge: "AI monitored"
- Right-side action cluster with overlapping mini avatars or facility icons and a black "New scenario" or "Run simulation" button.

Main widgets:

- Category filter pills: All PHCs, Critical, Needs attention, Healthy, Transfers.
- Large "Network Readiness" card with PHC status bars or compact grid.
- Large "Redistribution Schedule" or "Action Timeline" card showing transfer cards across dates.
- Metric cards:
  - "18 PHCs monitored"
  - "2 critical risks"
  - "3 need attention"
  - "1 transfer recommended"
- Location/network card with a soft abstract district map background and active PHC pin.
- Messages/coordination card listing district officers or PHC contacts.
- Daily coverage card showing medicine coverage bars.
- Bed occupancy card with a simple line or area chart.

Visual behavior:

- Use large numbers and concise labels.
- Use red only for genuine critical items.
- Use purple and amber for forecast and timeline accents.
- Use teal for AI insights and recommended actions.

### 2. PHC Detail

Purpose: show one PHC's operational status and why it is critical.

Use Rampur PHC.

Content:

- Title: "Rampur PHC"
- Critical badge
- Metadata: "PHC001 · Sitapur District"
- AI callout: "Action needed today: ORS Sachets are expected to run out in 2.5 days. Maholi PHC has suitable surplus."
- KPI cards for bed occupancy, staff present, and items at risk.
- Inventory table with:
  - ORS Sachets: 20 current, 8/day, reorder 30, 2.5 days, Critical
  - Amoxicillin 250mg: 40 current, 15/day, reorder 50, 2.7 days, Critical
  - Insulin: 56 current, 4/day, reorder 25, 14 days, Healthy
  - Paracetamol 500mg: 210 current, 18/day, reorder 80, 11.7 days, Healthy
  - IV Fluids: 46 current, 5/day, reorder 20, 9.2 days, Healthy
- Forecast card showing ORS declining below threshold.
- Attention timeline: Today, stockout in 2.5 days, recommended transfer.

### 3. Alerts

Purpose: show prioritized early warnings from computed data.

Content:

- Title: "Early Warnings"
- AI summary strip: "AI has identified 2 critical risks requiring action today."
- Search and severity filters.
- Alert feed:
  - ORS Sachets at Rampur PHC will run out in 2.5 days.
  - Amoxicillin at Rampur PHC is below reorder level.
  - Bed occupancy at Rampur PHC has reached 90%.
  - Biswan PHC may reach insulin reorder level within 3 days.
  - Staff attendance at Rampur PHC is lower than usual today.
  - ORS stock level restored at Khairabad PHC.
- Side card explaining alert rules in plain language.

### 4. Redistribution

Purpose: highlight the flagship AI recommendation.

Content:

- Title: "Redistribution Recommendations"
- AI insight card: "1 urgent transfer can prevent a stockout at Rampur PHC today."
- Featured transfer card:
  - "Transfer 120 ORS Sachets from Maholi PHC to Rampur PHC"
  - Source: Maholi PHC, ORS stock 360, safe after transfer 240.
  - Transfer amount: 120 units.
  - Destination: Rampur PHC, ORS stock 20, after transfer 140.
  - AI reasoning: "Maholi has enough ORS to stay above its reorder level after the transfer. Moving 120 units now covers Rampur's immediate need and prevents a stockout in about 2.5 days."
- Network impact:
  - 1 critical risk addressed
  - 0 source PHCs below safety stock
  - 17.5 days of ORS coverage added
- Action buttons:
  - View source and destination
  - Approve for coordination

### 5. BRICS Network

Purpose: demonstrate reusable model logic across countries.

Content:

- Title: "One Model, Multiple Health Networks"
- Diagram: India network data and South Africa network data both connect to a shared ArogyaNet AI model.
- Two comparison cards:
  - India · Sitapur District Network: transfer 120 ORS Sachets from Maholi PHC to Rampur PHC.
  - South Africa · eThekwini Health Network: transfer 80 ARV Medication units from Phoenix CHC to Umlazi CHC.
- Footer note: "Each network keeps its own data. The shared model logic helps every member network detect shortages and plan redistribution."

### 6. Emergency Simulator

Purpose: model a demand surge and show before/after response.

Content:

- Title: "Emergency Scenario Simulator"
- Scenario dropdown: "Disease Outbreak — Sitapur District"
- Intensity segmented control: Mild, Moderate, Severe
- Run Simulation button
- Before/after network status cards:
  - Current network: mostly healthy, Rampur critical.
  - Simulated severe outbreak: several PHCs critical or needing attention.
- AI response:
  - 4 new critical alerts generated.
  - 2 additional redistribution transfers recommended.
  - Average coverage drops from 11 days to 3 days without intervention.

### 7. Admin Assistant

Purpose: data-grounded Q&A for administrators.

Content:

- Title: "Ask ArogyaNet"
- Trust note: "Answers use the current network dataset only."
- Suggested prompts:
  - Which PHCs need urgent restocking?
  - Where are beds most constrained?
  - Why is Rampur PHC critical?
  - What transfers are recommended?
- Example answer:
  - "Rampur PHC needs urgent restocking. ORS Sachets are expected to run out in 2.5 days, and Amoxicillin is below its reorder level."
- Result cards linking to Rampur PHC and the ORS transfer recommendation.

## Interaction Rules

- Dashboard cards should link to the relevant detail screens.
- Alert rows should open the related PHC detail.
- Redistribution cards should open source/destination details.
- "Approve for coordination" records intent only; it should not imply procurement or real transfer execution.
- Emergency simulation changes displayed risk states but does not write to live records.
- Admin Assistant must answer only from available PHC data and say when data is unavailable.

## Copy Tone

Use short, plain-language operational copy.

Good:

- "ORS stockout in 2.5 days"
- "Move 120 units from Maholi to Rampur"
- "2 beds available"
- "AI prioritized"

Avoid:

- Technical phrases like "model confidence", "algorithmic inference", or "feature vector"
- Alarmist crisis language
- Patient-level medical advice
- Procurement or payment wording

## Explicit Avoids

- Do not create a landing page.
- Do not use a dark left sidebar.
- Do not make the app look like a fitness, wellness, finance, or generic SaaS dashboard.
- Do not use stock photography.
- Do not use heavy gradients, decorative blobs, or oversized empty-state illustrations.
- Do not expose API keys, backend implementation details, or Gemini prompt internals in the UI.
- Do not ask AI to perform arithmetic visibly in the interface; show already-computed values.
