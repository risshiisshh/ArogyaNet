import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNetworkData } from "@/context/NetworkDataContext";

export default function PHCDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "PHC001";
  const { enrichedPHCs } = useNetworkData();

  const phc =
    enrichedPHCs.find(
      (p) =>
        p.phc_id.toLowerCase() === id.toLowerCase() ||
        p.phc_name.toLowerCase().includes(id.toLowerCase())
    ) || enrichedPHCs[0];

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col w-full">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
          <div className="flex flex-col gap-space-xs">
            <Link
              to="/phc"
              className="inline-flex items-center gap-1.5 font-label-md text-label-md text-text-secondary hover:text-text-primary transition-colors group mb-1"
            >
              <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              All PHCs
            </Link>
            <div className="flex flex-wrap items-center gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
                {phc.phc_name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm uppercase font-bold ${
                  phc.status === "critical"
                    ? "bg-red-tint text-red-critical"
                    : phc.status === "low"
                    ? "bg-amber-tint text-amber-accent"
                    : "bg-green-tint text-green-healthy"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    phc.status === "critical"
                      ? "bg-red-critical animate-pulse"
                      : phc.status === "low"
                      ? "bg-amber-accent"
                      : "bg-green-healthy"
                  }`}
                ></span>
                {phc.status}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary">
              {phc.phc_id} <span className="text-text-muted">·</span> {phc.district} District{" "}
              <span className="text-text-muted">·</span> Block: {phc.block}
            </p>
          </div>
          {/* Action Buttons Cluster */}
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-card-surface text-text-primary font-label-md text-label-md shadow-[0_4px_14px_rgba(17,19,24,0.04)] hover:bg-surface-muted transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export summary
            </button>
            <Link
              to="/redistributions"
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-text-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-action-hover transition-all"
            >
              View transfer
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Critical AI Operational Callout Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-red-tint p-space-md sm:p-space-lg mb-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start md:items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-card-surface flex items-center justify-center shrink-0 shadow-sm text-red-critical">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-red-critical">
                  Action needed today
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-red-critical"></span>
                <span className="font-body-sm text-body-sm text-text-secondary">
                  Stockout forecast
                </span>
              </div>
              <p className="font-body-md text-body-md text-text-primary font-medium">
                ORS Sachets are expected to run out in{" "}
                <span className="font-bold text-red-critical">2.5 days</span>. Maholi PHC has
                suitable surplus (+120 units available).
              </p>
            </div>
          </div>
          <Link
            to="/redistributions"
            className="inline-flex items-center justify-center gap-1.5 px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-action-hover whitespace-nowrap self-start md:self-auto shrink-0 shadow-sm transition-all"
          >
            Review transfer
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* KPI Metrics Row (3 Elevated Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-lg">
          {/* Card 1: Bed Occupancy */}
          <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-text-muted">Bed occupancy</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                  90%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-space-md">
                <span className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
                  18{" "}
                  <span className="text-text-muted font-normal text-headline-sm">/ 20</span>
                </span>
              </div>
            </div>
            <div>
              <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden mb-space-xs">
                <div className="h-full bg-red-critical rounded-full" style={{ width: "90%" }}></div>
              </div>
              <div className="flex items-center justify-between text-text-secondary font-body-sm text-body-sm">
                <span>2 beds available</span>
                <span className="text-red-critical font-medium">Near peak capacity</span>
              </div>
            </div>
          </div>

          {/* Card 2: Staff Present */}
          <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-text-muted">Staff present</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-tint text-text-primary font-label-sm text-label-sm">
                  67%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-space-md">
                <span className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
                  4{" "}
                  <span className="text-text-muted font-normal text-headline-sm">/ 6</span>
                </span>
              </div>
            </div>
            <div>
              <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden mb-space-xs">
                <div
                  className="h-full bg-amber-accent rounded-full"
                  style={{ width: "67%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-text-secondary font-body-sm text-body-sm">
                <span>2 medical staff on leave</span>
                <span className="text-text-secondary">Rostered relief requested</span>
              </div>
            </div>
          </div>

          {/* Card 3: Items at Risk */}
          <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-text-muted">Items at risk</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-critical"></span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-headline-lg text-headline-lg text-red-critical tracking-tight">
                  2
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">
                  below safe threshold
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary mb-space-sm">
                Critical burn trajectory detected
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-sm">warning</span>
                ORS Sachets (2.5d)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-sm">warning</span>
                Amoxicillin (2.7d)
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Two Columns: 65% / 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* LEFT COLUMN: Inventory Table & Forecast Chart (~65% width: 8 of 12 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            {/* 1. Medicine Inventory Section */}
            <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-tint text-blue-info flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">medication</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight">
                      Medicine Inventory
                    </h2>
                    <span className="font-body-sm text-body-sm text-text-muted">
                      District formulary tier 1 telemetry
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm">
                    {phc.enriched_inventory.length} Tracked Items
                  </span>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-text-muted font-label-sm text-label-sm">
                      <th className="pb-3 pr-4 font-semibold">Medicine Name</th>
                      <th className="pb-3 px-3 font-semibold text-right">Current Stock</th>
                      <th className="pb-3 px-3 font-semibold text-right">Daily Burn</th>
                      <th className="pb-3 px-3 font-semibold text-right">Reorder Level</th>
                      <th className="pb-3 px-3 font-semibold text-right">Coverage</th>
                      <th className="pb-3 pl-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0 text-text-primary font-body-md text-body-md">
                    {phc.enriched_inventory.map((item, idx) => {
                      const isCritical = item.item_status === "critical";
                      const isLow = item.item_status === "low";
                      return (
                        <tr
                          key={idx}
                          className={`rounded-xl transition-colors ${
                            isCritical
                              ? "bg-red-tint"
                              : isLow
                              ? "bg-amber-tint/40"
                              : "hover:bg-workspace-surface"
                          }`}
                        >
                          <td className="py-3 px-3 font-medium rounded-l-xl flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isCritical
                                  ? "bg-red-critical"
                                  : isLow
                                  ? "bg-amber-accent"
                                  : "bg-green-healthy"
                              }`}
                            ></span>
                            {item.medicine_name}
                          </td>
                          <td className="py-3 px-3 text-right font-medium">{item.quantity} units</td>
                          <td className="py-3 px-3 text-right text-text-secondary">
                            {item.daily_consumption_rate} / day
                          </td>
                          <td className="py-3 px-3 text-right text-text-secondary">
                            {item.reorder_threshold} units
                          </td>
                          <td
                            className={`py-3 px-3 text-right font-semibold ${
                              isCritical
                                ? "text-red-critical"
                                : isLow
                                ? "text-amber-accent"
                                : "text-text-primary"
                            }`}
                          >
                            {item.coverage_label}
                          </td>
                          <td className="py-3 pr-3 text-right rounded-r-xl">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm ${
                                isCritical
                                  ? "bg-card-surface text-red-critical"
                                  : isLow
                                  ? "bg-card-surface text-amber-900"
                                  : "bg-green-tint text-green-healthy"
                              }`}
                            >
                              {item.item_status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. ORS Forecast & Burn Trajectory Card */}
            <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-full bg-red-tint text-red-critical flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">trending_down</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight">
                      ORS Forecast &amp; Burn Trajectory
                    </h2>
                    <span className="font-body-sm text-body-sm text-text-secondary">
                      4-day projection based on current 8-unit daily burn
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-tint text-red-critical font-label-sm text-label-sm self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-critical"></span>
                  Predicted stockout in ~60 hours
                </span>
              </div>

              {/* SVG Burn Trajectory Chart */}
              <div className="w-full overflow-hidden">
                <svg
                  className="w-full h-auto select-none"
                  fill="none"
                  viewBox="0 0 740 260"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="dangerGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#E05252" stopOpacity="0.18"></stop>
                      <stop offset="100%" stopColor="#E05252" stopOpacity="0.01"></stop>
                    </linearGradient>
                  </defs>
                  {/* Background Grid Lines */}
                  <line stroke="#F3F4F6" strokeWidth="1" x1="60" x2="710" y1="40" y2="40"></line>
                  <line stroke="#F3F4F6" strokeWidth="1" x1="60" x2="710" y1="100" y2="100"></line>
                  <line stroke="#F3F4F6" strokeWidth="1" x1="60" x2="710" y1="160" y2="160"></line>
                  <line stroke="#E7E9EE" strokeWidth="1" x1="60" x2="710" y1="210" y2="210"></line>
                  {/* Y Axis Labels */}
                  <text fill="#8D93A1" fontFamily="Manrope" fontSize="11" textAnchor="end" x="50" y="44">
                    35 u
                  </text>
                  <text
                    fill="#A07A08"
                    fontFamily="Manrope"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="end"
                    x="50"
                    y="66"
                  >
                    30 u
                  </text>
                  <text fill="#8D93A1" fontFamily="Manrope" fontSize="11" textAnchor="end" x="50" y="104">
                    20 u
                  </text>
                  <text fill="#8D93A1" fontFamily="Manrope" fontSize="11" textAnchor="end" x="50" y="164">
                    10 u
                  </text>
                  <text fill="#8D93A1" fontFamily="Manrope" fontSize="11" textAnchor="end" x="50" y="214">
                    0 u
                  </text>
                  {/* Reorder Threshold Dashed Line (30 units = y:62) */}
                  <line
                    stroke="#F2C94C"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                    x1="60"
                    x2="710"
                    y1="62"
                    y2="62"
                  ></line>
                  <rect fill="#FFF2BF" height="20" rx="10" width="128" x="580" y="48"></rect>
                  <text
                    fill="#A07A08"
                    fontFamily="Manrope"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    x="644"
                    y="62"
                  >
                    Reorder level (30 units)
                  </text>
                  {/* Danger Zone Shading below threshold to zero */}
                  <polygon fill="url(#dangerGradient)" points="60,100 465,210 60,210"></polygon>
                  {/* Trajectory Projection Line */}
                  <line
                    stroke="#E05252"
                    strokeLinecap="round"
                    strokeWidth="3"
                    x1="60"
                    x2="465"
                    y1="100"
                    y2="210"
                  ></line>
                  {/* Theoretical continued line into negative/deficit */}
                  <line
                    opacity="0.4"
                    stroke="#E05252"
                    strokeDasharray="3 3"
                    strokeWidth="2"
                    x1="465"
                    x2="680"
                    y1="210"
                    y2="245"
                  ></line>
                  {/* Starting Point Dot (Today: 20 units) */}
                  <circle cx="60" cy="100" fill="#E05252" r="5"></circle>
                  <circle cx="60" cy="100" fill="#FFFFFF" r="2"></circle>
                  {/* Stockout Point (Day 2.5) */}
                  <circle cx="465" cy="210" fill="#E05252" r="6"></circle>
                  <circle cx="465" cy="210" fill="#FFFFFF" r="3"></circle>
                  {/* Pin Callout at Day 2.5 */}
                  <g transform="translate(465, 140)">
                    <line
                      stroke="#E05252"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                      x1="0"
                      x2="0"
                      y1="22"
                      y2="62"
                    ></line>
                    <rect
                      fill="#111318"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                      height="34"
                      rx="17"
                      width="140"
                      x="-70"
                      y="-12"
                    ></rect>
                    <text
                      fill="#FFFFFF"
                      fontFamily="Manrope"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                      x="0"
                      y="4"
                    >
                      Predicted Stockout
                    </text>
                    <text
                      fill="#E7F7EF"
                      fontFamily="Manrope"
                      fontSize="9.5"
                      textAnchor="middle"
                      x="0"
                      y="16"
                    >
                      Day 2.5 · 0 units left
                    </text>
                  </g>
                  {/* X Axis Points & Labels */}
                  <text
                    fill="#111318"
                    fontFamily="Manrope"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    x="60"
                    y="232"
                  >
                    Today
                  </text>
                  <line stroke="#8D93A1" strokeWidth="1" x1="222" x2="222" y1="208" y2="214"></line>
                  <text
                    fill="#8D93A1"
                    fontFamily="Manrope"
                    fontSize="11"
                    textAnchor="middle"
                    x="222"
                    y="232"
                  >
                    Day 1
                  </text>
                  <line stroke="#8D93A1" strokeWidth="1" x1="384" x2="384" y1="208" y2="214"></line>
                  <text
                    fill="#8D93A1"
                    fontFamily="Manrope"
                    fontSize="11"
                    textAnchor="middle"
                    x="384"
                    y="232"
                  >
                    Day 2
                  </text>
                  <line stroke="#E05252" strokeWidth="2" x1="465" x2="465" y1="208" y2="216"></line>
                  <text
                    fill="#E05252"
                    fontFamily="Manrope"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                    x="465"
                    y="232"
                  >
                    Day 2.5 (Zero)
                  </text>
                  <line stroke="#8D93A1" strokeWidth="1" x1="546" x2="546" y1="208" y2="214"></line>
                  <text
                    fill="#8D93A1"
                    fontFamily="Manrope"
                    fontSize="11"
                    textAnchor="middle"
                    x="546"
                    y="232"
                  >
                    Day 3
                  </text>
                  <line stroke="#8D93A1" strokeWidth="1" x1="708" x2="708" y1="208" y2="214"></line>
                  <text
                    fill="#8D93A1"
                    fontFamily="Manrope"
                    fontSize="11"
                    textAnchor="middle"
                    x="708"
                    y="232"
                  >
                    Day 4
                  </text>
                </svg>
              </div>

              <div className="mt-space-sm pt-space-sm flex flex-wrap items-center justify-between gap-space-sm text-text-secondary font-body-sm text-body-sm">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-red-critical"></span> Current burn slope (-8u /
                    day)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-b border-dashed border-amber-accent"></span>{" "}
                    Buffer minimum (30u)
                  </span>
                </div>
                <span className="font-medium text-text-primary">
                  Recommended order: +100 to +120 units
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Summary, Timeline & Facility Specs (~35% width: 4 of 12 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {/* 1. AI Operational Summary Card */}
            <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)]">
              <div className="flex items-center gap-2 mb-space-md">
                <div className="w-7 h-7 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight">
                  AI Operational Summary
                </h2>
              </div>
              <div className="flex flex-col gap-space-sm">
                {/* Bullet 1 */}
                <div className="p-space-sm rounded-xl bg-workspace-surface flex items-start gap-space-xs">
                  <div className="w-6 h-6 rounded-full bg-red-tint text-red-critical flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-sm">priority_high</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-text-primary mb-0.5">
                      Urgent ORS Shortage
                    </p>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Current burn rate (8 units/day) depletes reserves by Thursday afternoon
                      without transfer.
                    </p>
                  </div>
                </div>
                {/* Bullet 2 */}
                <div className="p-space-sm rounded-xl bg-workspace-surface flex items-start gap-space-xs">
                  <div className="w-6 h-6 rounded-full bg-amber-tint text-text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-sm">hotel</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-text-primary mb-0.5">
                      High Bed Occupancy
                    </p>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      18 of 20 beds occupied (90%). Inpatient intake should coordinate with Maholi
                      PHC if surge exceeds 2 beds.
                    </p>
                  </div>
                </div>
                {/* Bullet 3 */}
                <div className="p-space-sm rounded-xl bg-workspace-surface flex items-start gap-space-xs">
                  <div className="w-6 h-6 rounded-full bg-blue-tint text-blue-info flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-sm">badge</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-text-primary mb-0.5">
                      Reduced Staffing
                    </p>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      2 of 6 medical staff on scheduled leave; triage throughput currently operating
                      at 67% capacity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Attention Timeline Card */}
            <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)]">
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight">
                    Attention Timeline
                  </h2>
                  <span className="font-body-sm text-body-sm text-text-muted">
                    Predicted critical milestones
                  </span>
                </div>
                <span className="material-symbols-outlined text-text-muted">schedule</span>
              </div>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-muted">
                {/* Step 1 (Today) */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-card-surface flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-text-primary"></span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-label-sm text-label-sm text-text-primary">Today</span>
                    <span className="font-body-sm text-body-sm text-text-muted">10:00 IST</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    <span className="font-medium text-text-primary">20 ORS units remaining</span> ·
                    Baseline telemetry verified with PHC storekeeper.
                  </p>
                </div>
                {/* Step 2 (In 2.5 Days) */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-card-surface flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-critical animate-pulse"></span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-label-sm text-label-sm text-red-critical">
                      In ~60 Hours (Day 2.5)
                    </span>
                    <span className="font-body-sm text-body-sm text-red-critical font-medium">
                      Critical
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    <span className="font-medium text-text-primary">Projected zero stock</span> ·
                    Clinical stockout imminent under steady admission rate.
                  </p>
                </div>
                {/* Step 3 (Recommended Action) */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-card-surface flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-accent"></span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-label-sm text-label-sm text-teal-accent">
                      Recommended Action
                    </span>
                    <span className="font-body-sm text-body-sm text-text-muted">Before 14:00</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5 mb-2">
                    <span className="font-medium text-text-primary">
                      Transfer 120 ORS from Maholi
                    </span>{" "}
                    · Restores 17.5 days buffer.
                  </p>
                  <Link
                    to="/redistributions"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-accent font-label-sm text-label-sm hover:bg-surface-muted transition-colors"
                  >
                    <span>View dispatch plan</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Facility Details Card */}
            <div className="bg-card-surface rounded-2xl p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)]">
              <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight mb-space-md">
                Facility Information
              </h2>
              <div className="flex flex-col gap-3 font-body-sm text-body-sm">
                <div className="flex items-center justify-between pb-2 border-b border-workspace-surface">
                  <span className="text-text-muted">District Sector</span>
                  <span className="font-medium text-text-primary">Sitapur, Sector 3</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-workspace-surface">
                  <span className="text-text-muted">Facility Code</span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-muted text-text-primary">
                    PHC-SIT-001
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-workspace-surface">
                  <span className="text-text-muted">Medical Officer</span>
                  <span className="font-medium text-text-primary">Dr. A. Verma</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-workspace-surface">
                  <span className="text-text-muted">Telemetry Status</span>
                  <span className="inline-flex items-center gap-1.5 text-green-healthy font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-healthy animate-ping"></span>
                    Live Synced (10:12 IST)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-text-muted">Facility Grade</span>
                  <span className="font-medium text-text-primary">Type-B Primary Center</span>
                </div>
              </div>
              {/* Quick Contacts Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-space-md pt-2">
                <button
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-workspace-surface hover:bg-surface-muted text-text-primary font-label-sm text-label-sm transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-text-secondary">
                    call
                  </span>
                  Call MOIC
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-workspace-surface hover:bg-surface-muted text-text-primary font-label-sm text-label-sm transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-text-secondary">
                    radio
                  </span>
                  VHF Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
