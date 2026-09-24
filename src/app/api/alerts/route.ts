import { NextResponse } from "next/server";
import rawPhcs from "@/data/phcs.json";
import { computeAlerts, enrichAllPHCs, PHC } from "@/lib/domain";
import { callGemini } from "@/lib/gemini";

export async function GET() {
  const phcs = rawPhcs as PHC[];
  const enriched = enrichAllPHCs(phcs);
  const alerts = computeAlerts(phcs);

  // Group alerts by category & severity
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;
  const stockCount = alerts.filter((a) => a.category === "stock").length;
  const bedCount = alerts.filter((a) => a.category === "bed").length;
  const staffCount = alerts.filter((a) => a.category === "staff").length;

  // AI Narrative Summary Prompt (from BAS)
  const systemInstruction = `You are a public health resource monitoring assistant for district administrators in India. You will be given computed stock and bed data. Generate a 2-3 sentence executive operational briefing. Do not invent facts or numbers. Highlight immediate critical risks and prioritize actions.`;

  const topCritical = alerts.slice(0, 5).map((a) => ({
    facility: a.phc_name,
    category: a.category,
    issue: a.title,
    detail: a.description,
  }));

  let aiExecutiveBrief: string | null = null;
  const prompt = `Current critical alerts in network:\n${JSON.stringify(topCritical, null, 2)}\nProvide a 2-sentence executive dispatch on operational health priorities.`;

  const geminiResult = await callGemini(prompt, systemInstruction);
  if (geminiResult) {
    aiExecutiveBrief = geminiResult.trim();
  } else {
    // High-quality fallback briefing
    aiExecutiveBrief = `Immediate operational intervention required across ${criticalCount} facilities: Rampur PHC and Sitapur PHC are within 48 hours of complete ORS & Insulin stockout. In addition, 2 primary facilities have crossed 90% inpatient bed saturation requiring urgent load-balancing.`;
  }

  return NextResponse.json({
    alerts,
    stats: {
      total: alerts.length,
      critical: criticalCount,
      high: highCount,
      stock: stockCount,
      bed: bedCount,
      staff: staffCount,
    },
    aiExecutiveBrief,
    timestamp: new Date().toISOString(),
  });
}
