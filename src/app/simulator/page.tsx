"use client";

import { useState } from "react";
import Link from "next/link";

export default function SimulatorPage() {
  const [scenario, setScenario] = useState("Disease Outbreak — Sitapur District");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("severe");
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 600);
  };

  const handleReset = () => {
    setSeverity("mild");
    setHasRun(false);
  };

  // Severity-dependent projections
  const stats = {
    mild: {
      criticalCount: 2,
      attentionCount: 3,
      stabilizedCount: 13,
      resilienceScore: 72,
      burnAcceleration: "+30%",
      daysCover: "8d",
    },
    moderate: {
      criticalCount: 4,
      attentionCount: 4,
      stabilizedCount: 10,
      resilienceScore: 56,
      burnAcceleration: "+100%",
      daysCover: "5d",
    },
    severe: {
      criticalCount: 6,
      attentionCount: 4,
      stabilizedCount: 8,
      resilienceScore: 38,
      burnAcceleration: "+200%",
      daysCover: "3d",
    },
  }[severity];

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col w-full gap-space-lg">
        {/* Page Header Cluster */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
                Emergency Scenario Simulator
              </h1>
            </div>
            <p className="font-body-md text-body-md text-text-secondary">
              Model how a sudden demand surge would affect PHC resources before it reaches patients.
            </p>
          </div>
          <div className="flex items-center gap-space-xs self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-full bg-card-surface text-text-secondary font-label-sm text-label-sm shadow-sm">
              <span className="material-symbols-outlined text-base text-teal-accent">shield</span>
              Simulation Sandbox · Read-only
            </span>
          </div>
        </div>

        {/* Simulation Active Banner */}
        <div className="w-full bg-amber-tint rounded-lg p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-accent"></span>
            </span>
            <div className="flex flex-wrap items-center gap-x-space-sm gap-y-1">
              <span className="font-headline-sm text-headline-sm text-text-primary">
                Simulation active: {scenario.split(" — ")[0]} ({severity.toUpperCase()}) · Sitapur District
              </span>
              <span className="px-space-sm py-0.5 rounded-full bg-card-surface font-label-sm text-label-sm text-text-primary">
                Real-time projection model
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm text-text-secondary font-body-sm text-body-sm self-end md:self-auto shrink-0">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>Generated at 10:28 IST</span>
          </div>
        </div>

        {/* Control & Interactive Parameter Panel */}
        <div className="w-full bg-card-surface rounded-lg p-space-lg shadow-sm flex flex-col gap-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            {/* Scenario Selector */}
            <div className="flex flex-col gap-1.5 flex-1 max-w-md">
              <label className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                Scenario Archetype
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-red-critical text-xl pointer-events-none">
                  emergency
                </span>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  aria-label="Select Scenario Archetype"
                  className="w-full h-11 pl-11 pr-10 rounded-xl bg-workspace-surface font-label-md text-label-md text-text-primary appearance-none cursor-pointer focus:outline-none"
                >
                  <option>Disease Outbreak — Sitapur District</option>
                  <option>Monsoon Surge &amp; Vector Influx — Terai Belt</option>
                  <option>National Supply Chain Route Disruption</option>
                  <option>Heatwave Induced Shock — Central Plains</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-md text-text-secondary text-xl pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Intensity Control */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                Surge Severity &amp; Strain
              </label>
              <div className="inline-flex bg-surface-muted p-1 rounded-full items-center">
                <button
                  onClick={() => setSeverity("mild")}
                  className={`px-space-md py-1.5 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                    severity === "mild"
                      ? "bg-amber-accent text-text-primary font-bold shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  type="button"
                >
                  Mild (+30%)
                </button>
                <button
                  onClick={() => setSeverity("moderate")}
                  className={`px-space-md py-1.5 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                    severity === "moderate"
                      ? "bg-amber-accent text-text-primary font-bold shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  type="button"
                >
                  Moderate (+100%)
                </button>
                <button
                  onClick={() => setSeverity("severe")}
                  className={`px-space-md py-1.5 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                    severity === "severe"
                      ? "bg-amber-accent text-text-primary font-bold shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  type="button"
                >
                  Severe (+200%)
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-space-sm pt-4 lg:pt-0 self-start lg:self-end">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="h-11 px-space-lg rounded-full bg-text-primary hover:bg-action-hover text-on-primary font-label-md text-label-md flex items-center gap-space-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-lg ${
                    isSimulating ? "animate-spin" : ""
                  }`}
                >
                  {isSimulating ? "sync" : "play_arrow"}
                </span>
                <span>{isSimulating ? "Simulating..." : "Run Simulation"}</span>
              </button>
              <button
                onClick={handleReset}
                className="h-11 px-space-md rounded-full bg-surface-muted hover:bg-card-surface text-text-secondary hover:text-text-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">restart_alt</span>
                Reset to live data
              </button>
            </div>
          </div>

          {/* Parameter Badges & Helper Text Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs border-t-0">
            <div className="flex items-center gap-2 text-text-secondary font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-teal-accent text-base">info</span>
              <span>Simulates accelerated consumption for affected medicines across the district.</span>
            </div>
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="px-space-sm py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                {stats.burnAcceleration} burn acceleration
              </span>
              <span className="px-space-sm py-1 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm">
                Target cohort: 18 PHCs
              </span>
              <span className="px-space-sm py-1 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm">
                Forecast horizon: 7 days
              </span>
            </div>
          </div>
        </div>

        {/* Before / After Comparison Grid */}
        <div className="w-full flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-text-primary">
              Network Shift Assessment
            </h2>
            <span className="font-body-sm text-body-sm text-text-muted">
              Comparing live telemetry against 72-hour simulated trajectory
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-stretch">
            {/* Left Column: Current Live Baseline */}
            <div className="lg:col-span-5 bg-card-surface rounded-lg p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
              <div>
                <div className="flex items-start justify-between gap-space-xs mb-space-sm">
                  <div>
                    <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider block">
                      Baseline State
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-text-primary">
                      Current Network (Live)
                    </h3>
                  </div>
                  <span className="px-space-sm py-1 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-healthy"></span>
                    15 Stabilized
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-space-md">
                  <span className="px-space-sm py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                    1 critical
                  </span>
                  <span className="px-space-sm py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm">
                    2 need attention
                  </span>
                  <span className="px-space-sm py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm">
                    15 stabilized
                  </span>
                </div>

                {/* PHC Mini Cards */}
                <div className="flex flex-col gap-2">
                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-healthy shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Maholi PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          360 ORS surplus · 42 beds open
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm">
                      Healthy
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-healthy shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Khairabad PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          28d safe buffer on antibiotics
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm">
                      Healthy
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-healthy shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Hargaon PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          600 diagnostic strips buffered
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm">
                      Healthy
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-accent shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Biswan PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          Insulin nearing reorder point (4.5d)
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm">
                      Attention
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-accent shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Laharpur PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          Bed occupancy rising at 78%
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm">
                      Attention
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-critical shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Rampur PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          ORS stockout in 2.5d at current rate
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                      Critical
                    </span>
                  </div>
                </div>
              </div>

              {/* Resilience Mini Gauge */}
              <div className="p-space-md rounded-xl bg-workspace-surface flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-text-muted uppercase font-semibold">
                    District Resilience Index
                  </span>
                  <span className="font-headline-sm text-headline-sm text-text-primary font-bold">
                    84% Capacity
                  </span>
                  <span className="font-body-sm text-body-sm text-green-healthy font-semibold">
                    Normal operating limits
                  </span>
                </div>
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-muted"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    ></path>
                    <path
                      className="text-green-healthy"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="84, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    ></path>
                  </svg>
                  <span className="absolute font-label-md text-label-md text-text-primary font-bold">
                    84%
                  </span>
                </div>
              </div>
            </div>

            {/* Center Divider / Transformation Indicator */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-muted text-center gap-space-sm">
              <div className="w-12 h-12 rounded-full bg-card-surface flex items-center justify-center text-text-primary shadow-sm">
                <span className="material-symbols-outlined text-2xl">trending_down</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-text-primary block font-bold">
                  {scenario.split(" — ")[0]}
                </span>
                <span className="font-body-sm text-body-sm text-red-critical font-semibold">
                  {stats.burnAcceleration} Acceleration Shift
                </span>
              </div>
              <div className="w-full flex items-center justify-center gap-1 text-text-muted">
                <span className="material-symbols-outlined text-sm">east</span>
                <span className="material-symbols-outlined text-sm">east</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary max-w-[140px]">
                Without intervention, failure cascaded in 72 hours
              </p>
            </div>

            {/* Right Column: Simulated Network */}
            <div className="lg:col-span-5 bg-card-surface rounded-lg p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
              <div>
                <div className="flex items-start justify-between gap-space-xs mb-space-sm">
                  <div>
                    <span className="font-label-sm text-label-sm text-red-critical uppercase tracking-wider block font-semibold">
                      Simulated Outcome
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-text-primary">
                      {scenario.split(" — ")[0]} Model
                    </h3>
                  </div>
                  <span className="px-space-sm py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-critical animate-pulse"></span>
                    {stats.criticalCount} Critical
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-space-md">
                  <span className="px-space-sm py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                    {stats.criticalCount} critical
                  </span>
                  <span className="px-space-sm py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm">
                    {stats.attentionCount} need attention
                  </span>
                  <span className="px-space-sm py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm">
                    {stats.stabilizedCount} stabilized
                  </span>
                </div>

                {/* PHC Simulated Mini Cards */}
                <div className="flex flex-col gap-2">
                  <div className="p-space-sm rounded-xl bg-red-tint/40 flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-critical shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Rampur PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-red-critical font-medium">
                          Stockout imminent in &lt;18 hours
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                      Critical
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-red-tint/40 flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-critical shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Biswan PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-red-critical font-medium">
                          Zero insulin reserves in 1.2 days
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                      Critical
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-red-tint/40 flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-critical shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Laharpur PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-red-critical font-medium">
                          Bed capacity 100% breached (134%)
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                      Critical
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-accent shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Khairabad PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          Buffer compressed from 28d to 4 days
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm">
                      Attention
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-accent shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Hargaon PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          Antibiotic burn rate doubled
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm">
                      Attention
                    </span>
                  </div>

                  <div className="p-space-sm rounded-xl bg-workspace-surface flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-healthy shrink-0"></span>
                      <div>
                        <span className="font-label-md text-label-md text-text-primary block font-semibold">
                          Maholi PHC
                        </span>
                        <span className="font-body-sm text-body-sm text-text-secondary">
                          Remains buffered with redistributable surplus
                        </span>
                      </div>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm">
                      Healthy
                    </span>
                  </div>
                </div>
              </div>

              {/* Resilience Degraded Gauge */}
              <div className="p-space-md rounded-xl bg-red-tint/30 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-red-critical uppercase font-semibold">
                    District Resilience Index
                  </span>
                  <span className="font-headline-sm text-headline-sm text-red-critical font-bold">
                    {stats.resilienceScore}% Capacity
                  </span>
                  <span className="font-body-sm text-body-sm text-red-critical font-medium">
                    -{84 - stats.resilienceScore}% severe degradation
                  </span>
                </div>
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-muted"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    ></path>
                    <path
                      className="text-red-critical"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${stats.resilienceScore}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    ></path>
                  </svg>
                  <span className="absolute font-label-md text-label-md text-red-critical font-bold">
                    {stats.resilienceScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Response & Mitigation Strategy Card */}
        <div className="w-full bg-card-surface rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-teal-tint blur-3xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm relative z-10">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-teal-tint flex items-center justify-center text-teal-accent">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-teal-accent uppercase tracking-wider block font-semibold">
                  Automated Prescription Engine
                </span>
                <h2 className="font-headline-md text-headline-md text-text-primary">
                  ArogyaNet Predictive Response &amp; Mitigation
                </h2>
              </div>
            </div>
            <span className="px-space-md py-1 rounded-full bg-teal-tint text-teal-accent font-label-sm text-label-sm self-start sm:self-center font-semibold">
              3 High-Confidence Directives
            </span>
          </div>

          {/* 3 Structured Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md relative z-10">
            {/* Insight 1 */}
            <div className="p-space-md rounded-xl bg-workspace-surface flex flex-col justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-red-tint text-red-critical flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">warning</span>
                  </span>
                  <span className="font-label-md text-label-md text-text-primary font-bold">
                    Shortage Surge Detected
                  </span>
                </div>
                <p className="font-body-md text-body-md text-text-secondary mb-3">
                  {stats.criticalCount} new critical alerts generated across district nodes, led by acute ORS sachets and Amoxicillin syrup burn.
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-full bg-surface-muted text-text-primary font-label-sm text-label-sm">
                  Rampur
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-muted text-text-primary font-label-sm text-label-sm">
                  Biswan
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-muted text-text-primary font-label-sm text-label-sm">
                  Laharpur
                </span>
              </div>
            </div>

            {/* Insight 2 */}
            <div className="p-space-md rounded-xl bg-workspace-surface flex flex-col justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">
                      swap_horizontal_circle
                    </span>
                  </span>
                  <span className="font-label-md text-label-md text-text-primary font-bold">
                    Targeted Reroutes
                  </span>
                </div>
                <p className="font-body-md text-body-md text-text-secondary mb-2">
                  2 additional emergency redistribution transfers recommended to prevent zero-inventory lock.
                </p>
                <div className="space-y-1">
                  <div className="text-text-primary font-body-sm text-body-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-accent"></span>
                    <span><strong>Maholi → Rampur:</strong> 180 ORS packs</span>
                  </div>
                  <div className="text-text-primary font-body-sm text-body-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-accent"></span>
                    <span><strong>Khairabad → Biswan:</strong> 40 vials Insulin</span>
                  </div>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-teal-accent font-semibold">
                Dispatch SLA: Under 4 hours
              </span>
            </div>

            {/* Insight 3 */}
            <div className="p-space-md rounded-xl bg-workspace-surface flex flex-col justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-amber-tint text-text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">
                      hourglass_bottom
                    </span>
                  </span>
                  <span className="font-label-md text-label-md text-text-primary font-bold">
                    Coverage Collapse Risk
                  </span>
                </div>
                <p className="font-body-md text-body-md text-text-secondary">
                  Average network stock cover drops precipitously without preemptive dispatch protocol.
                </p>
              </div>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="font-metric-display text-headline-lg text-text-primary font-bold">
                  11d
                </span>
                <span className="material-symbols-outlined text-red-critical text-xl">
                  arrow_forward
                </span>
                <span className="font-metric-display text-headline-lg text-red-critical font-bold">
                  {stats.daysCover}
                </span>
                <span className="font-body-sm text-body-sm text-text-muted ml-auto">
                  Mean district buffer
                </span>
              </div>
            </div>
          </div>

          {/* Actions Footer inside Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm relative z-10">
            <div className="flex items-center gap-2 text-text-muted font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>
                Redistribution route optimized for minimal inter-facility transit time (Sitapur arterial network)
              </span>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto">
              <button
                onClick={() => {
                  const blob = new Blob(
                    [
                      JSON.stringify(
                        {
                          scenario,
                          severity,
                          stats,
                          generated: new Date().toISOString(),
                        },
                        null,
                        2
                      ),
                    ],
                    { type: "application/json" }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `simulation-${severity}.json`;
                  a.click();
                }}
                className="flex-1 sm:flex-initial h-11 px-space-md rounded-full bg-surface-muted hover:bg-card-surface text-text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                Export scenario forecast
              </button>
              <Link
                href="/redistributions"
                className="flex-1 sm:flex-initial h-11 px-space-lg rounded-full bg-text-primary hover:bg-action-hover text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>View updated redistribution plan</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Reassuring Operational & Compliance Boundary Banner */}
        <div className="w-full bg-card-surface/70 rounded-lg p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm shadow-sm">
          <div className="flex items-center gap-space-sm text-text-secondary font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-text-muted text-xl shrink-0">lock</span>
            <span>
              Simulated data does not affect live PHC records. All scenario models run in a sandboxed analytical layer.
            </span>
          </div>
          <span className="px-space-md py-1 rounded-full bg-workspace-surface text-text-muted font-label-sm text-label-sm shrink-0">
            Local Sovereign Sandbox · Sitapur District Health Authority
          </span>
        </div>
      </div>
    </main>
  );
}
