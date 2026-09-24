"use client";

import { useState } from "react";
import Link from "next/link";
import phcsData from "@/data/phcs.json";
import { PHC, classifyPHCStatus, getDaysUntilStockout } from "@/lib/domain";

export default function PHCNetworkPage() {
  const [district, setDistrict] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const phcs: PHC[] = phcsData as PHC[];

  const filteredPHCs = phcs.filter((phc) => {
    if (district !== "all" && phc.district.toLowerCase() !== district.toLowerCase()) {
      return false;
    }
    const computedStatus = classifyPHCStatus(phc);
    if (statusFilter !== "all") {
      if (statusFilter === "critical" && computedStatus !== "critical") return false;
      if (statusFilter === "attention" && computedStatus !== "low") return false;
      if (statusFilter === "stable" && computedStatus !== "healthy") return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        phc.phc_name.toLowerCase().includes(q) ||
        phc.block.toLowerCase().includes(q) ||
        phc.phc_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = phcs.filter((p) => classifyPHCStatus(p) === "critical").length;
  const attentionCount = phcs.filter((p) => classifyPHCStatus(p) === "low").length;
  const stableCount = phcs.filter((p) => classifyPHCStatus(p) === "healthy").length;

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col w-full gap-space-lg">
        {/* Header Cluster */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-healthy animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-text-muted tracking-wider uppercase">
                18 Sovereign PHC Nodes Active
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              Primary Health Centre (PHC) Network
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Real-time telemetry, capacity indicators, and inventory ledgers across Sitapur and Hardoi health administrative districts.
            </p>
          </div>
          <div className="flex items-center gap-space-xs shrink-0">
            <Link
              href="/redistributions"
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-text-primary text-on-primary font-label-md text-label-md hover:bg-action-hover transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
              Active Transfers (1)
            </Link>
          </div>
        </div>

        {/* Filter & Metric Strip */}
        <div className="w-full bg-card-surface rounded-lg p-space-md shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PHC name, block, or ID..."
              className="w-full h-10 pl-9 pr-4 rounded-full bg-workspace-surface font-body-sm text-body-sm text-text-primary placeholder:text-text-muted border border-border-hairline focus:outline-none focus:ring-1 focus:ring-teal-accent"
            />
          </div>

          {/* District & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="h-10 px-3.5 rounded-full bg-workspace-surface font-label-sm text-label-sm text-text-primary border border-border-hairline focus:outline-none cursor-pointer"
            >
              <option value="all">All Districts</option>
              <option value="sitapur">Sitapur District</option>
              <option value="hardoi">Hardoi District</option>
            </select>

            <div className="inline-flex bg-surface-muted p-1 rounded-full items-center">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-card-surface text-text-primary font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                All ({phcs.length})
              </button>
              <button
                onClick={() => setStatusFilter("critical")}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                  statusFilter === "critical"
                    ? "bg-red-tint text-red-critical font-bold shadow-xs"
                    : "text-text-secondary hover:text-red-critical"
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                onClick={() => setStatusFilter("attention")}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                  statusFilter === "attention"
                    ? "bg-amber-tint text-amber-900 font-bold shadow-xs"
                    : "text-text-secondary hover:text-amber-900"
                }`}
              >
                Attention ({attentionCount})
              </button>
              <button
                onClick={() => setStatusFilter("stable")}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                  statusFilter === "stable"
                    ? "bg-green-tint text-green-healthy font-bold shadow-xs"
                    : "text-text-secondary hover:text-green-healthy"
                }`}
              >
                Stabilized ({stableCount})
              </button>
            </div>
          </div>
        </div>

        {/* PHCs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md items-stretch">
          {filteredPHCs.map((phc) => {
            const computedStatus = classifyPHCStatus(phc);
            const isCritical = computedStatus === "critical";
            const isAttention = computedStatus === "low";

            const bedOccupancyPercent =
              phc.beds_total > 0
                ? Math.round((phc.beds_occupied / phc.beds_total) * 100)
                : 0;

            return (
              <div
                key={phc.phc_id}
                className="bg-card-surface rounded-lg p-space-md shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col justify-between gap-4 border border-border-hairline hover:shadow-[0_20px_50px_rgba(17,19,24,0.1)] transition-all"
              >
                <div className="flex flex-col gap-3">
                  {/* Top line with status badge and ID */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold flex items-center gap-1.5 ${
                        isCritical
                          ? "bg-red-tint text-red-critical"
                          : isAttention
                          ? "bg-amber-tint text-amber-900"
                          : "bg-green-tint text-green-healthy"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCritical
                            ? "bg-red-critical animate-ping"
                            : isAttention
                            ? "bg-amber-accent"
                            : "bg-green-healthy"
                        }`}
                      ></span>
                      {isCritical ? "Critical" : isAttention ? "Attention" : "Stabilized"}
                    </span>
                    <span className="font-body-sm text-[12px] text-text-muted">
                      #{phc.phc_id} · {phc.district}
                    </span>
                  </div>

                  {/* Name and Block */}
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
                      {phc.phc_name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Block: {phc.block}
                    </p>
                  </div>

                  {/* Key Metrics Chips */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-workspace-surface rounded-DEFAULT text-body-sm">
                    <div>
                      <span className="text-[11px] text-text-muted block">Bed Occupancy</span>
                      <span
                        className={`font-label-md font-bold ${
                          bedOccupancyPercent > 85 ? "text-red-critical" : "text-text-primary"
                        }`}
                      >
                        {phc.beds_occupied} / {phc.beds_total} ({bedOccupancyPercent}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-muted block">Staff on Duty</span>
                      <span className="font-label-md text-text-primary font-bold">
                        {phc.staff_present} / {phc.staff_total} staff
                      </span>
                    </div>
                  </div>

                  {/* Critical supplies quick indicator */}
                  <div className="flex flex-col gap-1 text-[12px]">
                    <span className="text-text-muted font-label-sm">Formulary Highlights:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {phc.inventory.slice(0, 3).map((item) => {
                        const days = getDaysUntilStockout(item);
                        const isItemCritical = item.quantity <= item.reorder_threshold;
                        return (
                          <span
                            key={item.medicine_name}
                            className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                              isItemCritical
                                ? "bg-red-tint text-red-critical font-semibold"
                                : "bg-surface-muted text-text-secondary"
                            }`}
                          >
                            {item.medicine_name}: {item.quantity} (
                            {days !== null ? `${days.toFixed(0)}d` : "—"})
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-2 border-t border-border-hairline flex items-center justify-between">
                  <span className="font-body-sm text-[12px] text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-teal-accent">
                      sensors
                    </span>
                    Telemetry synced
                  </span>
                  <Link
                    href={`/phc/${phc.phc_id}`}
                    className="inline-flex items-center gap-1 font-label-sm text-label-sm text-teal-accent hover:text-text-primary font-bold transition-colors"
                  >
                    <span>View PHC</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPHCs.length === 0 && (
          <div className="w-full p-12 bg-card-surface rounded-lg text-center flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-text-muted">
              domain_disabled
            </span>
            <div className="font-headline-sm text-text-primary font-bold">
              No matching health facilities found
            </div>
            <p className="font-body-sm text-text-secondary">
              Try adjusting your search terms or clearing the status filter.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
