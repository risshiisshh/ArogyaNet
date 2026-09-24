"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Activity,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface BRICSCountry {
  name: string;
  code: string;
  flag: string;
  phcDensity: number; // per 100k population
  stockoutFreq: string;
  telemetryAdoption: number; // %
  transferModel: string;
  resilienceScore: number;
  keyInitiative: string;
  arogyanetFit: string;
}

const bricsData: BRICSCountry[] = [
  {
    name: "India",
    code: "IND",
    flag: "🇮🇳",
    phcDensity: 2.3,
    stockoutFreq: "12-18 days/yr",
    telemetryAdoption: 68,
    transferModel: "Deterministic AI Rebalance (ArogyaNet)",
    resilienceScore: 84,
    keyInitiative: "Ayushman Arogya Mandir & National Digital Health Mission",
    arogyanetFit: "Native deployment across Sitapur/Hardoi district hubs with real-time stockout forecast.",
  },
  {
    name: "Brazil",
    code: "BRA",
    flag: "🇧🇷",
    phcDensity: 3.1,
    stockoutFreq: "14-22 days/yr",
    telemetryAdoption: 74,
    transferModel: "SUS Regional Supply Matrix",
    resilienceScore: 81,
    keyInitiative: "Estratégia Saúde da Família (Family Health Strategy)",
    arogyanetFit: "Ideal for Amazonas river basin rural UBS clinics with 7-day river barge transit constraints.",
  },
  {
    name: "South Africa",
    code: "ZAF",
    flag: "🇿🇦",
    phcDensity: 1.8,
    stockoutFreq: "22-30 days/yr",
    telemetryAdoption: 58,
    transferModel: "Provincial Centralized Depot Dispatch",
    resilienceScore: 72,
    keyInitiative: "Ideal Clinic Realisation and Maintenance (ICRM)",
    arogyanetFit: "Reduces ART and anti-TB medicine stockouts in Eastern Cape remote rural health posts.",
  },
  {
    name: "China",
    code: "CHN",
    flag: "🇨🇳",
    phcDensity: 4.2,
    stockoutFreq: "5-9 days/yr",
    telemetryAdoption: 92,
    transferModel: "County Medical Community (CMC) Hub-and-Spoke",
    resilienceScore: 91,
    keyInitiative: "Tiered Healthcare System & County Health Alliances",
    arogyanetFit: "Cross-verified algorithms against county hospital level automated replenishment.",
  },
  {
    name: "Russia",
    code: "RUS",
    flag: "🇷🇺",
    phcDensity: 3.8,
    stockoutFreq: "10-15 days/yr",
    telemetryAdoption: 79,
    transferModel: "Federal Feldsher-Obstetric Point (FAP) Logistics",
    resilienceScore: 78,
    keyInitiative: "Unified State Health Information System (EGISZ)",
    arogyanetFit: "Optimizes long-distance supply buffers for Siberian and Far Eastern isolated FAP clinics.",
  },
];

