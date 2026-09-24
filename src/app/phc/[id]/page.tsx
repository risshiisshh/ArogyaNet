"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import rawPhcs from "@/data/phcs.json";
import {
  enrichPHC,
  enrichAllPHCs,
  computeAlerts,
  computeRedistributions,
  PHC,
} from "@/lib/domain";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bed,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hospital,
  MapPin,
  Pill,
  Share2,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Users,
} from "lucide-react";

export default function PHCDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "PHC001";

  const allPhcs = useMemo(() => rawPhcs as PHC[], []);
  const enrichedList = useMemo(() => enrichAllPHCs(allPhcs), [allPhcs]);

  const currentPHC = useMemo(() => {
    const found = allPhcs.find(
      (p) => p.phc_id.toLowerCase() === id.toLowerCase() || p.phc_name.toLowerCase().includes(id.toLowerCase())
    );
    return found ? enrichPHC(found) : enrichPHC(allPhcs[0]);
  }, [allPhcs, id]);

  const facilityAlerts = useMemo(() => {
    return computeAlerts(allPhcs).filter((a) => a.phc_id === currentPHC.phc_id);
  }, [allPhcs, currentPHC]);

  const relevantTransfers = useMemo(() => {
    return computeRedistributions(allPhcs).filter(
      (r) => r.destination_phc_id === currentPHC.phc_id || r.source_phc_id === currentPHC.phc_id
    );
  }, [allPhcs, currentPHC]);

  // Selected medicine for burn curve preview
  const [selectedMedicine, setSelectedMedicine] = useState<string>(
    currentPHC.inventory[0]?.medicine_name || "ORS Sachets"
  );

  const selectedItem = currentPHC.enriched_inventory.find(
    (i) => i.medicine_name === selectedMedicine
  ) || currentPHC.enriched_inventory[0];

  // 7-day trajectory data points
  const trajectory = useMemo(() => {
    if (!selectedItem) return [];
    const points = [];
    for (let day = 0; day <= 7; day++) {
      const remaining = Math.max(
        0,
        Math.round(selectedItem.quantity - selectedItem.daily_consumption_rate * day)
      );
      points.push({
        dayIndex: day,
        label: day === 0 ? "Today" : `Day +${day}`,
        remaining,
        threshold: selectedItem.reorder_threshold,
      });
    }
    return points;
  }, [selectedItem]);

  const maxVal = Math.max(
    selectedItem?.quantity || 100,
    (selectedItem?.reorder_threshold || 50) * 1.5,
    50
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Back button and facility switcher bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#626875] hover:text-[#111318] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to District Overview</span>
        </Link>

        {/* Facility Dropdown Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#626875]">Switch Facility:</span>
          <select
            value={currentPHC.phc_id}
            onChange={(e) => router.push(`/phc/${e.target.value}`)}
            className="bg-white border border-[#E7E9EE] rounded-full px-4 py-1.5 text-xs font-bold text-[#111318] shadow-xs focus:outline-none focus:ring-1 focus:ring-[#111318]"
          >
            {enrichedList.map((p) => (
              <option key={p.phc_id} value={p.phc_id}>
                {p.phc_name} ({p.district}) — {p.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Facility Header Card */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#F8F8FA] border border-[#E7E9EE] text-[#111318]">
                {currentPHC.phc_id}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                  currentPHC.status === "critical"
                    ? "bg-[#FDE8E8] text-[#D93838]"
                    : currentPHC.status === "low"
                    ? "bg-[#FFF4D6] text-[#E0A000]"
                    : "bg-[#E5F6EE] text-[#248A54]"
                }`}
              >
                {currentPHC.status} Status
              </span>
              <span className="text-xs text-[#8D93A1]">
                GPS: {currentPHC.latitude}° N, {currentPHC.longitude}° E
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111318] tracking-tight">
              {currentPHC.phc_name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[#626875]">
              <MapPin className="w-4 h-4 text-[#0F8F88]" />
              <span>
                {currentPHC.block} Block • {currentPHC.district} District • Uttar Pradesh
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/redistributions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111318] text-white text-xs font-bold hover:bg-[#252830] transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F8F88]" />
              <span>Request Rebalancing</span>
            </Link>

            <Link
              href="/alerts"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8F8FA] text-[#111318] text-xs font-bold border border-[#E7E9EE] hover:bg-[#EDEEF0] transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#D93838]" />
              <span>Active Alerts ({facilityAlerts.length})</span>
            </Link>
          </div>
        </div>

        {/* Operational Indicators Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E7E9EE]">
          {/* Bed Occupancy */}
          <div className="bg-[#F8F8FA] p-4 rounded-xl border border-[#E7E9EE]">
            <div className="flex items-center justify-between text-xs text-[#626875] mb-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-[#0F8F88]" /> Bed Occupancy
              </span>
              <span
                className={`font-bold ${
                  currentPHC.bed_occupancy_pct > 90 ? "text-[#D93838]" : "text-[#111318]"
                }`}
              >
                {currentPHC.bed_occupancy_pct}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-[#111318]">
              {currentPHC.beds_occupied} / {currentPHC.beds_total}
              <span className="text-xs font-normal text-[#626875] ml-1">beds in use</span>
            </div>
            <div className="w-full bg-[#E7E9EE] rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  currentPHC.bed_occupancy_pct > 90
                    ? "bg-[#D93838]"
                    : currentPHC.bed_occupancy_pct > 75
                    ? "bg-[#E0A000]"
                    : "bg-[#248A54]"
                }`}
                style={{ width: `${currentPHC.bed_occupancy_pct}%` }}
              />
            </div>
          </div>

          {/* Staff Attendance */}
          <div className="bg-[#F8F8FA] p-4 rounded-xl border border-[#E7E9EE]">
            <div className="flex items-center justify-between text-xs text-[#626875] mb-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0F8F88]" /> Clinical Staff
              </span>
              <span className="font-bold text-[#111318]">
                {currentPHC.staff_attendance_pct}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-[#111318]">
              {currentPHC.staff_present} / {currentPHC.staff_total}
              <span className="text-xs font-normal text-[#626875] ml-1">on duty today</span>
            </div>
            <div className="w-full bg-[#E7E9EE] rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  currentPHC.staff_attendance_pct < 70 ? "bg-[#E0A000]" : "bg-[#248A54]"
                }`}
                style={{ width: `${currentPHC.staff_attendance_pct}%` }}
              />
            </div>
          </div>

          {/* Critical Items Count */}
          <div className="bg-[#F8F8FA] p-4 rounded-xl border border-[#E7E9EE]">
            <div className="flex items-center justify-between text-xs text-[#626875] mb-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-[#D93838]" /> Critical Deficits
              </span>
              <span className="font-bold text-[#D93838]">
                {currentPHC.critical_items.length} items
              </span>
            </div>
            <div className="text-xl font-extrabold text-[#D93838]">
              {currentPHC.critical_items.length > 0 ? (
                currentPHC.critical_items.join(", ")
              ) : (
                <span className="text-[#248A54]">None &ge; Safe</span>
              )}
            </div>
            <div className="text-[10px] text-[#626875] mt-1 font-medium">
              At or below reorder threshold
            </div>
          </div>

          {/* Telemetry Status */}
          <div className="bg-[#F8F8FA] p-4 rounded-xl border border-[#E7E9EE]">
            <div className="flex items-center justify-between text-xs text-[#626875] mb-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0F8F88]" /> Last Sensor Sync
              </span>
              <span className="font-bold text-[#248A54]">Active</span>
            </div>
            <div className="text-xl font-extrabold text-[#111318]">
              {new Date(currentPHC.last_updated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-[10px] text-[#626875] mt-1 font-medium">
              Deterministic hourly cycle
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Stock Table (Left) + Burn Trajectory & AI Operations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Medicine Inventory Table */}
        <div className="lg:col-span-7 bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111318]">Essential Drug Inventory</h2>
              <p className="text-xs text-[#626875]">
                Real-time stock level, burn rate, and stockout forecast
              </p>
            </div>
            <span className="text-xs font-semibold text-[#8D93A1]">5 Monitored Medicines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E7E9EE] text-[#8D93A1] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-2">Medicine</th>
                  <th className="py-3 px-2 text-right">In Stock</th>
                  <th className="py-3 px-2 text-right">Burn Rate</th>
                  <th className="py-3 px-2 text-right">Threshold</th>
                  <th className="py-3 px-2 text-right">Coverage</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {currentPHC.enriched_inventory.map((item) => {
                  const isSelected = selectedMedicine === item.medicine_name;
                  const isCrit = item.item_status === "critical";
                  const isLow = item.item_status === "low";

                  return (
                    <tr
                      key={item.medicine_name}
                      onClick={() => setSelectedMedicine(item.medicine_name)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#F8F8FA] font-bold" : "hover:bg-[#F8F8FA]/60"
                      }`}
                    >
                      <td className="py-3.5 px-2">
                        <div className="font-bold text-[#111318]">{item.medicine_name}</div>
                        {isSelected && (
                          <span className="text-[10px] text-[#0F8F88] font-normal">
                            Viewing chart &rarr;
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-bold text-[#111318]">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono text-[#626875]">
                        {item.daily_consumption_rate}/day
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono text-[#8D93A1]">
                        {item.reorder_threshold}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-bold">
                        <span
                          className={
                            isCrit
                              ? "text-[#D93838]"
                              : isLow
                              ? "text-[#E0A000]"
                              : "text-[#248A54]"
                          }
                        >
                          {item.coverage_label}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isCrit
                              ? "bg-[#FDE8E8] text-[#D93838]"
                              : isLow
                              ? "bg-[#FFF4D6] text-[#E0A000]"
                              : "bg-[#E5F6EE] text-[#248A54]"
                          }`}
                        >
                          {item.item_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMedicine(item.medicine_name);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isSelected
                              ? "bg-[#111318] text-white"
                              : "bg-[#F8F8FA] text-[#626875] border border-[#E7E9EE] hover:bg-[#EDEEF0]"
                          }`}
                        >
                          Forecast
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Active Facility Alerts */}
          {facilityAlerts.length > 0 && (
            <div className="pt-4 border-t border-[#E7E9EE] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D93838] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Active Alerts for {currentPHC.phc_name}
              </h3>
              <div className="space-y-2">
                {facilityAlerts.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-[#FDE8E8]/40 border border-[#FDE8E8] text-xs space-y-1"
                  >
                    <div className="font-bold text-[#D93838]">{a.title}</div>
                    <div className="text-[11px] text-[#626875] leading-relaxed">{a.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Forecast Burn Trajectory Chart + AI Operations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Burn Trajectory Visualizer */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F8F88]">
                  7-Day Forward Projection
                </span>
                <h3 className="font-extrabold text-base text-[#111318]">
                  {selectedMedicine} Burn Trajectory
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F8F8FA] border border-[#E7E9EE]">
                {selectedItem.quantity} units left
              </span>
            </div>

            {/* Trajectory Bar Visualizer */}
            <div className="bg-[#F8F8FA] p-4 rounded-xl border border-[#E7E9EE] space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#626875]">
                <span>Safe Threshold: {selectedItem.reorder_threshold} units</span>
                <span className="text-[#D93838] font-bold">
                  Depletes: ~{selectedItem.coverage_label}
                </span>
              </div>

              <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
                {trajectory.map((point) => {
                  const heightPct = Math.min(100, Math.round((point.remaining / maxVal) * 100));
                  const isBelowThreshold = point.remaining <= point.threshold;
                  const isZero = point.remaining === 0;

                  return (
                    <div
                      key={point.dayIndex}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                    >
                      <span className="text-[9px] font-mono text-[#8D93A1] group-hover:text-[#111318] transition-colors">
                        {point.remaining}
                      </span>
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isZero
                            ? "bg-gray-300 h-1"
                            : isBelowThreshold
                            ? "bg-[#D93838]"
                            : "bg-[#0F8F88]"
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                      />
                      <span className="text-[9px] font-bold text-[#626875]">
                        {point.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#8D93A1] pt-2 border-t border-[#E7E9EE]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#0F8F88]" /> Above Threshold
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D93838]" /> Below Threshold
                </span>
              </div>
            </div>

            {/* AI Operational Guidance */}
            <div className="p-4 rounded-xl bg-[#E7F7F5] border border-[#0F8F88]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F8F88]">
                <Sparkles className="w-4 h-4" />
                <span>AI Operational Facility Summary</span>
              </div>
              <p className="text-xs text-[#111318] leading-relaxed">
                {currentPHC.status === "critical"
                  ? `${currentPHC.phc_name} requires urgent supply replenishment. At the current daily burn of ${selectedItem.daily_consumption_rate} units/day, existing stock of ${selectedItem.medicine_name} will deplete in ${selectedItem.coverage_label}. Automated redistribution plan #TR-102 recommends sourcing stock from neighboring surplus nodes.`
                  : `${currentPHC.phc_name} is operating within normal parameters. Inventory buffers exceed the 7-day safety threshold across monitored medicines.`}
              </p>
            </div>

            {/* Relevant Transfer recommendations for this facility */}
            {relevantTransfers.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-[#111318]">
                  Available Coordinated Transfers
                </div>
                {relevantTransfers.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#111318]">{t.medicine_name}</span>
                      <span className="text-[#0F8F88]">Transfer {t.quantity} units</span>
                    </div>
                    <div className="text-[11px] text-[#626875]">
                      From: <span className="font-semibold text-[#111318]">{t.source_phc_name}</span> &rarr;{" "}
                      To: <span className="font-semibold text-[#111318]">{t.destination_phc_name}</span>
                    </div>
                    <Link
                      href="/redistributions"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F8F88] hover:underline pt-1"
                    >
                      <span>Authorize in Rebalancing Panel</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
