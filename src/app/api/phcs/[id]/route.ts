import { NextResponse } from "next/server";
import rawPhcs from "@/data/phcs.json";
import { enrichPHC, PHC, computeAlerts } from "@/lib/domain";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const phcs = rawPhcs as PHC[];
  const found = phcs.find(
    (p) => p.phc_id.toLowerCase() === id.toLowerCase() || p.phc_name.toLowerCase().includes(id.toLowerCase())
  );

  if (!found) {
    return NextResponse.json({ error: "PHC facility not found" }, { status: 404 });
  }

  const enriched = enrichPHC(found);
  const facilityAlerts = computeAlerts(phcs).filter((a) => a.phc_id === found.phc_id);

  // Generate 7-day trajectory projection for key inventory items
  const projections = enriched.enriched_inventory.map((item) => {
    const days: { day: string; projected_stock: number; safe_threshold: number }[] = [];
    const now = new Date();
    for (let i = 0; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dayLabel = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
      const proj = Math.max(0, Math.round(item.quantity - item.daily_consumption_rate * i));
      days.push({
        day: dayLabel,
        projected_stock: proj,
        safe_threshold: item.reorder_threshold,
      });
    }
    return {
      medicine_name: item.medicine_name,
      current: item.quantity,
      rate: item.daily_consumption_rate,
      threshold: item.reorder_threshold,
      days_until_stockout: item.days_until_stockout,
      status: item.item_status,
      projections: days,
    };
  });

  return NextResponse.json({
    phc: enriched,
    alerts: facilityAlerts,
    projections,
  });
}
