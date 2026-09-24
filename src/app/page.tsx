"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import rawPhcs from "@/data/phcs.json";
import {
  enrichAllPHCs,
  getNetworkSummary,
  computeAlerts,
  computeRedistributions,
  PHC,
  PHCStatus,
} from "@/lib/domain";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bed,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Hospital,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const phcs = useMemo(() => rawPhcs as PHC[], []);
  const enrichedPHCs = useMemo(() => enrichAllPHCs(phcs), [phcs]);
  const summary = useMemo(() => getNetworkSummary(enrichedPHCs), [enrichedPHCs]);
  const alerts = useMemo(() => computeAlerts(phcs), [phcs]);
  const redistributions = useMemo(() => computeRedistributions(phcs), [phcs]);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [approvedTransfers, setApprovedTransfers] = useState<Record<string, boolean>>({});

  const filteredPHCs = useMemo(() => {
    return enrichedPHCs.filter((phc) => {
      if (statusFilter !== "all" && phc.status !== statusFilter) return false;
      if (districtFilter !== "all" && phc.district !== districtFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = phc.phc_name.toLowerCase().includes(q);
        const matchesDistrict = phc.district.toLowerCase().includes(q);
        const matchesBlock = phc.block.toLowerCase().includes(q);
        const matchesMeds = phc.inventory.some((i) =>
          i.medicine_name.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDistrict && !matchesBlock && !matchesMeds) {
          return false;
        }
      }
      return true;
    });
  }, [enrichedPHCs, statusFilter, districtFilter, searchQuery]);

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Operational Header */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626875]">
              District Surveillance Network
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7F7F5] text-[#0F8F88] border border-[#0F8F88]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F8F88] animate-ping" />
              Automated AI Telemetry Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111318] tracking-tight">
            Sitapur & Hardoi Operational Grid
          </h1>
          <p className="text-sm text-[#626875] max-w-3xl">
            Real-time facility inventory forecasting, bed saturation monitoring, and AI-coordinated inter-PHC resource redistribution for 18 primary health centres.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/redistributions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F8F88]" />
            <span>AI Rebalancing Plan</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
              {redistributions.length}
            </span>
          </Link>

          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8F8FA] text-[#111318] text-xs font-bold border border-[#E7E9EE] hover:bg-[#EDEEF0] transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-[#E0A000]" />
            <span>Simulate Surge</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total PHCs */}
        <div className="bg-white rounded-2xl p-5 border border-[#E7E9EE] shadow-sm hover:border-[#111318] transition-colors">
          <div className="flex items-center justify-between text-[#8D93A1] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Facilities</span>
            <Hospital className="w-4 h-4 text-[#111318]" />
          </div>
          <div className="text-3xl font-extrabold text-[#111318]">{summary.total}</div>
          <div className="text-[11px] text-[#626875] mt-1 font-medium">Across 2 Districts</div>
        </div>

        {/* Critical Shortages */}
        <div
          onClick={() => setStatusFilter("critical")}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            statusFilter === "critical"
              ? "border-[#D93838] ring-2 ring-[#D93838]/20 bg-[#FDE8E8]/30"
              : "border-[#E7E9EE] hover:border-[#D93838]"
          }`}
        >
          <div className="flex items-center justify-between text-[#D93838] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Critical</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D93838] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D93838]"></span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#D93838]">{summary.critical}</div>
          <div className="text-[11px] text-[#D93838] mt-1 font-semibold">Immediate Action</div>
        </div>

        {/* Low / Needs Attention */}
        <div
          onClick={() => setStatusFilter("low")}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            statusFilter === "low"
              ? "border-[#E0A000] ring-2 ring-[#E0A000]/20 bg-[#FFF4D6]/30"
              : "border-[#E7E9EE] hover:border-[#E0A000]"
          }`}
        >
          <div className="flex items-center justify-between text-[#E0A000] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Attention</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-[#E0A000]">{summary.low}</div>
          <div className="text-[11px] text-[#E0A000] mt-1 font-semibold">Depleting &le; 3 Days</div>
        </div>

        {/* Healthy Facilities */}
        <div
          onClick={() => setStatusFilter("healthy")}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            statusFilter === "healthy"
              ? "border-[#248A54] ring-2 ring-[#248A54]/20 bg-[#E5F6EE]/30"
              : "border-[#E7E9EE] hover:border-[#248A54]"
          }`}
        >
          <div className="flex items-center justify-between text-[#248A54] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Healthy</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-[#248A54]">{summary.healthy}</div>
          <div className="text-[11px] text-[#248A54] mt-1 font-semibold">Full Buffer &gt; 7d</div>
        </div>

        {/* Avg Bed Occupancy */}
        <div className="bg-white rounded-2xl p-5 border border-[#E7E9EE] shadow-sm">
          <div className="flex items-center justify-between text-[#8D93A1] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Bed Saturation</span>
            <Bed className="w-4 h-4 text-[#0F8F88]" />
          </div>
          <div className="text-3xl font-extrabold text-[#111318]">
            {summary.avgBedOccupancy}%
          </div>
          <div className="w-full bg-[#E7E9EE] rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                summary.avgBedOccupancy > 75 ? "bg-[#E0A000]" : "bg-[#0F8F88]"
              }`}
              style={{ width: `${summary.avgBedOccupancy}%` }}
            />
          </div>
        </div>

        {/* AI Recommendations */}
        <Link
          href="/redistributions"
          className="bg-[#0F8F88] rounded-2xl p-5 text-white shadow-md shadow-[#0F8F88]/20 hover:bg-[#0c746e] transition-colors group"
        >
          <div className="flex items-center justify-between text-white/80 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Transfers Ready</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white">{redistributions.length}</div>
          <div className="text-[11px] text-white/90 mt-1 font-medium">Safe Rebalances</div>
        </Link>
      </div>

      {/* Middle Grid: Operational Readiness & Action Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Network Readiness & Urgent Alerts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Urgent Early Warnings Strip */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FDE8E8] text-[#D93838] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111318]">
                    Urgent Early Warnings Requiring Authorization
                  </h2>
                  <p className="text-xs text-[#626875]">
                    Deterministic arithmetic verified against facility daily consumption
                  </p>
                </div>
              </div>
              <Link
                href="/alerts"
                className="text-xs font-bold text-[#0F8F88] hover:underline flex items-center gap-1"
              >
                <span>View all ({alerts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] hover:border-[#D93838] transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 mt-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-[#FDE8E8] text-[#D93838] shrink-0">
                      {alert.category}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#111318]">{alert.title}</h4>
                      <p className="text-[11px] text-[#626875] mt-0.5 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href={`/phc/${alert.phc_id}`}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-[#111318] border border-[#E7E9EE] hover:bg-[#EDEEF0] transition-colors"
                    >
                      Inspect Facility
                    </Link>
                    <Link
                      href="/redistributions"
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#111318] text-white hover:bg-[#252830] transition-colors"
                    >
                      Resolve Transfer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Facility Filter & Search Bar */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#111318]">Primary Health Centres</h2>
                <p className="text-xs text-[#626875]">
                  Showing {filteredPHCs.length} of {enrichedPHCs.length} health facilities
                </p>
              </div>

              {/* District Filter Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#626875]">District:</span>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="bg-[#F8F8FA] border border-[#E7E9EE] rounded-full px-3 py-1.5 text-xs font-bold text-[#111318] focus:outline-none focus:ring-1 focus:ring-[#111318]"
                >
                  <option value="all">All Districts (Sitapur &amp; Hardoi)</option>
                  <option value="Sitapur">Sitapur District</option>
                  <option value="Hardoi">Hardoi District</option>
                </select>
              </div>
            </div>

            {/* Filter Pills & Search Input */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: "all", label: "All PHCs", count: enrichedPHCs.length },
                  { id: "critical", label: "Critical", count: summary.critical, color: "text-[#D93838]" },
                  { id: "low", label: "Needs Attention", count: summary.low, color: "text-[#E0A000]" },
                  { id: "healthy", label: "Healthy", count: summary.healthy, color: "text-[#248A54]" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setStatusFilter(pill.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      statusFilter === pill.id
                        ? "bg-[#111318] text-white shadow-sm"
                        : "bg-[#F8F8FA] text-[#626875] hover:bg-[#EDEEF0] hover:text-[#111318] border border-[#E7E9EE]"
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        statusFilter === pill.id
                          ? "bg-white/20 text-white"
                          : "bg-black/5 text-[#626875]"
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-[#8D93A1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search PHC, block or medicine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8F8FA] border border-[#E7E9EE] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#111318] placeholder-[#8D93A1] focus:outline-none focus:ring-1 focus:ring-[#111318]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8D93A1] hover:text-[#111318]"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Grid of PHC Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredPHCs.map((phc) => {
                const isCritical = phc.status === "critical";
                const isLow = phc.status === "low";

                return (
                  <div
                    key={phc.phc_id}
                    className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                      isCritical
                        ? "border-[#D93838]/40 hover:border-[#D93838]"
                        : isLow
                        ? "border-[#E0A000]/40 hover:border-[#E0A000]"
                        : "border-[#E7E9EE] hover:border-[#248A54]"
                    }`}
                  >
                    <div>
                      {/* Card Header: Facility Name + Status Badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-[#111318]">
                              {phc.phc_name}
                            </h3>
                            <span className="text-[10px] font-mono font-medium text-[#8D93A1]">
                              {phc.phc_id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#626875] mt-0.5">
                            <MapPin className="w-3 h-3 text-[#8D93A1]" />
                            <span>
                              {phc.block} Block, {phc.district}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                            isCritical
                              ? "bg-[#FDE8E8] text-[#D93838]"
                              : isLow
                              ? "bg-[#FFF4D6] text-[#E0A000]"
                              : "bg-[#E5F6EE] text-[#248A54]"
                          }`}
                        >
                          {phc.status}
                        </span>
                      </div>

                      {/* Bed Occupancy & Staff Status */}
                      <div className="grid grid-cols-2 gap-3 py-2.5 my-2.5 border-y border-[#F3F4F6] text-xs">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#626875] mb-1 font-medium">
                            <span className="flex items-center gap-1">
                              <Bed className="w-3 h-3" /> Beds
                            </span>
                            <span className="font-bold text-[#111318]">
                              {phc.beds_occupied}/{phc.beds_total} ({phc.bed_occupancy_pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-[#E7E9EE] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                phc.bed_occupancy_pct > 90
                                  ? "bg-[#D93838]"
                                  : phc.bed_occupancy_pct > 75
                                  ? "bg-[#E0A000]"
                                  : "bg-[#248A54]"
                              }`}
                              style={{ width: `${phc.bed_occupancy_pct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#626875] mb-1 font-medium">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> Staff
                            </span>
                            <span className="font-bold text-[#111318]">
                              {phc.staff_present}/{phc.staff_total} ({phc.staff_attendance_pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-[#E7E9EE] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                phc.staff_attendance_pct < 70 ? "bg-[#E0A000]" : "bg-[#248A54]"
                              }`}
                              style={{ width: `${phc.staff_attendance_pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Inventory Item Coverage Pills */}
                      <div className="space-y-1.5 my-2">
                        <div className="text-[10px] uppercase font-bold text-[#8D93A1] tracking-wider">
                          Key Stock Trajectory
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {phc.enriched_inventory.slice(0, 4).map((item) => {
                            const isItemCrit = item.item_status === "critical";
                            const isItemLow = item.item_status === "low";

                            return (
                              <span
                                key={item.medicine_name}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isItemCrit
                                    ? "bg-[#FDE8E8] text-[#D93838]"
                                    : isItemLow
                                    ? "bg-[#FFF4D6] text-[#E0A000]"
                                    : "bg-[#F8F8FA] text-[#626875] border border-[#E7E9EE]"
                                }`}
                              >
                                <span>{item.medicine_name.split(" ")[0]}:</span>
                                <span>{item.coverage_label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 mt-2 border-t border-[#F3F4F6] flex items-center justify-between">
                      <span className="text-[10px] text-[#8D93A1]">
                        Sync: {new Date(phc.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Link
                        href={`/phc/${phc.phc_id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#111318] hover:text-[#0F8F88] transition-colors"
                      >
                        <span>Drill-down Analytics</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Coordinated Transfers & Spatial Overview */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Redistribution Top Actions */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E7F7F5] text-[#0F8F88] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#111318]">
                    AI Rebalancing Recommendations
                  </h3>
                  <p className="text-[11px] text-[#626875]">
                    7-Day safety buffer enforced at donors
                  </p>
                </div>
              </div>
              <Link
                href="/redistributions"
                className="text-xs font-bold text-[#0F8F88] hover:underline"
              >
                All ({redistributions.length})
              </Link>
            </div>

            <div className="space-y-3">
              {redistributions.slice(0, 3).map((rec) => {
                const isApproved = approvedTransfers[rec.id];

                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#111318]">{rec.medicine_name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F7F5] text-[#0F8F88]">
                        Move {rec.quantity} units
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#626875] bg-white p-2 rounded-lg border border-[#E7E9EE]">
                      <div className="text-left">
                        <div className="text-[9px] uppercase font-bold text-[#8D93A1]">Donor</div>
                        <div className="font-bold text-[#111318]">{rec.source_phc_name}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0F8F88]" />
                      <div className="text-right">
                        <div className="text-[9px] uppercase font-bold text-[#8D93A1]">Recipient</div>
                        <div className="font-bold text-[#D93838]">{rec.destination_phc_name}</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#626875] leading-relaxed italic">
                      &ldquo;{rec.reason}&rdquo;
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#8D93A1]">
                        Extends supply to: ~{rec.destination_days_after}d
                      </span>
                      <button
                        onClick={() =>
                          setApprovedTransfers((prev) => ({
                            ...prev,
                            [rec.id]: !prev[rec.id],
                          }))
                        }
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          isApproved
                            ? "bg-[#248A54] text-white"
                            : "bg-[#111318] text-white hover:bg-[#252830]"
                        }`}
                      >
                        {isApproved ? "Approved ✓" : "Authorize"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E9EE]">
              <Link
                href="/redistributions"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors"
              >
                <span>Launch Interactive Rebalancer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* District Geographic Spatial Distribution */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#111318]">
                  Geographic Telemetry Grid
                </h3>
                <p className="text-[11px] text-[#626875]">Spatial layout of monitored nodes</p>
              </div>
              <span className="text-[10px] font-bold text-[#0F8F88] bg-[#E7F7F5] px-2 py-0.5 rounded-full">
                100% Online
              </span>
            </div>

            {/* Visual Schematic Node Grid */}
            <div className="bg-[#F8F8FA] p-4 rounded-xl border border-[#E7E9EE] space-y-3">
              <div className="text-[11px] font-bold text-[#626875] flex items-center justify-between">
                <span>Sitapur District (10 PHCs)</span>
                <span className="text-[10px] text-[#D93838] font-bold">2 Critical</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {enrichedPHCs
                  .filter((p) => p.district === "Sitapur")
                  .map((p) => (
                    <Link
                      key={p.phc_id}
                      href={`/phc/${p.phc_id}`}
                      title={`${p.phc_name} (${p.status})`}
                      className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold transition-transform hover:scale-110 shadow-xs ${
                        p.status === "critical"
                          ? "bg-[#D93838] text-white animate-pulse"
                          : p.status === "low"
                          ? "bg-[#E0A000] text-white"
                          : "bg-[#248A54] text-white"
                      }`}
                    >
                      {p.phc_name.substring(0, 3).toUpperCase()}
                    </Link>
                  ))}
              </div>

              <div className="text-[11px] font-bold text-[#626875] flex items-center justify-between pt-2">
                <span>Hardoi District (8 PHCs)</span>
                <span className="text-[10px] text-[#D93838] font-bold">2 Critical</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {enrichedPHCs
                  .filter((p) => p.district === "Hardoi")
                  .map((p) => (
                    <Link
                      key={p.phc_id}
                      href={`/phc/${p.phc_id}`}
                      title={`${p.phc_name} (${p.status})`}
                      className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold transition-transform hover:scale-110 shadow-xs ${
                        p.status === "critical"
                          ? "bg-[#D93838] text-white animate-pulse"
                          : p.status === "low"
                          ? "bg-[#E0A000] text-white"
                          : "bg-[#248A54] text-white"
                      }`}
                    >
                      {p.phc_name.substring(0, 3).toUpperCase()}
                    </Link>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#626875] pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#D93838]" /> Critical (&le; reorder)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#E0A000]" /> Low (&le; 3d)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#248A54]" /> Healthy (&gt; 7d)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
