import { enrichAllPHCs, computeAlerts, computeRedistributions, getNetworkSummary, PHC } from "@/lib/domain";
import { callGeminiStream, hasGeminiKey, type GeminiMessage } from "@/lib/gemini";
import rawPhcs from "@/data/phcs.json";

// ─── System prompt for Gemini ────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are ArogyaNet Copilot — an expert district health operations assistant for the Sitapur district health network in Uttar Pradesh, India. You serve as a real-time decision intelligence engine for district healthcare commissioners and Chief Medical Officers (CMOs).

Your responsibilities:
1. Answer queries using ONLY the verified PHC (Primary Health Centre) telemetry data provided in the conversation.
2. Always reference specific PHC names, quantities, percentages, and actionable remedies.
3. Prioritize patient safety — highlight critical shortages, bed saturation, and staffing gaps.
4. When recommending transfers, specify source PHC, destination PHC, medicine, quantity, and reasoning.
5. If the requested information is not in the data, state clearly that it is not available.
6. Use bullet points and bold text for readability. Keep responses concise and operationally actionable.
7. Never fabricate data — derive all numbers from the telemetry context provided.`;

// ─── Build context summary from PHC data ─────────────────────────────────────

function buildContextSummary(phcs: PHC[]): string {
  const enriched = enrichAllPHCs(phcs);
  const summary = getNetworkSummary(enriched);
  const alerts = computeAlerts(phcs);
  const transfers = computeRedistributions(phcs);

  const facilityLines = enriched.map((p) => {
    const critItems = p.critical_items.length > 0 ? `CRITICAL: ${p.critical_items.join(", ")}` : "";
    const lowItems = p.low_items.length > 0 ? `LOW: ${p.low_items.join(", ")}` : "";
    const inventory = p.enriched_inventory
      .map((i) => `${i.medicine_name}: ${i.quantity} units (${i.coverage_label} supply, threshold: ${i.reorder_threshold})`)
      .join("; ");
    return `• ${p.phc_name} [${p.phc_id}] — Status: ${p.status.toUpperCase()} | Beds: ${p.beds_occupied}/${p.beds_total} (${p.bed_occupancy_pct}%) | Staff: ${p.staff_present}/${p.staff_total} (${p.staff_attendance_pct}%) | ${critItems} ${lowItems}\n  Inventory: ${inventory}`;
  });

  const alertLines = alerts.slice(0, 8).map(
    (a) => `• [${a.severity.toUpperCase()}] ${a.title}: ${a.description}`
  );

  const transferLines = transfers.slice(0, 5).map(
    (t) => `• ${t.source_phc_name} → ${t.destination_phc_name}: ${t.quantity} units of ${t.medicine_name} (${t.urgency}). Reason: ${t.reason}`
  );

  return `=== SITAPUR DISTRICT HEALTH NETWORK TELEMETRY ===
Network: ${summary.total} PHCs | ${summary.critical} Critical, ${summary.low} Attention, ${summary.healthy} Healthy | Avg Bed Occupancy: ${summary.avgBedOccupancy}%

FACILITY DETAILS:
${facilityLines.join("\n")}

ACTIVE ALERTS (top ${alertLines.length}):
${alertLines.length > 0 ? alertLines.join("\n") : "No active alerts."}

