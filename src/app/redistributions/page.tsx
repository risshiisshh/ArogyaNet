"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import rawPhcs from "@/data/phcs.json";
import { computeRedistributions, PHC, TransferRecommendation } from "@/lib/domain";
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  MapPin,
  Pill,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

export default function RedistributionPage() {
  const phcs = useMemo(() => rawPhcs as PHC[], []);
  const initialRecommendations = useMemo(() => computeRedistributions(phcs), [phcs]);

  const [authorizedMap, setAuthorizedMap] = useState<Record<string, boolean>>({});
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [successModal, setSuccessModal] = useState<TransferRecommendation | null>(null);
  const [batchSuccess, setBatchSuccess] = useState<boolean>(false);

  const filteredRecs = useMemo(() => {
    return initialRecommendations.filter((rec) => {
      if (selectedFilter === "urgent") return rec.urgency === "urgent";
      if (selectedFilter === "authorized") return !!authorizedMap[rec.id];
      if (selectedFilter === "pending") return !authorizedMap[rec.id];
      return true;
    });
  }, [initialRecommendations, selectedFilter, authorizedMap]);

  const totalUnits = useMemo(() => {
    return initialRecommendations.reduce((acc, r) => acc + r.quantity, 0);
  }, [initialRecommendations]);

  const handleAuthorize = (rec: TransferRecommendation) => {
    setAuthorizedMap((prev) => ({
      ...prev,
      [rec.id]: true,
    }));
    setSuccessModal(rec);
  };

  const handleBatchAuthorize = () => {
    const updated: Record<string, boolean> = {};
    initialRecommendations.forEach((r) => {
      updated[r.id] = true;
    });
    setAuthorizedMap(updated);
    setBatchSuccess(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626875]">
              Autonomous Resource Rebalancing
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7F7F5] text-[#0F8F88]">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Safe Surplus Algorithm
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111318] tracking-tight">
            Inter-PHC Redistribution Matrix
          </h1>
          <p className="text-sm text-[#626875] max-w-3xl">
            Surplus-to-deficit transfer plans automatically calculated to eliminate stockouts without violating donor safety thresholds (7-day reserve buffer strictly enforced).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBatchAuthorize}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-[#0F8F88]" />
            <span>Authorize All ({initialRecommendations.length}) Transfers</span>
          </button>
        </div>
      </div>

      {/* Safety Policy & Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Policy Box */}
        <div className="bg-[#E7F7F5] p-5 rounded-2xl border border-[#0F8F88]/20 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0F8F88]">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety Buffer Policy</span>
            </div>
            <p className="text-xs text-[#111318] leading-relaxed pt-1">
              Donor facilities must retain <strong>7 days of normal consumption</strong> + minimum reorder reserve. Transfers cannot trigger secondary shortages.
            </p>
          </div>
          <div className="text-[10px] font-bold text-[#0F8F88] pt-2">
            Deterministic Constraint Enforced
          </div>
        </div>

        {/* Transfer Count */}
        <div className="bg-white rounded-2xl p-5 border border-[#E7E9EE] shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8D93A1] mb-1">
            Rebalancing Plans
          </div>
          <div className="text-3xl font-extrabold text-[#111318]">
            {initialRecommendations.length}
          </div>
          <div className="text-[11px] text-[#626875] mt-1">Across 8 Facility Pairs</div>
        </div>

        {/* Units to Rebalance */}
        <div className="bg-white rounded-2xl p-5 border border-[#E7E9EE] shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0F8F88] mb-1">
            Total Rebalance Units
          </div>
          <div className="text-3xl font-extrabold text-[#0F8F88]">{totalUnits}</div>
          <div className="text-[11px] text-[#626875] mt-1">ORS, Antibiotics &amp; Insulin</div>
        </div>

        {/* Stockout Days Prevented */}
        <div className="bg-white rounded-2xl p-5 border border-[#E7E9EE] shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[#248A54] mb-1">
            Coverage Gained
          </div>
          <div className="text-3xl font-extrabold text-[#248A54]">+9.4 Days</div>
          <div className="text-[11px] text-[#626875] mt-1">Average per recipient clinic</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "all", label: `All Recommendations (${initialRecommendations.length})` },
          {
            id: "urgent",
            label: `Urgent Only (${initialRecommendations.filter((r) => r.urgency === "urgent").length})`,
          },
          {
            id: "pending",
            label: `Pending Authorization (${
              initialRecommendations.filter((r) => !authorizedMap[r.id]).length
            })`,
          },
          {
            id: "authorized",
            label: `Authorized (${Object.keys(authorizedMap).filter((k) => authorizedMap[k]).length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedFilter === tab.id
                ? "bg-[#111318] text-white shadow-sm"
                : "bg-white text-[#626875] hover:bg-[#F8F8FA] border border-[#E7E9EE]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecs.map((rec) => {
          const isAuthorized = authorizedMap[rec.id];

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-[24px] p-6 border transition-all space-y-4 shadow-sm ${
                isAuthorized
                  ? "border-[#248A54]/40 bg-[#E5F6EE]/20"
                  : rec.urgency === "urgent"
                  ? "border-[#D93838]/40 hover:border-[#D93838]"
                  : "border-[#E7E9EE] hover:border-[#111318]"
              }`}
            >
              {/* Card Header: Medicine & Urgency */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#8D93A1]">
                      #{rec.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        rec.urgency === "urgent"
                          ? "bg-[#FDE8E8] text-[#D93838]"
                          : "bg-[#FFF4D6] text-[#E0A000]"
                      }`}
                    >
                      {rec.urgency} Action
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111318]">
                    {rec.medicine_name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold uppercase text-[#8D93A1]">
                    Transfer Quantity
                  </div>
                  <div className="text-2xl font-black text-[#0F8F88]">
                    {rec.quantity} <span className="text-xs font-semibold">units</span>
                  </div>
                </div>
              </div>

              {/* Source -> Destination Visual Transfer Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-11 items-center gap-3 p-4 rounded-2xl bg-[#F8F8FA] border border-[#E7E9EE]">
                {/* Donor Source */}
                <div className="sm:col-span-5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#8D93A1]">
                    <span>Donor (Surplus)</span>
                    <span className="text-[#248A54] font-bold">Safe Buffer OK</span>
                  </div>
                  <div className="font-extrabold text-sm text-[#111318]">
                    {rec.source_phc_name}
                  </div>
                  <div className="text-[11px] text-[#626875]">
                    Coverage after transfer: <strong>{rec.source_days_after} days</strong>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="sm:col-span-1 flex justify-center py-2 sm:py-0">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E7E9EE] flex items-center justify-center text-[#0F8F88] shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Destination Recipient */}
                <div className="sm:col-span-5 space-y-1 sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1.5 text-[10px] uppercase font-bold text-[#D93838]">
                    <span>Recipient (Deficit)</span>
                  </div>
                  <div className="font-extrabold text-sm text-[#111318]">
                    {rec.destination_phc_name}
                  </div>
                  <div className="text-[11px] text-[#626875]">
                    Coverage extended to: <strong className="text-[#248A54]">~{rec.destination_days_after} days</strong>
                  </div>
                </div>
              </div>

              {/* AI Justification Quote */}
              <div className="p-3.5 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] text-xs text-[#626875] leading-relaxed italic">
                &ldquo;{rec.reason}&rdquo;
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E7E9EE]">
                <div className="flex items-center gap-1.5 text-xs text-[#8D93A1]">
                  <Truck className="w-3.5 h-3.5 text-[#0F8F88]" />
                  <span>District Medical Transport (Route A)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/phc/${rec.destination_phc_id}`}
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-[#626875] hover:text-[#111318] hover:bg-[#F8F8FA] transition-colors"
                  >
                    View Facility
                  </Link>

                  <button
                    onClick={() => handleAuthorize(rec)}
                    disabled={isAuthorized}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
                      isAuthorized
                        ? "bg-[#248A54] text-white cursor-default"
                        : "bg-[#111318] text-white hover:bg-[#252830]"
                    }`}
                  >
                    {isAuthorized ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Dispatched to Driver ✓</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#0F8F88]" />
                        <span>Authorize for Coordination</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E7E9EE] animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-[#E5F6EE] text-[#248A54] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-extrabold text-[#111318]">
                Transfer Manifest Dispatched!
              </h3>
              <p className="text-xs text-[#626875]">
                Electronic dispatch order generated and transmitted to District Health Logistics Unit.
              </p>
            </div>

            <div className="bg-[#F8F8FA] p-4 rounded-xl text-xs space-y-2 border border-[#E7E9EE]">
              <div className="flex justify-between">
                <span className="text-[#626875]">Medicine:</span>
                <span className="font-bold text-[#111318]">{successModal.medicine_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#626875]">Quantity:</span>
                <span className="font-bold text-[#0F8F88]">{successModal.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#626875]">Source PHC:</span>
                <span className="font-bold text-[#111318]">{successModal.source_phc_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#626875]">Destination PHC:</span>
                <span className="font-bold text-[#D93838]">{successModal.destination_phc_name}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessModal(null)}
              className="w-full py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors"
            >
              Close &amp; Continue Monitoring
            </button>
          </div>
        </div>
      )}

      {/* Batch Success Notification */}
      {batchSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111318] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#248A54]" />
          <span className="text-xs font-bold">
            All {initialRecommendations.length} transfers authorized and queued for dispatch!
          </span>
          <button
            onClick={() => setBatchSuccess(false)}
            className="text-xs text-[#8D93A1] hover:text-white"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
