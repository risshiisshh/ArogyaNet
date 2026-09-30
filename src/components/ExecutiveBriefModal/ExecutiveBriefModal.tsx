import { useState } from "react";
import { useNetworkData } from "@/context/NetworkDataContext";

export function ExecutiveBriefModal() {
  const { isPitchModalOpen, closePitchModal, summary, startTour } = useNetworkData();
  const [copied, setCopied] = useState(false);

  if (!isPitchModalOpen) return null;

  const memoText = `================================================================================
OFFICIAL HEALTH TELEMETRY BRIEFING — SITAPUR DISTRICT PUBLIC HEALTH RESILIENCE
Generated via ArogyaNet Digital Public Good (BRICS Track 3: Healthcare Resilience)
================================================================================
Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
Network Scope: 18 Primary Health Centres Monitored | Tier-1 Formulary Sync: Active

EXECUTIVE SUMMARY:
- Monitored Facilities: ${summary.total} Centres
- Critical Deficit Flags: ${summary.critical} Facilities (Immediate buffer intervention)
- Attention Horizon (<=3d stock): ${summary.low} Facilities
- Stable / Healthy: ${summary.healthy} Facilities
- Average District Bed Occupancy: ${summary.avgBedOccupancy}%

PRIORITY INTERVENTION MANIFEST:
1. RAMPUR PHC (#PHC-001): ORS Sachets depleted to 20 units (2.5 days supply).
   RECOMMENDED ACTION: Algorithmic rebalance of 120 units from Maholi PHC (#PHC-002) via SH-26 transit corridor (24m ETA).
   RISK EVALUATION: Maholi retains 38 days buffer; zero secondary cascade risk.

2. BED LOAD BALANCING:
   Sitapur Central inpatient saturation at 90%. Diversion corridor established with Hargaon PHC.

DIGITAL PUBLIC GOOD & FEDERATED POLICY:
ArogyaNet is architected as an interoperable, open public health intelligence platform conformant with BRICS Federated Healthcare Standards. Telemetry models and deterministic stockout algorithms are reusable across developing health networks without proprietary vendor lock-in.
================================================================================`;

  const copyMemo = () => {
    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card-surface w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-border-hairline flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-hairline pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  ArogyaNet Executive Pitch &amp; Briefing
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-tint text-teal-accent font-label-sm text-[11px] font-bold">
                  BRICS Track 3
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Smart Health &amp; Supply Chain Resilience · Digital Public Good Architecture
              </p>
            </div>
          </div>
          <button
            onClick={closePitchModal}
            className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Core Narrative Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Problem */}
          <div className="p-4 rounded-2xl bg-red-tint/50 border border-red-critical/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-critical">
              <span className="material-symbols-outlined text-lg">crisis_alert</span>
              <h4 className="font-label-md text-label-md font-bold">The Problem</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Decentralized health clinics operate in data silos. Stockouts and bed surges are only recognized after clinics have already run dry, risking patient lives.
            </p>
          </div>

          {/* Card 2: Solution */}
          <div className="p-4 rounded-2xl bg-teal-tint/50 border border-teal-accent/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-teal-accent">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <h4 className="font-label-md text-label-md font-bold">The AI Fix</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              ArogyaNet combines deterministic arithmetic with Gemini reasoning to forecast stockouts days in advance and automatically routes zero-deficit surplus transfers.
            </p>
          </div>

          {/* Card 3: BRICS Public Good */}
          <div className="p-4 rounded-2xl bg-blue-tint/50 border border-blue-info/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-info">
              <span className="material-symbols-outlined text-lg">public</span>
              <h4 className="font-label-md text-label-md font-bold">BRICS Resilience</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Open schema architecture designed as a Digital Public Good, allowing member nations to share predictive models and cross-border emergency relief corridors.
            </p>
          </div>
        </div>

        {/* Live Memo Preview Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-text-muted uppercase tracking-wider">
              Live Generated District Dispatch Memo
            </span>
            <button
              onClick={copyMemo}
              className="text-xs font-label-sm text-teal-accent hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? "check" : "content_copy"}
              </span>
              <span>{copied ? "Copied to Clipboard!" : "Copy Official Memo"}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-workspace-surface border border-border-hairline text-[12px] font-mono text-text-primary whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
            {memoText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-hairline">
          <button
            onClick={() => {
              closePitchModal();
              startTour();
            }}
            className="px-5 py-2.5 rounded-full bg-teal-accent text-white font-label-md text-sm font-bold shadow-md hover:bg-teal-accent/90 transition-all flex items-center gap-2 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            <span>Launch 90-Second Judge Demo</span>
          </button>

          <button
            onClick={closePitchModal}
            className="px-5 py-2.5 rounded-full bg-text-primary text-on-primary font-label-md text-sm shadow-sm hover:bg-action-hover transition-colors cursor-pointer"
            type="button"
          >
            Close Executive Briefing
          </button>
        </div>
      </div>
    </div>
  );
}
