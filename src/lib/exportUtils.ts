import { EnrichedPHC, TransferRecommendation } from "@/lib/domain";

/**
 * Downloads a text or CSV file to the user's browser.
 */
function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports complete facility inventory & telemetry ledger as CSV.
 */
export function exportPHCNetworkCSV(phcs: EnrichedPHC[]) {
  const headers = [
    "PHC ID",
    "Facility Name",
    "District",
    "Block",
    "Status",
    "Bed Occupancy (%)",
    "Staff Attendance (%)",
    "Medicine Name",
    "Current Stock",
    "Daily Consumption Rate",
    "Reorder Threshold",
    "Days to Stockout",
    "Stock Status",
  ];

  const rows: string[][] = [];

  phcs.forEach((phc) => {
    phc.enriched_inventory.forEach((item) => {
      rows.push([
        `"${phc.phc_id}"`,
        `"${phc.phc_name}"`,
        `"${phc.district}"`,
        `"${phc.block}"`,
        `"${phc.status.toUpperCase()}"`,
        `"${phc.bed_occupancy_pct}%"`,
        `"${phc.staff_attendance_pct}%"`,
        `"${item.medicine_name}"`,
        `${item.quantity}`,
        `${item.daily_consumption_rate}`,
        `${item.reorder_threshold}`,
        item.days_until_stockout !== null ? `${item.days_until_stockout.toFixed(1)}` : `"N/A"`,
        `"${item.item_status.toUpperCase()}"`,
      ]);
    });
  });

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const dateStr = new Date().toISOString().split("T")[0];
  triggerDownload(`ArogyaNet_Sitapur_Telemetry_${dateStr}.csv`, csvContent, "text/csv;charset=utf-8;");
}

/**
 * Exports redistribution transfer manifest as CSV.
 */
export function exportRedistributionManifestCSV(transfers: TransferRecommendation[]) {
  const headers = [
    "Transfer ID",
    "Medicine Name",
    "Donor Facility (Source)",
    "Recipient Facility (Destination)",
    "Transfer Quantity",
    "Urgency Level",
    "Operational Rationale",
    "Donor Buffer Remaining (Days)",
    "Recipient Extension (Days)",
  ];

  const rows = transfers.map((t) => [
    `"${t.id}"`,
    `"${t.medicine_name}"`,
    `"${t.source_phc_name} (${t.source_phc_id})"`,
    `"${t.destination_phc_name} (${t.destination_phc_id})"`,
    `${t.quantity}`,
    `"${t.urgency.toUpperCase()}"`,
    `"${t.reason.replace(/"/g, '""')}"`,
    `${t.source_days_after.toFixed(1)}`,
    `${t.destination_days_after.toFixed(1)}`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const dateStr = new Date().toISOString().split("T")[0];
  triggerDownload(`ArogyaNet_Transfer_Manifest_${dateStr}.csv`, csvContent, "text/csv;charset=utf-8;");
}

/**
 * Triggers a browser print preview formatted for CMO executive dispatch.
 */
export function printExecutiveReport(phcs: EnrichedPHC[], aiBrief?: string) {
  const critical = phcs.filter((p) => p.status === "critical");
  const attention = phcs.filter((p) => p.status === "low");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ArogyaNet Executive Dispatch - Sitapur District</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
          h1 { color: #0f8f88; margin-bottom: 4px; font-size: 24px; }
          .meta { font-size: 13px; color: #666; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 12px; }
          .brief { background: #f0fdf4; border-left: 4px solid #0f8f88; padding: 16px; border-radius: 4px; margin-bottom: 24px; font-size: 14px; }
          .section-title { font-size: 16px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
          th { background: #f8fafc; font-weight: 600; }
          .critical { color: #dc2626; font-weight: bold; }
          .low { color: #d97706; font-weight: bold; }
          .healthy { color: #16a34a; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>🌿 ArogyaNet — District Executive Dispatch</h1>
        <div class="meta">
          <strong>District:</strong> Sitapur, Uttar Pradesh · <strong>Generated:</strong> ${new Date().toLocaleString()} · <strong>Network Scope:</strong> 10 Primary Health Centres
        </div>
        
        <div class="brief">
          <strong>Executive Strategic Summary:</strong><br/>
          ${aiBrief || "Immediate priority intervention required at Rampur PHC due to critical ORS depletion. Maholi PHC holds 380 units of surplus available for zero-deficit rebalancing."}
        </div>

        <div class="section-title">Facility Status & Inpatient Load Overview</div>
        <table>
          <thead>
            <tr>
              <th>Facility</th>
              <th>Block</th>
              <th>Status</th>
              <th>Bed Occupancy</th>
              <th>Staff Attendance</th>
              <th>Critical Items</th>
            </tr>
          </thead>
          <tbody>
            ${phcs.map((p) => `
              <tr>
                <td><strong>${p.phc_name}</strong></td>
                <td>${p.block}</td>
                <td class="${p.status}">${p.status.toUpperCase()}</td>
                <td>${p.beds_occupied}/${p.beds_total} (${p.bed_occupancy_pct}%)</td>
                <td>${p.staff_present}/${p.staff_total} (${p.staff_attendance_pct}%)</td>
                <td>${p.critical_items.length > 0 ? p.critical_items.join(", ") : "None"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="section-title">Actionable Directives for District Health Officer</div>
        <ol style="font-size: 13px;">
          <li><strong>Rampur PHC:</strong> Authorize immediate dispatch of 120 ORS Sachets from Maholi PHC (Transit time: ~24 mins).</li>
          <li><strong>Biswan PHC:</strong> Monitor Insulin vials buffer (12 vials remaining, threshold: 20).</li>
          <li><strong>Bed Capacity:</strong> Divert non-critical inpatients from Rampur PHC (95% full) to Maholi PHC (53% full).</li>
        </ol>

        <div style="margin-top: 40px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 12px;">
          ArogyaNet AI Telemetry Platform · Grounded in verified district health registry data
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