RECOMMENDED TRANSFERS (top ${transferLines.length}):
${transferLines.length > 0 ? transferLines.join("\n") : "No transfers recommended."}`;
}

// ─── Convert chat messages to Gemini format ──────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildGeminiHistory(messages: ChatMessage[], phcs: PHC[]): GeminiMessage[] {
  const context = buildContextSummary(phcs);
  const geminiMessages: GeminiMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "user") {
      // Inject telemetry context with the first user message only
      const text =
        i === 0 || geminiMessages.length === 0
          ? `${context}\n\n---\nUser Question: ${msg.content}`
          : msg.content;
      geminiMessages.push({ role: "user", parts: [{ text }] });
    } else {
      geminiMessages.push({ role: "model", parts: [{ text: msg.content }] });
    }
  }

  return geminiMessages;
}

// ─── Streaming assistant call ────────────────────────────────────────────────

/**
 * Send a message to the assistant with full conversation history.
 * Streams tokens to the onChunk callback for progressive rendering.
 * Falls back to local deterministic reasoning if no API key is available.
 *
 * @returns The full response text
 */
export async function askAssistantStream(
  messages: ChatMessage[],
  phcs: PHC[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  // Try Gemini streaming first
  if (hasGeminiKey()) {
    const history = buildGeminiHistory(messages, phcs);
    const result = await callGeminiStream(history, SYSTEM_INSTRUCTION, onChunk, signal);
    if (result) return result;
  }

  // Fallback: compute a smart local answer
  const lastQuestion = messages[messages.length - 1]?.content || "";
  const answer = computeLocalAnswer(lastQuestion, phcs);

  // Simulate streaming for the local fallback (typewriter effect)
  const words = answer.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) break;
    const chunk = (i === 0 ? "" : " ") + words[i];
    accumulated += chunk;
    onChunk(chunk);
    // Small delay for typewriter feel
    await new Promise((r) => setTimeout(r, 12 + Math.random() * 18));
  }

  return accumulated;
}

// ─── Smart local fallback (data-driven, not hardcoded) ───────────────────────

function computeLocalAnswer(question: string, phcs: PHC[]): string {
  const enriched = enrichAllPHCs(phcs);
  const summary = getNetworkSummary(enriched);
  const alerts = computeAlerts(phcs);
  const transfers = computeRedistributions(phcs);
  const q = question.toLowerCase();

  // Stock / restock / shortage queries
  if (q.includes("restock") || q.includes("stock") || q.includes("urgent") || q.includes("shortage") || q.includes("critical")) {
    const criticalPhcs = enriched.filter((p) => p.critical_items.length > 0);
    if (criticalPhcs.length === 0) {
      return "**All facilities are currently well-stocked.** No critical inventory shortages detected across the Sitapur network.";
    }
    const lines = criticalPhcs.map((p, i) => {
      const items = p.enriched_inventory
        .filter((it) => it.item_status === "critical")
        .map((it) => `**${it.medicine_name}** (${it.quantity} units, ${it.coverage_label} supply)`)
        .join(", ");
      return `${i + 1}. **${p.phc_name}** (${p.district}): ${items}`;
    });
    return `**${criticalPhcs.length} PHC(s) require immediate restocking:**\n\n${lines.join("\n")}\n\n**Recommended Action:** Review the redistribution matrix for available peer transfer corridors.`;
  }

  // Bed / capacity / occupancy queries
  if (q.includes("bed") || q.includes("capacity") || q.includes("occupancy") || q.includes("inpatient")) {
    const sorted = [...enriched].sort((a, b) => b.bed_occupancy_pct - a.bed_occupancy_pct);
    const lines = sorted
      .slice(0, 5)
      .map(
        (p) =>
          `• **${p.phc_name}**: ${p.beds_occupied}/${p.beds_total} beds (${p.bed_occupancy_pct}%)${p.bed_occupancy_pct > 90 ? " ⚠️ **Critical**" : p.bed_occupancy_pct > 75 ? " ⚡ High" : ""}`
      );
    return `**Inpatient Bed Capacity Overview** (Top 5 by occupancy):\n\n${lines.join("\n")}\n\n**District Average:** ${summary.avgBedOccupancy}% occupancy across ${summary.total} facilities.`;
  }

  // Staff / doctor / nurse queries
  if (q.includes("staff") || q.includes("doctor") || q.includes("nurse") || q.includes("attendance") || q.includes("roster")) {
    const lowStaff = enriched
      .filter((p) => p.staff_attendance_pct < 80)
      .sort((a, b) => a.staff_attendance_pct - b.staff_attendance_pct);
    if (lowStaff.length === 0) {
      return "**All facilities are operating at ≥80% staffing levels.** No attendance deficits detected.";
    }
    const lines = lowStaff.map(
      (p) =>
        `• **${p.phc_name}**: ${p.staff_present}/${p.staff_total} present (${p.staff_attendance_pct}%)`
    );
    return `**Facilities with reduced staffing:**\n\n${lines.join("\n")}\n\nAll other facilities are operating at ≥80% roster strength.`;
  }

  // Transfer / redistribution queries
  if (q.includes("transfer") || q.includes("redistribution") || q.includes("redistribute") || q.includes("surplus") || q.includes("donor")) {
    if (transfers.length === 0) {
      return "**No redistribution transfers are recommended at this time.** All facilities have adequate stock levels.";
    }
    const lines = transfers.slice(0, 5).map(
      (t, i) =>
        `${i + 1}. **${t.source_phc_name}** → **${t.destination_phc_name}**: ${t.quantity} units of **${t.medicine_name}** (${t.urgency})\n   *Reason: ${t.reason}*`
    );
    return `**Recommended Peer Transfers** (${transfers.length} identified):\n\n${lines.join("\n")}`;
  }

  // Alert queries
  if (q.includes("alert") || q.includes("warning") || q.includes("notification")) {
    if (alerts.length === 0) {
      return "**No active alerts.** All facilities are operating within normal parameters.";
    }
    const lines = alerts.slice(0, 6).map(
      (a) => `• [**${a.severity.toUpperCase()}**] ${a.title}`
    );
    return `**${alerts.length} Active Alert(s):**\n\n${lines.join("\n")}\n\nVisit the Alerts panel for full details and mitigation actions.`;
  }

  // PHC-specific queries (search for PHC name in question)
  const matchedPhc = enriched.find((p) =>
    q.includes(p.phc_name.toLowerCase()) || q.includes(p.phc_id.toLowerCase())
  );
  if (matchedPhc) {
    const invLines = matchedPhc.enriched_inventory.map(
      (i) =>
        `• **${i.medicine_name}**: ${i.quantity} units (${i.coverage_label}${i.item_status === "critical" ? " ⚠️ CRITICAL" : i.item_status === "low" ? " ⚡ LOW" : ""})`
    );
    return `**${matchedPhc.phc_name}** (${matchedPhc.district}) — Status: **${matchedPhc.status.toUpperCase()}**\n\n` +
      `• Beds: ${matchedPhc.beds_occupied}/${matchedPhc.beds_total} (${matchedPhc.bed_occupancy_pct}%)\n` +
      `• Staff: ${matchedPhc.staff_present}/${matchedPhc.staff_total} (${matchedPhc.staff_attendance_pct}%)\n\n` +
      `**Inventory:**\n${invLines.join("\n")}`;
  }

  // Summarize / overview / general queries
  const criticalPhcs = enriched.filter((p) => p.status === "critical");
  const criticalNames = criticalPhcs.map((p) => `**${p.phc_name}**`).join(", ");
  return `**Sitapur District Health Network Summary**\n\n` +
    `• **${summary.total}** Primary Health Centres monitored\n` +
    `• **${summary.critical}** Critical | **${summary.low}** Needs Attention | **${summary.healthy}** Healthy\n` +
    `• Average bed occupancy: **${summary.avgBedOccupancy}%**\n` +
    `• Active alerts: **${alerts.length}**\n` +
    `• Pending transfers: **${transfers.length}**\n` +
    (criticalNames ? `\nFacilities requiring immediate attention: ${criticalNames}` : "") +
    `\n\nAsk me about specific PHCs, stock levels, bed capacity, staffing, or transfer recommendations for detailed operational intelligence.`;
}

// ─── Legacy non-streaming call (backwards compat) ────────────────────────────

export async function askAssistant(question: string): Promise<string> {
  const phcs = rawPhcs as PHC[];
  let result = "";
  await askAssistantStream(
    [{ role: "user", content: question }],
    phcs,
    (chunk) => { result += chunk; }
  );
  return result || "I'm sorry, I couldn't process that request. Please try again.";
}
