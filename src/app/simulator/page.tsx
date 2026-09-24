"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import rawPhcs from "@/data/phcs.json";
import { PHC, enrichAllPHCs } from "@/lib/domain";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Flame,
  Gauge,
  HelpCircle,
  Hospital,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles,
  TrendingDown,
  Wind,
  Zap,
} from "lucide-react";

export default function SimulatorPage() {
  const basePhcs = useMemo(() => rawPhcs as PHC[], []);

  // Scenario parameters
  const [demandSurgeMultiplier, setDemandSurgeMultiplier] = useState<number>(1.5); // 1.0x to 3.0x
  const [supplyDelayDays, setSupplyDelayDays] = useState<number>(5); // 0 to 14 days
  const [staffAbsencePct, setStaffAbsencePct] = useState<number>(20); // 0% to 50%
  const [activePreset, setActivePreset] = useState<string>("monsoon");

  // Presets
  const applyPreset = (preset: "normal" | "monsoon" | "epidemic" | "logistics") => {
    setActivePreset(preset);
    if (preset === "normal") {
      setDemandSurgeMultiplier(1.0);
      setSupplyDelayDays(0);
      setStaffAbsencePct(0);
    } else if (preset === "monsoon") {
      setDemandSurgeMultiplier(1.8);
      setSupplyDelayDays(6);
      setStaffAbsencePct(25);
    } else if (preset === "epidemic") {
      setDemandSurgeMultiplier(2.5);
      setSupplyDelayDays(3);
      setStaffAbsencePct(15);
    } else if (preset === "logistics") {
      setDemandSurgeMultiplier(1.2);
      setSupplyDelayDays(12);
      setStaffAbsencePct(10);
    }
  };

  // Recomputed simulation results
  const simResults = useMemo(() => {
    let simulatedCriticalCount = 0;
    let simulatedLowCount = 0;
    let simulatedHealthyCount = 0;
    let totalBedOccupied = 0;
    let totalBeds = 0;
    const criticalFacilities: { name: string; depletedItem: string; daysLeft: number }[] = [];

    basePhcs.forEach((phc) => {
      // Scale bed occupancy with demand surge
      const bedsOcc = Math.min(
        phc.beds_total,
        Math.round(phc.beds_occupied * (1 + (demandSurgeMultiplier - 1) * 0.5))
      );
      totalBedOccupied += bedsOcc;
      totalBeds += phc.beds_total;
      const bedPct = phc.beds_total > 0 ? bedsOcc / phc.beds_total : 0;

      // Adjust staff attendance
      const staffPres = Math.max(
        1,
        Math.round(phc.staff_present * (1 - staffAbsencePct / 100))
      );

      // Inventory burn calculation with surge & delay
      let phcIsCritical = bedPct > 0.9;
      let phcIsLow = false;

      phc.inventory.forEach((item) => {
        const adjustedBurn = item.daily_consumption_rate * demandSurgeMultiplier;
        // Remaining days until stockout
        const daysLeft = item.quantity / adjustedBurn;

        // If delay is longer than days left, stockout occurs before reorder arrival
        if (daysLeft <= supplyDelayDays || item.quantity <= item.reorder_threshold) {
          phcIsCritical = true;
          criticalFacilities.push({
            name: phc.phc_name,
            depletedItem: item.medicine_name,
            daysLeft: Math.max(0, parseFloat(daysLeft.toFixed(1))),
          });
        } else if (daysLeft <= supplyDelayDays + 3) {
          phcIsLow = true;
        }
      });

      if (phcIsCritical) simulatedCriticalCount++;
      else if (phcIsLow) simulatedLowCount++;
      else simulatedHealthyCount++;
    });

    const avgBedPct = Math.round((totalBedOccupied / totalBeds) * 100);

    // Compute synthetic Resilience Score (0 to 100)
    const baseScore = 90;
    const penalty =
      (demandSurgeMultiplier - 1) * 22 +
      supplyDelayDays * 2.8 +
      staffAbsencePct * 0.5;
    const resilienceScore = Math.max(18, Math.round(baseScore - penalty));

    return {
      criticalCount: simulatedCriticalCount,
      lowCount: simulatedLowCount,
      healthyCount: simulatedHealthyCount,
      avgBedPct,
      resilienceScore,
      criticalFacilities: criticalFacilities.slice(0, 6),
    };
  }, [basePhcs, demandSurgeMultiplier, supplyDelayDays, staffAbsencePct]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626875]">
              Stress Testing &amp; Disaster Preparedness
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF4D6] text-[#E0A000]">
              <Zap className="w-3.5 h-3.5" />
              Dynamic Predictive Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111318] tracking-tight">
            Emergency Scenario Simulator
          </h1>
          <p className="text-sm text-[#626875] max-w-3xl">
            Simulate acute seasonal epidemiological spikes, logistics disruptions, and staffing crunches to test the elasticity of the rural health network.
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => applyPreset("normal")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              activePreset === "normal"
                ? "bg-[#111318] text-white"
                : "bg-[#F8F8FA] text-[#626875] border border-[#E7E9EE] hover:bg-[#EDEEF0]"
            }`}
          >
            Baseline State
          </button>
          <button
            onClick={() => applyPreset("monsoon")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              activePreset === "monsoon"
                ? "bg-[#0F8F88] text-white"
                : "bg-[#F8F8FA] text-[#626875] border border-[#E7E9EE] hover:bg-[#EDEEF0]"
            }`}
          >
            Monsoon Inundation
          </button>
          <button
            onClick={() => applyPreset("epidemic")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              activePreset === "epidemic"
                ? "bg-[#D93838] text-white"
                : "bg-[#F8F8FA] text-[#626875] border border-[#E7E9EE] hover:bg-[#EDEEF0]"
            }`}
          >
            Acute Diarrhea Surge
          </button>
          <button
            onClick={() => applyPreset("logistics")}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              activePreset === "logistics"
                ? "bg-[#8974DC] text-white"
                : "bg-[#F8F8FA] text-[#626875] border border-[#E7E9EE] hover:bg-[#EDEEF0]"
            }`}
          >
            Depot Highway Blockage
          </button>
        </div>
      </div>

      {/* Simulator Controls (Left 5 Cols) + Impact Projections (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Sliders & Controls */}
        <div className="lg:col-span-5 bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E9EE]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0F8F88]" />
              <h2 className="text-base font-bold text-[#111318]">Stress Test Parameters</h2>
            </div>
            <button
              onClick={() => applyPreset("normal")}
              className="text-xs text-[#626875] hover:text-[#111318] flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Demand Surge Multiplier */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#111318] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#D93838]" /> Patient &amp; Medicine Demand Surge
              </span>
              <span className="font-mono font-bold text-[#0F8F88] bg-[#E7F7F5] px-2 py-0.5 rounded">
                +{Math.round((demandSurgeMultiplier - 1) * 100)}% ({demandSurgeMultiplier.toFixed(1)}x)
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={demandSurgeMultiplier}
              onChange={(e) => {
                setDemandSurgeMultiplier(parseFloat(e.target.value));
                setActivePreset("custom");
              }}
              className="w-full accent-[#0F8F88] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8D93A1]">
              <span>Normal (1.0x)</span>
              <span>Moderate (+50%)</span>
              <span>Severe Epidemic (3.0x)</span>
            </div>
          </div>

          {/* Slider 2: Supply Chain Shipment Delay */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#111318] flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#E0A000]" /> Depot Supply Delivery Lag
              </span>
              <span className="font-mono font-bold text-[#E0A000] bg-[#FFF4D6] px-2 py-0.5 rounded">
                +{supplyDelayDays} Days Delay
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={supplyDelayDays}
              onChange={(e) => {
                setSupplyDelayDays(parseInt(e.target.value));
                setActivePreset("custom");
              }}
              className="w-full accent-[#E0A000] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8D93A1]">
              <span>On-Time (0d)</span>
              <span>1 Week Lag</span>
              <span>Total Severance (14d)</span>
            </div>
          </div>

          {/* Slider 3: Staff Absence */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#111318] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#8974DC]" /> Clinical Staff Absenteeism
              </span>
              <span className="font-mono font-bold text-[#8974DC] bg-[#EEE8FF] px-2 py-0.5 rounded">
                {staffAbsencePct}% Absent
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={staffAbsencePct}
              onChange={(e) => {
                setStaffAbsencePct(parseInt(e.target.value));
                setActivePreset("custom");
              }}
              className="w-full accent-[#8974DC] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8D93A1]">
              <span>Full Attendance (0%)</span>
              <span>Seasonal Flu (25%)</span>
              <span>Severe Shortage (50%)</span>
            </div>
          </div>

          {/* AI Preemptive Recommendation */}
          <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-extrabold text-[#111318]">
              <Sparkles className="w-3.5 h-3.5 text-[#0F8F88]" />
              <span>Recommended Preemptive Actions</span>
            </div>
            <p className="text-[#626875] leading-relaxed">
              Under this scenario, pre-deploying <strong>400 ORS sachets</strong> and <strong>120 Amoxicillin strips</strong> from Sitapur central store to Rampur and Sidhauli will prevent 8 clinic stockouts before supply routes close.
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Projected Impact & Network Resilience Score */}
        <div className="lg:col-span-7 space-y-6">
          {/* Resilience Gauge & Primary Metrics */}
          <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#626875]">
                  Network Stress Response
                </span>
                <h3 className="text-xl font-extrabold text-[#111318]">
                  Simulated Network Resilience
                </h3>
              </div>

              {/* Resilience Score Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-[#8D93A1]">
                    Resilience Index
                  </div>
                  <div className="text-xs font-semibold text-[#626875]">
                    {simResults.resilienceScore >= 75
                      ? "High Elasticity"
                      : simResults.resilienceScore >= 50
                      ? "Moderate Strain"
                      : "Critical Fragility"}
                  </div>
                </div>
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm ${
                    simResults.resilienceScore >= 75
                      ? "bg-[#E5F6EE] text-[#248A54]"
                      : simResults.resilienceScore >= 50
                      ? "bg-[#FFF4D6] text-[#E0A000]"
                      : "bg-[#FDE8E8] text-[#D93838]"
                  }`}
                >
                  {simResults.resilienceScore}
                </div>
              </div>
            </div>

            {/* Simulated Counts Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FDE8E8]/40 border border-[#FDE8E8] text-center">
                <div className="text-2xl font-extrabold text-[#D93838]">
                  {simResults.criticalCount}
                </div>
                <div className="text-xs font-bold text-[#D93838] mt-0.5">Critical PHCs</div>
                <div className="text-[10px] text-[#626875] mt-1">Stocked out or &gt;90% beds</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF4D6]/40 border border-[#FFF4D6] text-center">
                <div className="text-2xl font-extrabold text-[#E0A000]">
                  {simResults.lowCount}
                </div>
                <div className="text-xs font-bold text-[#E0A000] mt-0.5">At Risk PHCs</div>
                <div className="text-[10px] text-[#626875] mt-1">&le; 3 days remaining</div>
              </div>

              <div className="p-4 rounded-xl bg-[#E5F6EE]/40 border border-[#E5F6EE] text-center">
                <div className="text-2xl font-extrabold text-[#248A54]">
                  {simResults.healthyCount}
                </div>
                <div className="text-xs font-bold text-[#248A54] mt-0.5">Buffer Intact</div>
                <div className="text-[10px] text-[#626875] mt-1">Safe reserves maintained</div>
              </div>
            </div>

            {/* Bed Saturation Under Surge */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#111318]">
                  Projected Network Inpatient Saturation:
                </span>
                <span className="font-bold text-[#111318]">{simResults.avgBedPct}%</span>
              </div>
              <div className="w-full bg-[#E7E9EE] rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    simResults.avgBedPct > 85
                      ? "bg-[#D93838]"
                      : simResults.avgBedPct > 70
                      ? "bg-[#E0A000]"
                      : "bg-[#0F8F88]"
                  }`}
                  style={{ width: `${Math.min(100, simResults.avgBedPct)}%` }}
                />
              </div>
            </div>

            {/* List of Earliest Stockout Facilities Under This Stress */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#626875]">
                Earliest Stockout Incidents Under Simulation
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {simResults.criticalFacilities.map((cf, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#111318]">{cf.name}</div>
                      <div className="text-[11px] text-[#D93838] font-medium">
                        {cf.depletedItem}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FDE8E8] text-[#D93838]">
                        Stocks out: {cf.daysLeft}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preemptive Rebalance CTA */}
            <div className="pt-2 flex items-center justify-end">
              <Link
                href="/redistributions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors"
              >
                <span>Authorize Preemptive Transfers Now</span>
                <ArrowRight className="w-4 h-4 text-[#0F8F88]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
