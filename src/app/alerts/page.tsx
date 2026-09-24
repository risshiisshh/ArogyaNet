"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import rawPhcs from "@/data/phcs.json";
import { computeAlerts, PHC, Alert } from "@/lib/domain";
import {
  AlertTriangle,
  ArrowRight,
  Bed,
  CheckCircle2,
  Copy,
  Download,
  Filter,
  Hospital,
  Pill,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

export default function AlertsPage() {
  const phcs = useMemo(() => rawPhcs as PHC[], []);
  const allAlerts = useMemo(() => computeAlerts(phcs), [phcs]);

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      if (categoryFilter !== "all" && alert.category !== categoryFilter) return false;
      if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !alert.title.toLowerCase().includes(q) &&
          !alert.description.toLowerCase().includes(q) &&
          !alert.phc_name.toLowerCase().includes(q) &&
          !alert.district.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [allAlerts, categoryFilter, severityFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: allAlerts.length,
      critical: allAlerts.filter((a) => a.severity === "critical").length,
      high: allAlerts.filter((a) => a.severity === "high").length,
      stock: allAlerts.filter((a) => a.category === "stock").length,
      bed: allAlerts.filter((a) => a.category === "bed").length,
      staff: allAlerts.filter((a) => a.category === "staff").length,
    };
  }, [allAlerts]);

  const handleCopyBriefing = () => {
    const text = `AROGYANET OPERATIONAL ALERT BRIEFING (${new Date().toLocaleDateString()})
Total Alerts: ${stats.total} (${stats.critical} Critical, ${stats.high} High)
Stock Alerts: ${stats.stock}
Bed Saturation Alerts: ${stats.bed}
Staffing Alerts: ${stats.staff}

Top Critical Incidents:
${allAlerts
  .filter((a) => a.severity === "critical")
  .map((a, i) => `${i + 1}. [${a.phc_name}] ${a.title}: ${a.description}`)
  .join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626875]">
              Surveillance Dispatch
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FDE8E8] text-[#D93838]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D93838] animate-pulse" />
              {stats.critical} Critical Incidents Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111318] tracking-tight">
            Early Warnings &amp; Facility Alerts
          </h1>
          <p className="text-sm text-[#626875] max-w-3xl">
            Prioritized operational notifications generated from deterministic facility stock forecasts and inpatient bed telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyBriefing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#111318] text-xs font-bold border border-[#E7E9EE] hover:bg-[#F8F8FA] transition-colors shadow-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Briefing Copied!" : "Copy Executive Brief"}</span>
          </button>

          <Link
            href="/redistributions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F8F88]" />
            <span>Resolve via Transfers</span>
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          onClick={() => {
            setSeverityFilter("all");
            setCategoryFilter("all");
          }}
          className="bg-white rounded-2xl p-5 border border-[#E7E9EE] shadow-sm cursor-pointer hover:border-[#111318] transition-colors"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#8D93A1] mb-1">
            Total Alerts
          </div>
          <div className="text-3xl font-extrabold text-[#111318]">{stats.total}</div>
          <div className="text-[11px] text-[#626875] mt-1">Network Wide</div>
        </div>

        <div
          onClick={() => setSeverityFilter("critical")}
          className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition-colors ${
            severityFilter === "critical"
              ? "border-[#D93838] ring-2 ring-[#D93838]/20 bg-[#FDE8E8]/30"
              : "border-[#E7E9EE] hover:border-[#D93838]"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#D93838] mb-1">
            Critical Severity
          </div>
          <div className="text-3xl font-extrabold text-[#D93838]">{stats.critical}</div>
          <div className="text-[11px] text-[#D93838] mt-1 font-semibold">Immediate Hazard</div>
        </div>

        <div
          onClick={() => setCategoryFilter("stock")}
          className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition-colors ${
            categoryFilter === "stock"
              ? "border-[#0F8F88] ring-2 ring-[#0F8F88]/20 bg-[#E7F7F5]/30"
              : "border-[#E7E9EE] hover:border-[#0F8F88]"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#0F8F88] mb-1">
            Medicine Stock
          </div>
          <div className="text-3xl font-extrabold text-[#111318]">{stats.stock}</div>
          <div className="text-[11px] text-[#626875] mt-1">Supply Shortages</div>
        </div>

        <div
          onClick={() => setCategoryFilter("bed")}
          className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition-colors ${
            categoryFilter === "bed"
              ? "border-[#E0A000] ring-2 ring-[#E0A000]/20 bg-[#FFF4D6]/30"
              : "border-[#E7E9EE] hover:border-[#E0A000]"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#E0A000] mb-1">
            Bed Capacity
          </div>
          <div className="text-3xl font-extrabold text-[#111318]">{stats.bed}</div>
          <div className="text-[11px] text-[#626875] mt-1">&gt; 75% Inpatient Use</div>
        </div>

        <div
          onClick={() => setCategoryFilter("staff")}
          className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition-colors ${
            categoryFilter === "staff"
              ? "border-[#8974DC] ring-2 ring-[#8974DC]/20 bg-[#EEE8FF]/30"
              : "border-[#E7E9EE] hover:border-[#8974DC]"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#8974DC] mb-1">
            Staff Roster
          </div>
          <div className="text-3xl font-extrabold text-[#111318]">{stats.staff}</div>
          <div className="text-[11px] text-[#626875] mt-1">&lt; 70% Attendance</div>
        </div>
      </div>

      {/* Main Alert List Grid (8 cols) + Telemetry / AI Briefing (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Filterable Alert Feed */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E7E9EE]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: "all", label: "All Categories" },
                { id: "stock", label: "Stock Out", icon: Pill },
                { id: "bed", label: "Bed Capacity", icon: Bed },
                { id: "staff", label: "Staff Roster", icon: Users },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      categoryFilter === tab.id
                        ? "bg-[#111318] text-white shadow-sm"
                        : "bg-[#F8F8FA] text-[#626875] hover:bg-[#EDEEF0] border border-[#E7E9EE]"
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#8D93A1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F8FA] border border-[#E7E9EE] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-[#111318]"
              />
            </div>
          </div>

          {/* List of Alerts */}
          <div className="space-y-3 pt-2">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-[#8D93A1]">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#248A54]" />
                <p className="font-bold text-sm text-[#111318]">No alerts match your filter</p>
                <p className="text-xs">All monitored conditions in this slice are within normal parameters.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isAck = acknowledged[alert.id];
                const isCrit = alert.severity === "critical";

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isAck
                        ? "opacity-60 bg-[#F8F8FA] border-[#E7E9EE]"
                        : isCrit
                        ? "bg-[#FDE8E8]/30 border-[#D93838]/40 hover:border-[#D93838]"
                        : "bg-white border-[#E7E9EE] hover:border-[#E0A000]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isCrit
                            ? "bg-[#FDE8E8] text-[#D93838]"
                            : alert.category === "bed"
                            ? "bg-[#FFF4D6] text-[#E0A000]"
                            : "bg-[#EEE8FF] text-[#8974DC]"
                        }`}
                      >
                        {alert.category === "stock" && <Pill className="w-4 h-4" />}
                        {alert.category === "bed" && <Bed className="w-4 h-4" />}
                        {alert.category === "staff" && <Users className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-[#111318]">{alert.phc_name}</span>
                          <span className="text-[10px] text-[#626875] bg-[#F8F8FA] px-2 py-0.5 rounded border border-[#E7E9EE]">
                            {alert.district} District
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                              isCrit
                                ? "bg-[#FDE8E8] text-[#D93838]"
                                : "bg-[#FFF4D6] text-[#E0A000]"
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-sm text-[#111318]">{alert.title}</h3>
                        <p className="text-xs text-[#626875] leading-relaxed max-w-2xl">
                          {alert.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        href={`/phc/${alert.phc_id}`}
                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#F8F8FA] text-[#111318] border border-[#E7E9EE] hover:bg-[#EDEEF0] transition-colors"
                      >
                        Inspect
                      </Link>

                      {alert.category === "stock" && (
                        <Link
                          href="/redistributions"
                          className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#111318] text-white hover:bg-[#252830] transition-colors"
                        >
                          Transfer
                        </Link>
                      )}

                      <button
                        onClick={() =>
                          setAcknowledged((prev) => ({
                            ...prev,
                            [alert.id]: !prev[alert.id],
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                          isAck
                            ? "bg-[#248A54] text-white"
                            : "bg-white text-[#626875] border border-[#E7E9EE] hover:bg-[#F8F8FA]"
                        }`}
                      >
                        {isAck ? "Acknowledged ✓" : "Ack"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 4 Cols: AI Executive Briefing + Telemetry Diagnostics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Executive AI Briefing Card */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E7F7F5] text-[#0F8F88] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#111318]">
                  Operational Briefing
                </h3>
                <p className="text-[11px] text-[#626875]">Synthesized via Gemini AI</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] text-xs text-[#111318] leading-relaxed space-y-2">
              <p>
                <strong>Immediate Priority:</strong> Rampur PHC and Sitapur PHC have reached critical deficit levels in ORS and Amoxicillin. Both facilities will exhaust current reserve stock within 48 to 60 hours at observed patient consultation rates.
              </p>
              <p>
                <strong>Inpatient Saturation:</strong> Rampur PHC bed occupancy is currently at 95% (19/20 beds). Secondary patient diversions to Maholi PHC should be pre-authorized to avert complete refusal of acute admissions.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/redistributions"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#0F8F88] text-white text-xs font-bold hover:bg-[#0c746e] transition-colors shadow-sm"
              >
                <span>Authorize Stock Transfers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Telemetry Status Diagnostics */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-[#111318]">Network Telemetry Health</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
                <span className="text-[#626875]">Monitored Facilities</span>
                <span className="font-bold text-[#111318]">18 / 18 Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
                <span className="text-[#626875]">Data Verification</span>
                <span className="font-bold text-[#248A54]">Deterministic Math</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
                <span className="text-[#626875]">Telemetry Refresh Cycle</span>
                <span className="font-bold text-[#111318]">Every 60 minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE]">
                <span className="text-[#626875]">Sensor Latency</span>
                <span className="font-bold text-[#0F8F88]">&lt; 1.2s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
