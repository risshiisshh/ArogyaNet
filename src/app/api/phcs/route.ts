import { NextResponse } from "next/server";
import rawPhcs from "@/data/phcs.json";
import { enrichAllPHCs, getNetworkSummary, PHC } from "@/lib/domain";

export async function GET() {
  const phcs = rawPhcs as PHC[];
  const enriched = enrichAllPHCs(phcs);
  const summary = getNetworkSummary(enriched);

  return NextResponse.json({
    phcs: enriched,
    summary,
    timestamp: new Date().toISOString(),
  });
}
