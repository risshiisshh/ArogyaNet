"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import rawPhcs from "@/data/phcs.json";
import { computeAlerts, PHC } from "@/lib/domain";

export default function AlertsPage() {
  const phcs = useMemo(() => rawPhcs as PHC[], []);
  const computedAlerts = useMemo(() => computeAlerts(phcs), [phcs]);

  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("urgency");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial mock alerts combined with computed alerts
  const staticAlerts = useMemo(() => [
    {
      id: "alert-1",
      severity: "critical",
      type: "Critical Stockout",
      phcName: "Rampur PHC",
      phcId: "PHC001",
      district: "Sitapur",
      category: "Medicine stock",
      title: "ORS Sachets at Rampur PHC will run out in 2.5 days.",
      description: "20 units remain in local formulary; average daily usage velocity is 8 units/day.",
      timeAgo: "12m ago",
      actionText: "View transfer option",
      actionHref: "/redistributions",
      secondaryText: "Nearest donor: Biswan (14km)",
      secondaryHref: "/redistributions",
      icon: "error"
    },
    {
      id: "alert-2",
      severity: "critical",
      type: "Formulary Alert",
      phcName: "Rampur PHC",
      phcId: "PHC001",
      district: "Sitapur",
      category: "Formulary threshold",
      title: "Amoxicillin at Rampur PHC is below its reorder level.",
      description: "40 units remain against a mandated safety reorder level of 50 units.",
      timeAgo: "34m ago",
      actionText: "Review restock order",
      actionHref: "/phc/PHC001",
      secondaryText: "PO #IN-904 ready for sign-off",
      icon: "warning"
    },
    {
      id: "alert-3",
      severity: "attention",
      type: "Capacity Threshold",
      phcName: "Rampur PHC",
      phcId: "PHC001",
      district: "Sitapur",
      category: "Inpatient capacity",
      title: "Bed occupancy at Rampur PHC has reached 90%.",
      description: "Only 2 of 20 beds are currently available. Acute seasonal ward under strain.",
      timeAgo: "1h ago",
      actionText: "View facility status",
      actionHref: "/phc/PHC001",
      secondaryText: "Biswan PHC has 12 vacant beds",
      icon: "hotel"
    },
    {
      id: "alert-4",
      severity: "attention",
      type: "Predictive Burn Rate",
      phcName: "Biswan PHC",
      phcId: "PHC002",
      district: "Sitapur",
      category: "Burn rate forecast",
      title: "Biswan PHC may reach its insulin reorder level within 3 days.",
      description: "Current patient load trajectory predicts stock hitting buffer threshold by Friday afternoon.",
      timeAgo: "2h ago",
      actionText: "Check reorder schedule",
      actionHref: "/phc/PHC002",
      icon: "medication"
    },
    {
      id: "alert-5",
      severity: "attention",
      type: "Staffing Telemetry",
      phcName: "Rampur PHC",
      phcId: "PHC001",
      district: "Sitapur",
      category: "Staffing telemetry",
      title: "Staff attendance at Rampur PHC is lower than usual today.",
      description: "4 of 6 scheduled clinical staff are logged into biometric attendance terminal.",
      timeAgo: "3h ago",
      actionText: "View roster status",
      actionHref: "/phc/PHC001",
      icon: "badge"
    },
    {
      id: "alert-6",
      severity: "resolved",
      type: "Resolved",
      phcName: "Khairabad PHC",
      phcId: "PHC003",
      district: "Sitapur",
      category: "Replenishment verified",
      title: "ORS stock level restored at Khairabad PHC.",
      description: "Transfer of 150 units completed from Sitapur Central Warehouse. Safety margin extended to 18 days.",
      timeAgo: "4h ago",
      actionText: "View log entry",
      actionHref: "/phc/PHC003",
      icon: "check_circle"
    },
    {
      id: "alert-7",
      severity: "resolved",
      type: "Resolved",
      phcName: "Hargaon PHC",
      phcId: "PHC005",
      district: "Sitapur",
      category: "Restocked",
      title: "Paracetamol supply stabilized at Hargaon PHC.",
      description: "Buffer inventory of 600 strips verified by automated storekeeper barcode telemetry sync.",
      timeAgo: "Yesterday",
      actionText: "Audit history",
      actionHref: "/phc/PHC005",
      icon: "check_circle"
    }
  ], []);

  const alerts = staticAlerts;

  const counts = useMemo(() => {
    return {
      all: alerts.length,
      critical: alerts.filter(a => a.severity === "critical").length,
      attention: alerts.filter(a => a.severity === "attention").length,
      resolved: alerts.filter(a => a.severity === "resolved").length,
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(item => {
      const matchesFilter = currentFilter === "all" || item.severity === currentFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.phcName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesDistrict = districtFilter === "all" || item.phcName.toLowerCase().includes(districtFilter.toLowerCase());

      return matchesFilter && matchesSearch && matchesDistrict;
    });
  }, [alerts, currentFilter, searchTerm, districtFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col w-full gap-space-lg">
        {/* Page Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-critical animate-pulse"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                Live Telemetry Analysis
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              Early Warnings
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Prioritized signals from current PHC stock, bed, and staffing data.
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              onClick={handleRefresh}
              className="group inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-card-surface hover:bg-surface-muted text-text-primary font-label-md text-label-md shadow-[0_4px_14px_rgba(17,19,24,0.04)] transition-all duration-200"
              type="button"
            >
              <span
                className={`material-symbols-outlined text-base text-text-secondary transition-transform duration-500 ${
                  isRefreshing ? "rotate-180" : "group-hover:rotate-180"
                }`}
              >
                sync
              </span>
              <span>Refresh analysis</span>
            </button>
            <button
              onClick={() => {
                const data = JSON.stringify(alerts, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "arogyanet-alerts-log.json";
                a.click();
              }}
              className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-full bg-card-surface hover:bg-surface-muted text-text-secondary hover:text-text-primary font-label-md text-label-md shadow-[0_4px_14px_rgba(17,19,24,0.04)] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Log</span>
            </button>
          </div>
        </section>

        {/* AI Summary Strip */}
        <div className="w-full bg-teal-tint rounded-lg p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm shadow-[0_4px_20px_rgba(15,143,136,0.06)]">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-card-surface flex items-center justify-center text-teal-accent shrink-0 shadow-sm">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <p className="font-label-md text-label-md text-teal-accent">
              <span className="font-headline-sm text-teal-accent font-bold">AI Analysis:</span>{" "}
              {counts.critical} critical risks require immediate intervention today across Sitapur district.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card-surface/70 self-end sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-teal-accent animate-ping"></span>
            <span className="font-label-sm text-label-sm text-teal-accent font-medium">
              Last analysed 10:25 IST
            </span>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md w-full">
          {/* Left: Search & Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm flex-1">
            {/* Search Input */}
            <div className="relative min-w-[240px] max-w-sm flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none">
                search
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-full bg-card-surface text-text-primary placeholder:text-text-muted font-body-md text-body-md shadow-[0_2px_8px_rgba(17,19,24,0.03)] focus:outline-none focus:ring-2 focus:ring-teal-accent transition-all"
                placeholder="Search alerts by PHC, drug, or metric..."
                type="text"
              />
            </div>
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <button
                onClick={() => setCurrentFilter("all")}
                className={`filter-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 shrink-0 ${
                  currentFilter === "all"
                    ? "bg-text-primary text-on-primary shadow-[0_4px_14px_rgba(17,19,24,0.08)]"
                    : "bg-card-surface text-text-secondary hover:text-text-primary shadow-[0_2px_8px_rgba(17,19,24,0.03)]"
                }`}
                type="button"
              >
                <span>All</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    currentFilter === "all" ? "bg-white/20" : "bg-surface-muted"
                  }`}
                >
                  {counts.all}
                </span>
              </button>
              <button
                onClick={() => setCurrentFilter("critical")}
                className={`filter-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 shrink-0 ${
                  currentFilter === "critical"
                    ? "bg-text-primary text-on-primary shadow-[0_4px_14px_rgba(17,19,24,0.08)]"
                    : "bg-card-surface text-text-secondary hover:text-text-primary shadow-[0_2px_8px_rgba(17,19,24,0.03)]"
                }`}
                type="button"
              >
                <span className="w-2 h-2 rounded-full bg-red-critical"></span>
                <span>Critical</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-tint text-red-critical font-bold">
                  {counts.critical}
                </span>
              </button>
              <button
                onClick={() => setCurrentFilter("attention")}
                className={`filter-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 shrink-0 ${
                  currentFilter === "attention"
                    ? "bg-text-primary text-on-primary shadow-[0_4px_14px_rgba(17,19,24,0.08)]"
                    : "bg-card-surface text-text-secondary hover:text-text-primary shadow-[0_2px_8px_rgba(17,19,24,0.03)]"
                }`}
                type="button"
              >
                <span className="w-2 h-2 rounded-full bg-amber-accent"></span>
                <span>Attention</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-tint text-text-primary font-bold">
                  {counts.attention}
                </span>
              </button>
              <button
                onClick={() => setCurrentFilter("resolved")}
                className={`filter-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 shrink-0 ${
                  currentFilter === "resolved"
                    ? "bg-text-primary text-on-primary shadow-[0_4px_14px_rgba(17,19,24,0.08)]"
                    : "bg-card-surface text-text-secondary hover:text-text-primary shadow-[0_2px_8px_rgba(17,19,24,0.03)]"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-green-healthy text-sm">
                  check_circle
                </span>
                <span>Resolved</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-tint text-green-healthy font-bold">
                  {counts.resolved}
                </span>
              </button>
            </div>
          </div>

          {/* Right: Dropdown Controls */}
          <div className="flex items-center gap-space-sm shrink-0 self-end lg:self-auto">
            <div className="relative">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                aria-label="Filter by district"
                className="appearance-none h-11 pl-4 pr-9 rounded-full bg-card-surface text-text-primary font-label-md text-label-md shadow-[0_2px_8px_rgba(17,19,24,0.03)] focus:outline-none focus:ring-2 focus:ring-teal-accent cursor-pointer"
              >
                <option value="all">All facilities (Sitapur)</option>
                <option value="rampur">Rampur Block</option>
                <option value="biswan">Biswan Block</option>
                <option value="khairabad">Khairabad Block</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-base">
                expand_more
              </span>
            </div>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort alerts"
                className="appearance-none h-11 pl-4 pr-9 rounded-full bg-card-surface text-text-primary font-label-md text-label-md shadow-[0_2px_8px_rgba(17,19,24,0.03)] focus:outline-none focus:ring-2 focus:ring-teal-accent cursor-pointer"
              >
                <option value="urgency">Urgency: highest first</option>
                <option value="newest">Newest first</option>
                <option value="facility">By Facility</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-base">
                swap_vert
              </span>
            </div>
          </div>
        </section>

        {/* Main 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start w-full">
          {/* Left Column: Alerts Feed (~70%) */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="bg-card-surface rounded-lg p-space-md sm:p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col gap-space-sm">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-text-primary">
                    Prioritized Signals
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted">
                    (Showing {filteredAlerts.length} signals)
                  </span>
                </div>
                <button
                  className="text-text-secondary hover:text-text-primary text-xs font-label-sm inline-flex items-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  <span>Customize thresholds</span>
                </button>
              </div>

              {/* Alert Feed Stack */}
              <div className="flex flex-col gap-3">
                {filteredAlerts.length === 0 ? (
                  <div className="p-8 text-center text-text-muted">
                    <p className="font-body-md">No alerts found matching your criteria.</p>
                  </div>
                ) : (
                  filteredAlerts.map((item) => (
                    <article
                      key={item.id}
                      className={`alert-item group rounded-xl p-space-md transition-all duration-150 flex items-start gap-space-md ${
                        item.severity === "resolved"
                          ? "bg-surface-muted/30 hover:bg-surface-muted/50 opacity-75 hover:opacity-100"
                          : "bg-surface-muted/60 hover:bg-surface-muted"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                          item.severity === "critical"
                            ? "bg-red-tint text-red-critical"
                            : item.severity === "attention"
                            ? "bg-amber-tint text-amber-accent"
                            : "bg-green-tint text-green-healthy"
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wide font-semibold ${
                              item.severity === "critical"
                                ? "bg-red-tint text-red-critical"
                                : item.severity === "attention"
                                ? "bg-amber-tint text-text-primary"
                                : "bg-green-tint text-green-healthy"
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-text-muted text-body-sm">·</span>
                          <span className="font-body-sm text-body-sm text-text-muted">
                            {item.phcName} · {item.district} · {item.category}
                          </span>
                        </div>
                        <h2
                          className={`font-headline-sm text-headline-sm tracking-tight ${
                            item.severity === "resolved"
                              ? "text-text-secondary"
                              : "text-text-primary"
                          }`}
                        >
                          {item.title}
                        </h2>
                        <p
                          className={`font-body-md text-body-md ${
                            item.severity === "resolved"
                              ? "text-text-muted"
                              : "text-text-secondary"
                          }`}
                        >
                          {item.description}
                        </p>
                        <div className="pt-2 flex items-center gap-space-md flex-wrap">
                          {item.severity === "critical" && item.actionHref === "/redistributions" ? (
                            <Link
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-text-primary text-on-primary hover:bg-action-hover font-label-md text-label-md transition-all shadow-sm"
                              href={item.actionHref}
                            >
                              <span>{item.actionText}</span>
                              <span className="material-symbols-outlined text-sm">
                                arrow_forward
                              </span>
                            </Link>
                          ) : item.severity === "critical" ? (
                            <Link
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-accent hover:bg-secondary text-white font-label-md text-label-md transition-all shadow-sm"
                              href={item.actionHref}
                            >
                              <span>{item.actionText}</span>
                              <span className="material-symbols-outlined text-sm">
                                arrow_forward
                              </span>
                            </Link>
                          ) : (
                            <Link
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-card-surface hover:bg-workspace-surface text-text-primary font-label-md text-label-md shadow-sm transition-all"
                              href={item.actionHref}
                            >
                              <span>{item.actionText}</span>
                              <span className="material-symbols-outlined text-sm">
                                {item.actionHref.includes("/phc/") ? "open_in_new" : "schedule"}
                              </span>
                            </Link>
                          )}
                          {item.secondaryText && (
                            <span className="font-label-sm text-label-sm text-teal-accent inline-flex items-center gap-1">
                              {item.actionHref === "/redistributions" && (
                                <span className="material-symbols-outlined text-sm">
                                  local_shipping
                                </span>
                              )}
                              <span>{item.secondaryText}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0 pl-2">
                        <span className="font-body-sm text-body-sm text-text-muted">
                          {item.timeAgo}
                        </span>
                        <Link
                          href={`/phc/${item.phcId}`}
                          aria-label="Alert details"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted group-hover:text-text-primary group-hover:bg-card-surface transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">
                            chevron_right
                          </span>
                        </Link>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Context & Rules (~30%) */}
          <div className="lg:col-span-4 flex flex-col gap-space-md sticky top-6">
            {/* Card 1: How alerts work */}
            <section className="bg-card-surface rounded-lg p-space-md sm:p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm pb-1">
                <div className="w-9 h-9 rounded-full bg-blue-tint text-blue-info flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    info
                  </span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">
                    How alerts work
                  </h2>
                  <span className="font-body-sm text-body-sm text-text-muted">
                    Telemetry trigger logic
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                ArogyaNet continuously evaluates clinical telemetry and inventory syncs across 3 core threshold rules:
              </p>
              {/* Rule items */}
              <div className="flex flex-col gap-2.5">
                <div className="p-3 rounded-xl bg-surface-muted/70 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-critical"></span>
                    <span className="font-label-md text-label-md text-text-primary">
                      Stock at or below reorder level
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary pl-3.5">
                    Triggers immediate reorder review or local redistribution alert across nearby PHCs.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-surface-muted/70 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-accent"></span>
                    <span className="font-label-md text-label-md text-text-primary">
                      Forecast stockout within 3 days
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary pl-3.5">
                    Uses dynamic daily burn velocity to predict zero-stock events before buffer depletion.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-surface-muted/70 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-accent"></span>
                    <span className="font-label-md text-label-md text-text-primary">
                      Bed occupancy over 90%
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary pl-3.5">
                    Flags triage saturation risks and prompts inter-facility admission load sharing.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/assistant"
                  className="w-full h-11 px-4 rounded-full bg-teal-tint hover:bg-teal-tint/80 text-teal-accent font-label-md text-label-md flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  <span>Ask Assistant about alerts</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <button
                  type="button"
                  className="text-center font-label-sm text-label-sm text-text-secondary hover:text-text-primary transition-colors py-1 cursor-pointer"
                >
                  Configure alert rules &amp; threshold limits
                </button>
              </div>
            </section>

            {/* Card 2: District Health Notice / Telemetry Status */}
            <section className="bg-card-surface rounded-lg p-space-md sm:p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-text-primary">
                  Sitapur Telemetry Status
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-green-tint text-green-healthy font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-healthy"></span>
                  Live
                </span>
              </div>
              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="bg-surface-muted/60 p-3 rounded-xl flex flex-col gap-0.5">
                  <span className="font-body-sm text-body-sm text-text-muted">PHCs Reporting</span>
                  <span className="font-headline-md text-headline-md text-text-primary">
                    18 / 18
                  </span>
                  <span className="font-label-sm text-label-sm text-green-healthy">
                    100% active grid
                  </span>
                </div>
                <div className="bg-surface-muted/60 p-3 rounded-xl flex flex-col gap-0.5">
                  <span className="font-body-sm text-body-sm text-text-muted">Data Integrity</span>
                  <span className="font-headline-md text-headline-md text-text-primary">
                    100%
                  </span>
                  <span className="font-label-sm text-label-sm text-teal-accent">
                    Verified hash
                  </span>
                </div>
              </div>
              {/* Mini Sparkline Indicator (Inline SVG) */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-text-secondary">Network Packet Latency</span>
                  <span className="font-label-sm text-text-primary font-medium">42ms avg</span>
                </div>
                <div className="h-9 w-full bg-surface-muted/40 rounded-lg p-1 flex items-end">
                  <svg
                    className="w-full h-7 text-teal-accent"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 200 30"
                  >
                    <path
                      d="M0 22 Q 25 10, 50 18 T 100 8 T 150 14 T 200 12"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M0 22 Q 25 10, 50 18 T 100 8 T 150 14 T 200 12 L 200 30 L 0 30 Z"
                      fill="currentColor"
                      fillOpacity="0.1"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-text-muted font-body-sm text-body-sm">
                <span>Last full sync</span>
                <span className="font-medium text-text-primary">10:25 IST (Today)</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
