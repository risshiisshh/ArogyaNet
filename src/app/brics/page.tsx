"use client";

import { useState } from "react";
import Link from "next/link";

export default function BRICSPage() {
  const [southAfricaSimulated, setSouthAfricaSimulated] = useState(false);

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col w-full gap-space-lg">
        {/* Page Header & Utility Cluster */}
        <section className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
                One Model, Multiple Health Networks
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-accent font-label-sm text-label-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse"></span>
                Shared model logic
              </span>
            </div>
            <p className="font-body-lg text-body-lg text-text-secondary leading-relaxed">
              ArogyaNet's forecasting and redistribution logic can run across independent public-health networks using each country's own sovereign data.
            </p>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 self-start lg:self-center">
            <button
              onClick={() => {
                const report = {
                  title: "ArogyaNet BRICS Federated Network Report",
                  timestamp: new Date().toISOString(),
                  nodes: [
                    {
                      name: "India (Bharat-01)",
                      network: "Sitapur District Network (UP NHM)",
                      facilities: 18,
                      critical: 2,
                      attention: 3,
                      healthy: 13,
                    },
                    {
                      name: "South Africa (ZA-KZN)",
                      network: "eThekwini Health Network (KZN DoH)",
                      facilities: 9,
                      critical: 1,
                      attention: 2,
                      healthy: 6,
                    },
                  ],
                  privacyCompliance: [
                    "Data residency guaranteed",
                    "No cross-border patient health info (PHI)",
                    "Deterministic mathematical safety floors",
                  ],
                };
                const blob = new Blob([JSON.stringify(report, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "brics-federated-network-report.json";
                a.click();
              }}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-card-surface text-text-primary hover:bg-surface-muted transition-all font-label-md text-label-md shadow-[0_4px_14px_rgba(17,19,24,0.04)] active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">
                download
              </span>
              Export network report
            </button>
            <button
              onClick={() => alert("Model Hyperparameters:\n• Safety Floor Cushion: 15%\n• Lookahead Window: 72 hrs\n• Differential Privacy Epsilon: 0.1\n• Hash Validation: SHA-256")}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-all font-label-md text-label-md shadow-[0_4px_14px_rgba(17,19,24,0.04)] active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Model parameters
            </button>
          </div>
        </section>

        {/* Architecture Diagram Card */}
        <section className="w-full bg-card-surface rounded-lg p-space-lg lg:p-space-xl shadow-[0_18px_45px_rgba(17,19,24,0.08)]">
          {/* Card Header Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm pb-space-lg">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                Federated Logic Architecture
              </span>
              <h2 className="font-headline-md text-headline-md text-text-primary tracking-tight">
                Sovereign Health Data · Shared Inference Engine
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-tint text-teal-accent font-label-sm text-label-sm self-start md:self-auto">
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>Data stays local · Zero raw telemetry cross-border transfer</span>
            </div>
          </div>

          {/* 3-Block Federated Diagram Grid */}
          <div className="relative w-full grid grid-cols-1 lg:grid-cols-11 gap-space-md items-stretch mt-space-sm">
            {/* Left Block: India Network Data */}
            <div className="lg:col-span-4 bg-workspace-surface rounded-DEFAULT p-space-md flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-all">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-tint text-blue-info font-label-sm text-label-sm font-semibold">
                    Sovereign Partition: Bharat-01
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-green-healthy"
                    title="Partition live and synced"
                  ></span>
                </div>
                <div className="mt-2">
                  <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
                    India Network Data
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    Sitapur District · Uttar Pradesh
                  </p>
                </div>
                <div className="mt-space-sm flex flex-col gap-2 pt-space-xs">
                  <div className="flex items-center gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-teal-accent">
                      domain
                    </span>
                    <span><strong>18 PHCs</strong> actively reporting telemetry</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-teal-accent">
                      database
                    </span>
                    <span>Local Essential Medicines Formulary database</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-teal-accent">
                      lock
                    </span>
                    <span>100% Sovereign cloud storage (NIC India)</span>
                  </div>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-green-healthy font-label-sm text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-healthy animate-ping"></span>
                  Live telemetry sync active
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">Latency: 28ms</span>
              </div>
            </div>

            {/* Center Connector & AI Engine */}
            <div className="lg:col-span-3 bg-text-primary text-on-primary rounded-DEFAULT p-space-md flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-accent/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-purple-accent/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-teal-tint font-label-sm text-label-sm border border-outline-variant/30">
                    Core AI Engine v4.2
                  </span>
                  <span className="material-symbols-outlined text-teal-tint text-lg">
                    neurology
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-primary tracking-tight font-bold">
                    Shared ArogyaNet Model
                  </h3>
                  <p className="font-body-sm text-body-sm text-surface-dim mt-0.5">
                    Dynamic Stockout Forecasting &amp; Safe Redistribution
                  </p>
                </div>
                <div className="mt-space-sm flex flex-col gap-2 pt-space-xs">
                  <div className="flex items-start gap-2 text-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-teal-tint shrink-0 mt-0.5">
                      security
                    </span>
                    <span>Zero training on Personally Identifiable Info (PII)</span>
                  </div>
                  <div className="flex items-start gap-2 text-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-teal-tint shrink-0 mt-0.5">
                      trending_up
                    </span>
                    <span>Generalized burn-rate &amp; consumption algorithms</span>
                  </div>
                  <div className="flex items-start gap-2 text-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-teal-tint shrink-0 mt-0.5">
                      balance
                    </span>
                    <span>Strict mathematical donor safety floor rules</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 mt-space-md pt-space-sm flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-teal-tint">
                  <span className="material-symbols-outlined text-sm">cached</span>
                  Zero-knowledge weights
                </div>
                <span className="px-2 py-0.5 rounded-full bg-action-hover text-on-primary font-label-sm text-label-sm">
                  Inference Active
                </span>
              </div>
            </div>

            {/* Right Block: South Africa Network Data */}
            <div className="lg:col-span-4 bg-workspace-surface rounded-DEFAULT p-space-md flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-all">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-tint text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">
                    Sovereign Partition: ZA-KZN
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-green-healthy"
                    title="Partition live and synced"
                  ></span>
                </div>
                <div className="mt-2">
                  <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
                    South Africa Network Data
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    eThekwini Health Network · KwaZulu-Natal
                  </p>
                </div>
                <div className="mt-space-sm flex flex-col gap-2 pt-space-xs">
                  <div className="flex items-center gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-on-tertiary-fixed-variant">
                      local_hospital
                    </span>
                    <span><strong>9 CHCs</strong> (Community Health Centres) active</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-on-tertiary-fixed-variant">
                      inventory_2
                    </span>
                    <span>Provincial ARV &amp; Chronic inventory registry</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-on-tertiary-fixed-variant">
                      verified
                    </span>
                    <span>POPIA Data Protection Act compliant residency</span>
                  </div>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-green-healthy font-label-sm text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-healthy animate-ping"></span>
                  Federated agent connected
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">Latency: 42ms</span>
              </div>
            </div>
          </div>

          {/* Data Exchange Status Bar */}
          <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm text-text-secondary font-body-sm text-body-sm bg-workspace-surface px-space-md py-space-sm rounded-full">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-base text-teal-accent">
                sync_alt
              </span>
              <span>
                Only encrypted gradient updates and threshold constraints transit between sovereign nodes.
              </span>
            </div>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent mr-1"></span>
              Audit Log Signature: SHA-256 Validated
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="w-full flex flex-col gap-space-md mt-space-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
            <div>
              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider font-semibold">
                Independent Sovereign Nodes
              </span>
              <h2 className="font-headline-md text-headline-md text-text-primary tracking-tight">
                Active Network Implementations &amp; AI Recommendations
              </h2>
            </div>
            <span className="font-body-sm text-body-sm text-text-muted">
              Updated across both nodes 3 minutes ago
            </span>
          </div>

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* Card 1: India · Sitapur District */}
            <article className="bg-card-surface rounded-lg p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col justify-between gap-space-lg transition-all">
              <div className="flex flex-col gap-space-md">
                {/* Card Header & Metadata */}
                <div className="flex items-start justify-between gap-space-sm pb-space-sm">
                  <div>
                    <span className="font-label-sm text-label-sm text-teal-accent font-semibold uppercase tracking-wider">
                      Uttar Pradesh National Health Mission
                    </span>
                    <h3 className="font-headline-md text-headline-md text-text-primary tracking-tight mt-0.5">
                      Sitapur District Network
                    </h3>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Primary Health Centre (PHC) Level Tier-1 Deployment
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-teal-tint text-teal-accent font-label-sm text-label-sm shrink-0 font-semibold">
                    Bharat-01 Node
                  </span>
                </div>
                {/* Operational Metrics Strip */}
                <div className="grid grid-cols-4 gap-2 bg-workspace-surface p-space-sm rounded-DEFAULT">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-text-muted">Monitored</span>
                    <span className="font-headline-sm text-headline-sm text-text-primary mt-0.5 font-bold">
                      18
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">Centres</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-red-critical font-semibold">
                      Critical
                    </span>
                    <span className="font-headline-sm text-headline-sm text-red-critical mt-0.5 font-bold">
                      2
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">PHCs at risk</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-amber-accent font-bold">
                      Attention
                    </span>
                    <span className="font-headline-sm text-headline-sm text-text-primary mt-0.5 font-bold">
                      3
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">
                      Approaching limit
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-green-healthy font-semibold">
                      Healthy
                    </span>
                    <span className="font-headline-sm text-headline-sm text-green-healthy mt-0.5 font-bold">
                      13
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">Stabilized</span>
                  </div>
                </div>
                {/* Active AI Recommendation Box */}
                <div className="bg-teal-tint/40 rounded-DEFAULT p-space-md flex flex-col gap-space-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm flex items-center gap-1.5 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-critical"></span>
                      Urgent Reallocation
                    </span>
                    <span className="font-label-sm text-label-sm text-teal-accent flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      Match Score: 98.4%
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-text-primary leading-snug">
                    Transfer 120 ORS Sachets from Maholi PHC to Rampur PHC
                  </h4>
                  {/* Mini Transfer Row */}
                  <div className="bg-card-surface rounded-DEFAULT p-space-sm flex items-center justify-between gap-space-xs shadow-sm">
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-text-primary truncate font-bold">
                        Maholi PHC
                      </span>
                      <span className="font-body-sm text-body-sm text-text-secondary truncate">
                        Surplus: 360 → 240 bal
                      </span>
                    </div>
                    <div className="flex flex-col items-center shrink-0 px-2">
                      <span className="px-2 py-0.5 rounded-full bg-text-primary text-on-primary font-label-sm text-label-sm font-bold">
                        120 units
                      </span>
                      <span className="material-symbols-outlined text-base text-text-muted mt-0.5">
                        arrow_forward
                      </span>
                    </div>
                    <div className="flex flex-col items-end min-w-0 text-right">
                      <span className="font-label-sm text-label-sm text-text-primary truncate font-bold">
                        Rampur PHC
                      </span>
                      <span className="font-body-sm text-body-sm text-red-critical font-semibold truncate">
                        20 → 140 units
                      </span>
                    </div>
                  </div>
                  {/* Note & Outcome */}
                  <div className="flex items-start gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-teal-accent shrink-0 mt-0.5">
                      info
                    </span>
                    <p>
                      Prevents a stockout in 2.5 days. Restores Rampur pediatric dehydration formulary without risking Maholi safety floor.
                    </p>
                  </div>
                </div>
              </div>
              {/* Card Action */}
              <div className="pt-space-xs">
                <Link
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-space-md rounded-full bg-text-primary text-on-primary font-label-md text-label-md hover:bg-action-hover transition-all shadow-md active:scale-[0.99]"
                  href="/redistributions"
                >
                  <span>View Sitapur redistribution</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </article>

            {/* Card 2: South Africa · eThekwini Health Network */}
            <article className="bg-card-surface rounded-lg p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col justify-between gap-space-lg transition-all">
              <div className="flex flex-col gap-space-md">
                {/* Card Header & Metadata */}
                <div className="flex items-start justify-between gap-space-sm pb-space-sm">
                  <div>
                    <span className="font-label-sm text-label-sm text-purple-accent font-semibold uppercase tracking-wider">
                      KwaZulu-Natal Department of Health
                    </span>
                    <h3 className="font-headline-md text-headline-md text-text-primary tracking-tight mt-0.5">
                      eThekwini Health Network
                    </h3>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Community Health Centre (CHC) Strategic Hub Deployment
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-tint text-on-tertiary-fixed-variant font-label-sm text-label-sm shrink-0 font-semibold">
                    ZA-KZN Node
                  </span>
                </div>
                {/* Operational Metrics Strip */}
                <div className="grid grid-cols-4 gap-2 bg-workspace-surface p-space-sm rounded-DEFAULT">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-text-muted">Monitored</span>
                    <span className="font-headline-sm text-headline-sm text-text-primary mt-0.5 font-bold">
                      9
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">Centres</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-red-critical font-semibold">
                      Critical
                    </span>
                    <span className="font-headline-sm text-headline-sm text-red-critical mt-0.5 font-bold">
                      1
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">CHC at risk</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-amber-accent font-bold">
                      Attention
                    </span>
                    <span className="font-headline-sm text-headline-sm text-text-primary mt-0.5 font-bold">
                      2
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">
                      Reorder point
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-green-healthy font-semibold">
                      Healthy
                    </span>
                    <span className="font-headline-sm text-headline-sm text-green-healthy mt-0.5 font-bold">
                      6
                    </span>
                    <span className="font-body-sm text-body-sm text-text-secondary">Stabilized</span>
                  </div>
                </div>
                {/* Active AI Recommendation Box */}
                <div className="bg-purple-tint/40 rounded-DEFAULT p-space-md flex flex-col gap-space-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm flex items-center gap-1.5 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-critical"></span>
                      Urgent Reallocation
                    </span>
                    <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      Match Score: 96.9%
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-text-primary leading-snug">
                    Transfer 80 units of ARV Medication from Phoenix CHC to Umlazi CHC
                  </h4>
                  {/* Mini Transfer Row */}
                  <div className="bg-card-surface rounded-DEFAULT p-space-sm flex items-center justify-between gap-space-xs shadow-sm">
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-text-primary truncate font-bold">
                        Phoenix CHC
                      </span>
                      <span className="font-body-sm text-body-sm text-text-secondary truncate">
                        Surplus: 220 → 140 safe
                      </span>
                    </div>
                    <div className="flex flex-col items-center shrink-0 px-2">
                      <span className="px-2 py-0.5 rounded-full bg-text-primary text-on-primary font-label-sm text-label-sm font-bold">
                        80 units
                      </span>
                      <span className="material-symbols-outlined text-base text-text-muted mt-0.5">
                        arrow_forward
                      </span>
                    </div>
                    <div className="flex flex-col items-end min-w-0 text-right">
                      <span className="font-label-sm text-label-sm text-text-primary truncate font-bold">
                        Umlazi CHC
                      </span>
                      <span className="font-body-sm text-body-sm text-red-critical font-semibold truncate">
                        12 → 92 units
                      </span>
                    </div>
                  </div>
                  {/* Note & Outcome */}
                  <div className="flex items-start gap-2 text-text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-base text-purple-accent shrink-0 mt-0.5">
                      info
                    </span>
                    <p>
                      Umlazi's ARV supply is forecast to run out within 4 days; Phoenix holds sufficient surplus to maintain 45+ days safety buffer.
                    </p>
                  </div>
                </div>
              </div>
              {/* Card Action */}
              <div className="pt-space-xs">
                <button
                  onClick={() => {
                    setSouthAfricaSimulated(true);
                    alert("Simulated dispatch protocol initiated for eThekwini Health Network (ZA-KZN). Manifest SHA-256 logged.");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-space-md rounded-full bg-text-primary text-on-primary font-label-md text-label-md hover:bg-action-hover transition-all shadow-md active:scale-[0.99] cursor-pointer"
                  type="button"
                >
                  <span>
                    {southAfricaSimulated ? "eThekwini Dispatch Active" : "Simulate eThekwini dispatch"}
                  </span>
                  <span className="material-symbols-outlined text-lg">
                    {southAfricaSimulated ? "check_circle" : "arrow_forward"}
                  </span>
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* Data Sovereignty & Privacy Reassurance Callout */}
        <section className="w-full bg-card-surface rounded-lg p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col md:flex-row items-start md:items-center gap-space-lg">
          <div className="w-14 h-14 rounded-full bg-teal-tint flex items-center justify-center shrink-0 text-teal-accent shadow-sm">
            <span className="material-symbols-outlined text-3xl">verified_user</span>
          </div>
          <div className="flex flex-col gap-space-xs flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
                Data Sovereignty &amp; Architectural Boundaries
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm font-semibold">
                Compliance Verified
              </span>
            </div>
            <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
              Each network keeps its own data. The shared model logic helps every member network detect shortages and plan redistribution without exposing patient identities or domestic database records.
            </p>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-space-lg pt-space-xs font-label-sm text-label-sm text-text-primary">
              <div className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-teal-accent">shield</span>
                <span>Data residency guaranteed</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-teal-accent">
                  vpn_key_off
                </span>
                <span>No cross-border patient health info (PHI)</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-teal-accent">
                  calculate
                </span>
                <span>Identical mathematical safety constraints tailored to local formulary rules</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