export default function BRICSComparisonPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("India");

  const current = bricsData.find((c) => c.name === selectedCountry) || bricsData[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626875]">
              Multilateral Health Framework
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF3FF] text-[#2563EB]">
              <Globe2 className="w-3.5 h-3.5" />
              BRICS Public Health Working Group
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111318] tracking-tight">
            BRICS Primary Care Resilience Benchmark
          </h1>
          <p className="text-sm text-[#626875] max-w-3xl">
            Comparative analysis of primary healthcare facility density, last-mile stockout vulnerabilities, and algorithmic inventory redistribution models across emerging market economies.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F8F88]" />
            <span>Ask Admin Assistant About Global Specs</span>
          </Link>
        </div>
      </div>

      {/* Country Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {bricsData.map((country) => (
          <button
            key={country.name}
            onClick={() => setSelectedCountry(country.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCountry === country.name
                ? "bg-[#111318] text-white shadow-sm"
                : "bg-white text-[#626875] hover:bg-[#F8F8FA] border border-[#E7E9EE]"
            }`}
          >
            <span className="text-sm">{country.flag}</span>
            <span>{country.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCountry === country.name ? "bg-white/20" : "bg-black/5"
              }`}
            >
              {country.resilienceScore}
            </span>
          </button>
        ))}
      </div>

      {/* Country Detail Deep-Dive (8 Cols) + Comparative Benchmark (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Selected Country Deep-Dive */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E9EE]">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{current.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-[#111318]">{current.name}</h2>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F8F8FA] border border-[#E7E9EE]">
                    {current.code}
                  </span>
                </div>
                <p className="text-xs text-[#626875] mt-0.5">{current.keyInitiative}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#8D93A1]">
                Health Resilience Index
              </div>
              <div className="text-3xl font-black text-[#0F8F88]">
                {current.resilienceScore}
                <span className="text-xs font-bold text-[#8D93A1]"> / 100</span>
              </div>
            </div>
          </div>

          {/* Metric Quad */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
              <div className="text-xs text-[#626875] mb-1 font-medium">PHC Density</div>
              <div className="text-2xl font-extrabold text-[#111318]">
                {current.phcDensity}
              </div>
              <div className="text-[10px] text-[#8D93A1] mt-0.5">per 100k population</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
              <div className="text-xs text-[#626875] mb-1 font-medium">Stockout Rate</div>
              <div className="text-2xl font-extrabold text-[#D93838]">
                {current.stockoutFreq}
              </div>
              <div className="text-[10px] text-[#8D93A1] mt-0.5">Annual last-mile lag</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
              <div className="text-xs text-[#626875] mb-1 font-medium">Digital Telemetry</div>
              <div className="text-2xl font-extrabold text-[#248A54]">
                {current.telemetryAdoption}%
              </div>
              <div className="text-[10px] text-[#8D93A1] mt-0.5">Clinic IoT connectivity</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
              <div className="text-xs text-[#626875] mb-1 font-medium">Logistics Model</div>
              <div className="text-sm font-bold text-[#111318] line-clamp-2">
                {current.transferModel}
              </div>
            </div>
          </div>

          {/* ArogyaNet Protocol Portability Evaluation */}
          <div className="p-5 rounded-2xl bg-[#E7F7F5] border border-[#0F8F88]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F8F88]">
              <Sparkles className="w-4 h-4" />
              <span>ArogyaNet Protocol Portability Assessment</span>
            </div>
            <p className="text-xs text-[#111318] leading-relaxed">
              {current.arogyanetFit}
            </p>
          </div>

          {/* All 5 Countries Comparative Matrix Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-[#111318]">
              Multilateral Comparison Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E7E9EE] text-[#8D93A1] font-bold text-[10px] uppercase">
                    <th className="py-2.5">Economy</th>
                    <th className="py-2.5 text-right">PHC Density</th>
                    <th className="py-2.5 text-right">Telemetry %</th>
                    <th className="py-2.5 text-right">Stockout Lag</th>
                    <th className="py-2.5 text-right">Resilience Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {bricsData.map((c) => (
                    <tr
                      key={c.name}
                      onClick={() => setSelectedCountry(c.name)}
                      className={`cursor-pointer transition-colors ${
                        c.name === current.name ? "bg-[#F8F8FA] font-bold" : "hover:bg-[#F8F8FA]/50"
                      }`}
                    >
                      <td className="py-3 flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="text-[#111318]">{c.name}</span>
                      </td>
                      <td className="py-3 text-right font-mono">{c.phcDensity}</td>
                      <td className="py-3 text-right font-mono text-[#248A54]">{c.telemetryAdoption}%</td>
                      <td className="py-3 text-right font-mono text-[#D93838]">{c.stockoutFreq}</td>
                      <td className="py-3 text-right font-mono font-bold text-[#0F8F88]">{c.resilienceScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Global Policy Benchmarks */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E0A000]" />
              <h3 className="font-extrabold text-sm text-[#111318]">
                WHO / BRICS Resilience Standard
              </h3>
            </div>

            <p className="text-xs text-[#626875] leading-relaxed">
              The BRICS Health Framework recommends establishing horizontal peer-to-peer clinic redistribution channels so that districts can achieve <strong>under 48-hour emergency buffer balancing</strong> without relying solely on state warehouse resupply cycles.
            </p>

            <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] text-xs space-y-2">
              <div className="font-bold text-[#111318]">Key Recommended Actions:</div>
              <ul className="list-disc pl-4 space-y-1 text-[#626875]">
                <li>Deterministic stock burn curve calculation at every PHC</li>
                <li>Preservation of minimum 7-day reserve buffer at donors</li>
                <li>Digital transfer receipt and driver manifest dispatch</li>
              </ul>
            </div>

            <Link
              href="/redistributions"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors"
            >
              <span>Explore Active District Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0F8F88]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
