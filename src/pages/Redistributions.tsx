import { useState } from "react";
import { Link } from "react-router-dom";
import { exportRedistributionManifestCSV } from "@/lib/exportUtils";
import { computeRedistributions } from "@/lib/domain";
import { useNetworkData } from "@/context/NetworkDataContext";

export default function RedistributionPage() {
  const { phcs, recommendations } = useNetworkData();
  const [isApproved, setIsApproved] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 800);
  };

  const handleApprove = () => {
    setIsApproved(true);
    setShowConsentModal(true);
  };

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col w-full gap-space-lg">
        {/* Header Cluster */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-healthy animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-text-muted tracking-wider uppercase">
                Updated 10:25 IST · Telemetry Active
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              Redistribution Recommendations
            </h1>
            <p className="font-body-md text-body-md text-text-secondary max-w-2xl">
              AI-matched facility transfers that resolve urgent stockout vulnerabilities while rigorously safeguarding source-centre safety buffers.
            </p>
          </div>
          {/* Action Pills */}
          <div className="flex items-center gap-space-xs shrink-0">
            <button
              onClick={() => {
                const transfers = recommendations.length > 0 ? recommendations : computeRedistributions(phcs);
                exportRedistributionManifestCSV(transfers);
              }}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-card-surface text-text-primary font-label-md text-label-md shadow-[0_4px_14px_rgba(17,19,24,0.04)] hover:bg-surface-muted transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-teal-accent">
                download
              </span>
              <span>Export Manifest (CSV)</span>
            </button>
            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-card-surface text-text-primary font-label-md text-label-md shadow-[0_4px_14px_rgba(17,19,24,0.04)] hover:bg-surface-muted transition-colors active:scale-95 cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span
                className={`material-symbols-outlined text-base text-teal-accent transition-transform duration-700 ${
                  isRecalculating ? "rotate-180" : ""
                }`}
              >
                sync
              </span>
              <span>{isRecalculating ? "Recalculating..." : "Recalculate"}</span>
            </button>
          </div>
        </div>

        {/* AI Insight Alert Banner */}
        <div className="w-full bg-teal-tint rounded-lg p-space-md sm:p-space-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-[0_4px_20px_rgba(15,143,136,0.06)]">
          <div className="flex items-start sm:items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-card-surface flex items-center justify-center text-teal-accent shadow-[0_2px_8px_rgba(17,19,24,0.04)] shrink-0">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-headline-sm text-headline-sm text-text-primary">
                  1 urgent transfer can prevent a stockout at Rampur PHC today
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                  Critical Window
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                Recommendations analyze real-time cold-chain logs, daily burn rates, and minimum mandated reorder levels across 14 Sitapur district facilities.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="font-label-sm text-label-sm text-teal-accent bg-card-surface px-3 py-1.5 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
              High Confidence · 99.4%
            </span>
          </div>
        </div>

        {/* Main Asymmetric Workspace Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: Featured Transfer & Secondary Lists (8 Cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-lg">
            {/* Featured Transfer Card */}
            <div className="bg-card-surface rounded-lg p-space-lg sm:p-7 shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col gap-6">
              {/* Card Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-critical"></span>
                    Urgent Priority
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm">
                    Recommendation 01 · Sitapur Network
                  </span>
                  {isApproved && (
                    <span className="px-3 py-1 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-healthy"></span>
                      Approved &amp; Logged
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-text-muted font-body-sm text-body-sm">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">route</span>
                    14 km via SH-26
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-green-healthy font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Telemetry Verified
                  </span>
                </div>
              </div>

              {/* Featured Title */}
              <div>
                <h2 className="font-headline-md text-headline-md text-text-primary tracking-tight">
                  Transfer 120 ORS Sachets from Maholi PHC to Rampur PHC
                </h2>
                <p className="font-body-md text-body-md text-text-secondary mt-1">
                  Reallocates excess buffer stock to avert projected complete depletion at Rampur within 60 hours.
                </p>
              </div>

              {/* Transfer Interactive Visual Representation Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-workspace-surface p-4 sm:p-6 rounded-lg">
                {/* Source Facility Node (5 cols) */}
                <div className="md:col-span-5 bg-green-tint rounded-DEFAULT p-5 flex flex-col gap-3 shadow-[0_4px_16px_rgba(47,168,107,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-card-surface text-green-healthy font-label-sm text-label-sm font-semibold">
                      Source Facility
                    </span>
                    <span className="font-label-sm text-label-sm text-green-healthy flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Surplus (+160u)
                    </span>
                  </div>
                  <div>
                    <div className="font-headline-sm text-headline-sm text-text-primary">
                      Maholi PHC
                    </div>
                    <div className="font-body-sm text-body-sm text-text-secondary">
                      Sub-district Hub · Facility #UP-STP-04
                    </div>
                  </div>
                  <div className="pt-2 flex flex-col gap-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-body-sm text-body-sm text-text-secondary">
                        Current ORS Stock:
                      </span>
                      <span className="font-label-md text-label-md text-text-primary font-bold">
                        360 units
                      </span>
                    </div>
                    <div className="w-full bg-card-surface rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-healthy h-full rounded-full transition-all duration-500"
                        style={{ width: isApproved ? "66%" : "82%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-body-sm font-body-sm text-text-muted mt-1">
                      <span>Safe floor after move:</span>
                      <span className="font-label-sm text-label-sm text-text-primary font-bold">
                        240 units
                      </span>
                    </div>
                  </div>
                  <div className="text-text-muted font-body-sm text-body-sm pt-2 bg-card-surface/70 -mx-2 px-3 py-1.5 rounded-full flex items-center justify-between">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-text-secondary">
                        distance
                      </span>
                      14 km transit
                    </span>
                    <span className="font-label-sm text-label-sm text-text-secondary">
                      ~25 mins transit time
                    </span>
                  </div>
                </div>

                {/* Transfer Arrow Node (1 col) */}
                <div className="md:col-span-1 flex flex-col items-center justify-center gap-2 py-2 md:py-0">
                  <div className="w-12 h-12 rounded-full bg-text-primary text-on-primary flex items-center justify-center shadow-[0_8px_20px_rgba(17,19,24,0.18)] hover:scale-105 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-2xl rotate-90 md:rotate-0">
                      east
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="font-headline-sm text-headline-sm text-teal-accent font-bold">
                      120
                    </span>
                    <span className="font-label-sm text-label-sm text-text-secondary -mt-1 uppercase text-[10px]">
                      Units
                    </span>
                  </div>
                </div>

                {/* Destination Facility Node (5 cols) */}
                <div className="md:col-span-5 bg-red-tint rounded-DEFAULT p-5 flex flex-col gap-3 shadow-[0_4px_16px_rgba(224,82,82,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-card-surface text-red-critical font-label-sm text-label-sm font-semibold">
                      Destination Facility
                    </span>
                    <span className="font-label-sm text-label-sm text-red-critical flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-sm">
                        {isApproved ? "local_shipping" : "warning"}
                      </span>
                      {isApproved ? "Transit In-Progress" : "Stockout Threat"}
                    </span>
                  </div>
                  <div>
                    <div className="font-headline-sm text-headline-sm text-text-primary">
                      Rampur PHC
                    </div>
                    <div className="font-body-sm text-body-sm text-text-secondary">
                      Rural Centre · Facility #UP-STP-11
                    </div>
                  </div>
                  <div className="pt-2 flex flex-col gap-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-body-sm text-body-sm text-text-secondary">
                        Current ORS Stock:
                      </span>
                      <span className="font-label-md text-label-md text-red-critical font-bold">
                        20 units
                      </span>
                    </div>
                    <div className="w-full bg-card-surface rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isApproved ? "bg-green-healthy" : "bg-red-critical animate-pulse"
                        }`}
                        style={{ width: isApproved ? "70%" : "14%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-body-sm font-body-sm text-text-muted mt-1">
                      <span>Buffer exhaustion:</span>
                      <span className="font-label-sm text-label-sm text-red-critical font-bold">
                        {isApproved ? "+17.5d secured" : "2.5 days left"}
                      </span>
                    </div>
                  </div>
                  <div className="text-text-muted font-body-sm text-body-sm pt-2 bg-card-surface/70 -mx-2 px-3 py-1.5 rounded-full flex items-center justify-between">
                    <span className="text-text-secondary">Post-transfer buffer:</span>
                    <span className="font-label-sm text-label-sm text-green-healthy font-bold">
                      140 units (+17.5 days)
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Safety Reasoning & Proof Box */}
              <div className="bg-surface-muted rounded-DEFAULT p-5 flex flex-col gap-3.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-accent text-lg">
                    psychology
                  </span>
                  <span className="font-label-md text-label-md text-text-primary uppercase tracking-wider text-xs">
                    AI Safety Validation &amp; Allocation Logic
                  </span>
                </div>
                <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                  Maholi maintains an average consumption of 4.2 units/day and will preserve{" "}
                  <strong className="text-text-primary font-semibold">240 units</strong>{" "}
                  post-dispatch—comfortably exceeding its regulatory safety floor of 180 units (57 days of local reserve). Moving 120 sachets resolves Rampur’s acute pediatric dehydration surge without exposing Maholi to supply-chain vulnerability.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="bg-card-surface p-3 rounded-DEFAULT flex flex-col">
                    <span className="text-text-muted font-label-sm text-[11px] uppercase">
                      Rampur Daily Burn
                    </span>
                    <span className="font-headline-sm text-headline-sm text-text-primary font-bold mt-0.5">
                      8 units/day
                    </span>
                    <span className="font-body-sm text-[11px] text-text-secondary mt-0.5">
                      +45% monsoon surge
                    </span>
                  </div>
                  <div className="bg-card-surface p-3 rounded-DEFAULT flex flex-col">
                    <span className="text-text-muted font-label-sm text-[11px] uppercase">
                      Coverage Added
                    </span>
                    <span className="font-headline-sm text-headline-sm text-teal-accent font-bold mt-0.5">
                      +17.5 Days
                    </span>
                    <span className="font-body-sm text-[11px] text-text-secondary mt-0.5">
                      Through Oct 12, 2025
                    </span>
                  </div>
                  <div className="bg-card-surface p-3 rounded-DEFAULT flex flex-col">
                    <span className="text-text-muted font-label-sm text-[11px] uppercase">
                      Maholi Buffer Margin
                    </span>
                    <span className="font-headline-sm text-headline-sm text-green-healthy font-bold mt-0.5">
                      +60 units
                    </span>
                    <span className="font-body-sm text-[11px] text-text-secondary mt-0.5">
                      Above mandatory 180u
                    </span>
                  </div>
                  <div className="bg-card-surface p-3 rounded-DEFAULT flex flex-col">
                    <span className="text-text-muted font-label-sm text-[11px] uppercase">
                      Transit Integrity
                    </span>
                    <span className="font-headline-sm text-headline-sm text-text-primary font-bold mt-0.5">
                      Compliant
                    </span>
                    <span className="font-body-sm text-[11px] text-text-secondary mt-0.5">
                      Non-coldchain dry goods
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Row & Consent Guard */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-space-xs flex-wrap">
                  {isApproved ? (
                    <button
                      className="px-space-md py-2.5 rounded-full bg-green-healthy text-white font-label-md text-label-md flex items-center gap-2 shadow-[0_4px_14px_rgba(47,168,107,0.25)]"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Transfer Coordination Active
                    </button>
                  ) : (
                    <button
                      onClick={handleApprove}
                      className="px-space-md py-2.5 rounded-full bg-text-primary text-on-primary font-label-md text-label-md hover:bg-action-hover transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(17,19,24,0.12)] active:scale-98 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Approve for Coordination
                    </button>
                  )}
                  <button
                    onClick={() => setShowRouteModal(true)}
                    className="px-space-md py-2.5 rounded-full bg-card-surface text-text-secondary hover:text-text-primary font-label-md text-label-md hover:bg-surface-muted transition-colors flex items-center gap-1.5 shadow-[0_2px_8px_rgba(17,19,24,0.04)] cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">map</span>
                    Inspect Route &amp; PHCs
                  </button>
                </div>
                <div className="flex items-center gap-2 text-text-muted font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-base text-teal-accent">
                    verified_user
                  </span>
                  <span>Ledger logging only; no central purchase requisition triggered.</span>
                </div>
              </div>
            </div>

            {/* Secondary Opportunities Section */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  Secondary Opportunities &amp; Unmatched Needs
                </h3>
                <span className="font-label-sm text-label-sm text-text-muted">
                  2 District Items Monitored
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Card 1: Attention Proposal */}
                <div className="bg-card-surface rounded-DEFAULT p-5 shadow-[0_18px_45px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-4 hover:shadow-[0_20px_50px_rgba(17,19,24,0.08)] transition-shadow">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-accent"></span>
                        Attention
                      </span>
                      <span className="text-text-muted font-body-sm text-body-sm">
                        18 km route
                      </span>
                    </div>
                    <div className="font-headline-sm text-body-lg text-text-primary font-bold">
                      Consider moving 30 IV Fluids (Normal Saline 500ml) from Khairabad to Biswan PHC
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                      Khairabad holds a 28-day operating buffer. Biswan PHC will touch its reorder threshold in 4 days at current maternal care admission volume.
                    </p>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-text-muted font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-sm text-amber-accent">
                        schedule
                      </span>
                      Resolution target: 48h
                    </div>
                    <button
                      onClick={() => alert("Normal Saline transfer proposal added to queue.")}
                      className="inline-flex items-center gap-1 font-label-sm text-label-sm text-text-primary hover:text-teal-accent font-bold transition-colors cursor-pointer"
                    >
                      Review proposal
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: Unmatched / Central Purchase Requisition Recommended */}
                <div className="bg-card-surface rounded-DEFAULT p-5 shadow-[0_18px_45px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-4 hover:shadow-[0_20px_50px_rgba(17,19,24,0.08)] transition-shadow">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-tint text-blue-info font-label-sm text-label-sm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">info</span>
                        Central Reorder Required
                      </span>
                      <span className="text-text-muted font-body-sm text-body-sm">
                        Insulin Cold-Chain
                      </span>
                    </div>
                    <div className="font-headline-sm text-body-lg text-text-primary font-bold">
                      No safe peer transfer found for Regular Insulin at Biswan PHC
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                      All 6 adjacent facilities (Maholi, Rampur, Hargaon, Laharpur) are at or below mandatory minimum insulin safety cushions. Dispatching would create peer vulnerabilities.
                    </p>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-surface-muted font-label-sm text-label-sm text-text-secondary">
                      PO #IN-904 recommended
                    </span>
                    <Link
                      to="/phc/PHC002"
                      className="inline-flex items-center gap-1 font-label-sm text-label-sm text-teal-accent hover:text-text-primary font-bold transition-colors"
                    >
                      View facility
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Network Impact & Dispatch Coordination (4 Cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-lg">
            {/* Network Impact Card */}
            <div className="bg-card-surface rounded-lg p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-headline-sm text-text-primary">
                    Network Impact
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm font-semibold">
                    Simulated
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-text-secondary">
                  Projected outcome if Recommendation 01 is authorized today
                </span>
              </div>
              {/* Metric KPI stack */}
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-DEFAULT bg-workspace-surface flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-tint text-green-healthy flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">check</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-text-primary">
                        1 Critical Risk Resolved
                      </div>
                      <div className="font-body-sm text-body-sm text-text-secondary">
                        Rampur PHC stockout prevented
                      </div>
                    </div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-green-healthy font-bold">
                    100%
                  </span>
                </div>
                <div className="p-3.5 rounded-DEFAULT bg-workspace-surface flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">
                        shield_with_heart
                      </span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-text-primary">
                        Zero Cascade Risk
                      </div>
                      <div className="font-body-sm text-body-sm text-text-secondary">
                        0 source PHCs fall below floor
                      </div>
                    </div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-teal-accent font-bold">
                    0 PHC
                  </span>
                </div>
                <div className="p-3.5 rounded-DEFAULT bg-workspace-surface flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-tint text-purple-accent flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">trending_up</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-text-primary">
                        ORS Resiliency Extended
                      </div>
                      <div className="font-body-sm text-body-sm text-text-secondary">
                        Restores district cluster safety
                      </div>
                    </div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-text-primary font-bold">
                    +17.5d
                  </span>
                </div>
              </div>
              {/* Comparative Progress Visualizers */}
              <div className="flex flex-col gap-4 pt-2">
                <div className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider text-xs">
                  Facility Days-of-Supply Delta
                </div>
                {/* Rampur Delta */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center font-body-sm text-body-sm">
                    <span className="font-bold text-text-primary">Rampur PHC</span>
                    <span className="text-text-secondary">
                      2.5d <span className="text-green-healthy font-bold">→ 19.5d</span>
                    </span>
                  </div>
                  <div className="h-3 w-full bg-surface-muted rounded-full overflow-hidden flex">
                    <div className="bg-red-critical h-full" style={{ width: "13%" }}></div>
                    <div className="bg-green-healthy h-full opacity-80" style={{ width: "67%" }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-text-muted">
                    <span>Current: 20 units</span>
                    <span className="text-green-healthy font-semibold">
                      Restored: 140 units
                    </span>
                  </div>
                </div>
                {/* Maholi Delta */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center font-body-sm text-body-sm">
                    <span className="font-bold text-text-primary">Maholi PHC</span>
                    <span className="text-text-secondary">
                      85d <span className="text-text-primary font-bold">→ 57d</span>
                    </span>
                  </div>
                  <div className="h-3 w-full bg-surface-muted rounded-full overflow-hidden flex">
                    <div className="bg-green-healthy h-full" style={{ width: "67%" }}></div>
                    <div className="bg-surface-variant h-full" style={{ width: "33%" }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-text-muted">
                    <span>Post-move: 240 units</span>
                    <span className="text-teal-accent font-semibold">
                      Min safety floor: 180 units
                    </span>
                  </div>
                </div>
              </div>
              {/* Dual Consent Protocol Badge */}
              <div className="mt-2 p-3 bg-workspace-surface rounded-DEFAULT flex items-start gap-2.5">
                <span className="material-symbols-outlined text-teal-accent text-base mt-0.5">
                  phonelink_lock
                </span>
                <p className="font-body-sm text-body-sm text-text-secondary leading-snug">
                  <strong className="text-text-primary font-semibold">
                    Dual-Consent Guard:
                  </strong>{" "}
                  Dispatch vehicle receives barcode confirmation only after both storekeepers scan and acknowledge the physical pallet handoff.
                </p>
              </div>
            </div>

            {/* District Transfer Coordination Card */}
            <div className="bg-card-surface rounded-lg p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  Logistics Coordination
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm font-semibold">
                  Standby
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-workspace-surface rounded-DEFAULT">
                <div className="w-11 h-11 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center font-bold">
                  KW
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-label-md text-label-md text-text-primary truncate font-bold">
                    Kristin Watson
                  </div>
                  <div className="font-body-sm text-body-sm text-text-secondary truncate">
                    District Logistics Lead · Sitapur HQ
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => alert("Initiating secure satellite call to Kristin Watson...")}
                    aria-label="Call Logistics Officer"
                    className="w-8 h-8 rounded-full bg-card-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-sm cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </button>
                  <button
                    onClick={() => alert("Opening secure dispatch messaging...")}
                    aria-label="Message Logistics Officer"
                    className="w-8 h-8 rounded-full bg-card-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-sm cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 font-body-sm text-body-sm text-text-secondary pt-1">
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <span className="material-symbols-outlined text-base text-text-secondary">
                      traffic
                    </span>
                    Route State
                  </span>
                  <span className="font-label-sm text-label-sm text-text-primary font-bold">
                    SH-26 Clear (No bottlenecks)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <span className="material-symbols-outlined text-base text-text-secondary">
                      local_shipping
                    </span>
                    Assigned Courier
                  </span>
                  <span className="font-label-sm text-label-sm text-text-primary font-bold">
                    Mobile Logistics Unit #02
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <span className="material-symbols-outlined text-base text-text-secondary">
                      alarm
                    </span>
                    Dispatch Target
                  </span>
                  <span className="font-label-sm text-label-sm text-teal-accent font-bold">
                    11:00 – 13:30 IST Window
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert("Driver & Route Telemetry assigned. Tracking ping: MLU-02 active.")}
                className="w-full py-2.5 rounded-full bg-workspace-surface text-text-primary font-label-md text-label-md hover:bg-surface-muted transition-colors flex items-center justify-center gap-2 mt-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">local_shipping</span>
                Assign Driver &amp; Route Telemetry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card-surface rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-green-tint text-green-healthy flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
                Transfer Coordination Authorized
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mt-1">
                Recommendation #01 (120 ORS Sachets: Maholi → Rampur) has been added to the Sitapur District Logistics ledger.
              </p>
            </div>
            <div className="p-3 bg-workspace-surface rounded-xl text-xs text-text-secondary flex flex-col gap-1">
              <div><strong>Dispatch Manifest:</strong> #MNF-2025-0924-01</div>
              <div><strong>Courier:</strong> Mobile Logistics Unit #02</div>
              <div><strong>Dual Barcode Pin:</strong> Valid until 18:00 IST</div>
            </div>
            <button
              onClick={() => setShowConsentModal(false)}
              className="w-full py-2.5 rounded-full bg-text-primary text-on-primary font-label-md text-label-md hover:bg-action-hover transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
                Route Inspection: Maholi ➔ Rampur
              </h3>
              <button
                onClick={() => setShowRouteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-muted flex items-center justify-center text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-4 bg-workspace-surface rounded-xl flex flex-col gap-3 font-body-sm text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Distance:</span>
                <span className="font-bold text-text-primary">14.2 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Primary Arterial:</span>
                <span className="font-bold text-text-primary">State Highway 26 (SH-26)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Estimated Transit Duration:</span>
                <span className="font-bold text-teal-accent">24 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Bridge &amp; Culvert Clearances:</span>
                <span className="font-bold text-green-healthy">No Monsoonal Inundation</span>
              </div>
            </div>
            <button
              onClick={() => setShowRouteModal(false)}
              className="w-full py-2.5 rounded-full bg-text-primary text-on-primary font-label-md text-label-md hover:bg-action-hover transition-colors"
            >
              Close Route Inspection
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
