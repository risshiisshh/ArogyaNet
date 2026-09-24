// PHC Domain Types & Core Domain Logic
// All arithmetic is computed here in application code — AI only explains results

export interface InventoryItem {
  medicine_name: string;
  quantity: number;
  daily_consumption_rate: number;
  reorder_threshold: number;
}

export interface PHC {
  phc_id: string;
  phc_name: string;
  district: string;
  block: string;
  latitude: number;
  longitude: number;
  beds_total: number;
  beds_occupied: number;
  staff_total: number;
  staff_present: number;
  last_updated: string;
  inventory: InventoryItem[];
}

export type PHCStatus = 'critical' | 'low' | 'healthy';

export interface EnrichedInventoryItem extends InventoryItem {
  days_until_stockout: number | null; // null if rate is 0 or invalid
  item_status: PHCStatus;
  coverage_label: string;
}

export interface EnrichedPHC extends PHC {
  status: PHCStatus;
  bed_occupancy_pct: number;
  staff_attendance_pct: number;
  enriched_inventory: EnrichedInventoryItem[];
  critical_items: string[];
  low_items: string[];
}

export interface TransferRecommendation {
  id: string;
  medicine_name: string;
  source_phc_id: string;
  source_phc_name: string;
  destination_phc_id: string;
  destination_phc_name: string;
  quantity: number;
  urgency: 'urgent' | 'high' | 'medium';
  reason: string;
  source_days_after: number;
  destination_days_after: number;
  source_surplus: number;
}

export interface Alert {
  id: string;
  phc_id: string;
  phc_name: string;
  district: string;
  category: 'stock' | 'bed' | 'staff';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  value?: number;
  unit?: string;
  action_label?: string;
}

// ─── Core Domain Functions ───────────────────────────────────────────────────

/**
 * Compute days until an item stocks out.
 * Returns null if rate is 0, negative, or quantity is negative.
 */
export function getDaysUntilStockout(item: InventoryItem): number | null {
  if (!item.daily_consumption_rate || item.daily_consumption_rate <= 0) return null;
  if (item.quantity < 0) return null;
  return item.quantity / item.daily_consumption_rate;
}

/**
 * Classify a single inventory item's status.
 */
export function classifyItemStatus(item: InventoryItem): PHCStatus {
  if (item.quantity <= item.reorder_threshold) return 'critical';
  const days = getDaysUntilStockout(item);
  if (days !== null && days <= 3) return 'low';
  return 'healthy';
}

/**
 * Classify a PHC's overall status.
 * critical: any item at/below reorder threshold OR bed occupancy > 90%
 * low: any item within 3 days of stockout
 * healthy: all clear
 */
export function classifyPHCStatus(phc: PHC): PHCStatus {
  const bedOccupancyPct = phc.beds_total > 0 ? phc.beds_occupied / phc.beds_total : 0;
  const hasCriticalItem = phc.inventory.some(i => i.quantity <= i.reorder_threshold);
  if (hasCriticalItem || bedOccupancyPct > 0.9) return 'critical';
  const hasLowItem = phc.inventory.some(i => {
    const days = getDaysUntilStockout(i);
    return days !== null && days <= 3;
  });
  if (hasLowItem) return 'low';
  return 'healthy';
}

/**
 * Produce a human-readable coverage label.
 */
export function getCoverageLabel(days: number | null): string {
  if (days === null) return 'N/A';
  if (days <= 0) return 'Stocked out';
  if (days < 1) return `${Math.round(days * 24)}h`;
  return `${days.toFixed(1)} days`;
}

/**
 * Enrich a single PHC with all computed fields.
 */
export function enrichPHC(phc: PHC): EnrichedPHC {
  const enriched_inventory: EnrichedInventoryItem[] = phc.inventory.map(item => {
    const days = getDaysUntilStockout(item);
    const item_status = classifyItemStatus(item);
    return {
      ...item,
      days_until_stockout: days,
      item_status,
      coverage_label: getCoverageLabel(days),
    };
  });

  const bed_occupancy_pct = phc.beds_total > 0
    ? Math.round((phc.beds_occupied / phc.beds_total) * 100)
    : 0;
  const staff_attendance_pct = phc.staff_total > 0
    ? Math.round((phc.staff_present / phc.staff_total) * 100)
    : 0;

  const status = classifyPHCStatus(phc);
  const critical_items = enriched_inventory
    .filter(i => i.item_status === 'critical')
    .map(i => i.medicine_name);
  const low_items = enriched_inventory
    .filter(i => i.item_status === 'low')
    .map(i => i.medicine_name);

  return {
    ...phc,
    status,
    bed_occupancy_pct,
    staff_attendance_pct,
    enriched_inventory,
    critical_items,
    low_items,
  };
}

/**
 * Enrich all PHCs in the dataset.
 */
export function enrichAllPHCs(phcs: PHC[]): EnrichedPHC[] {
  return phcs.map(enrichPHC);
}

/**
 * SAFETY BUFFER: minimum days of supply a source must keep after donation.
 */
const SAFETY_BUFFER_DAYS = 7;

/**
 * Compute safe transferable quantity from source for a given medicine.
 * Returns 0 if source cannot safely share.
 */
export function getSafeTransferQty(
  source: PHC,
  medicine_name: string
): number {
  const item = source.inventory.find(i => i.medicine_name === medicine_name);
  if (!item) return 0;
  const safeMin = item.reorder_threshold + item.daily_consumption_rate * SAFETY_BUFFER_DAYS;
  const transferable = item.quantity - safeMin;
  return Math.max(0, Math.floor(transferable));
}

/**
 * Compute transfer recommendations deterministically.
 * Only suggests transfers where:
 *   - Same medicine has deficit at destination AND surplus at source
 *   - Transfer won't put source below its own safety threshold
 */
export function computeRedistributions(phcs: PHC[]): TransferRecommendation[] {
  const recommendations: TransferRecommendation[] = [];
  const enriched = enrichAllPHCs(phcs);

  // Find all medicine+PHC combinations that are critical or low
  const deficits = enriched.flatMap(phc =>
    phc.enriched_inventory
      .filter(i => i.item_status === 'critical' || i.item_status === 'low')
      .map(i => ({ phc, item: i }))
  );

  // For each deficit, look for a healthy surplus source
  for (const { phc: destPhc, item: destItem } of deficits) {
    const sources = enriched.filter(srcPhc => {
      if (srcPhc.phc_id === destPhc.phc_id) return false;
      const srcItem = srcPhc.enriched_inventory.find(
        i => i.medicine_name === destItem.medicine_name
      );
      if (!srcItem) return false;
      return srcItem.item_status === 'healthy' &&
        getSafeTransferQty(srcPhc, destItem.medicine_name) > 0;
    });

    if (sources.length === 0) continue;

    // Pick best source (most surplus)
    const bestSource = sources.reduce((best, src) => {
      const bQty = getSafeTransferQty(best, destItem.medicine_name);
      const sQty = getSafeTransferQty(src, destItem.medicine_name);
      return sQty > bQty ? src : best;
    });

    const transferQty = getSafeTransferQty(bestSource, destItem.medicine_name);
    if (transferQty <= 0) continue;

    const srcItem = bestSource.enriched_inventory.find(
      i => i.medicine_name === destItem.medicine_name
    )!;
    const daysAfterForDest = destItem.daily_consumption_rate > 0
      ? (destItem.quantity + transferQty) / destItem.daily_consumption_rate
      : null;
    const daysAfterForSrc = srcItem.daily_consumption_rate > 0
      ? (srcItem.quantity - transferQty) / srcItem.daily_consumption_rate
      : null;

    const urgency: TransferRecommendation['urgency'] =
      destItem.item_status === 'critical' ? 'urgent' :
      (destItem.days_until_stockout !== null && destItem.days_until_stockout <= 2) ? 'high' : 'medium';

    const daysText = destItem.days_until_stockout !== null
      ? `in ${destItem.days_until_stockout.toFixed(1)} days`
      : 'below reorder level';

    recommendations.push({
      id: `${bestSource.phc_id}-${destPhc.phc_id}-${destItem.medicine_name}`,
      medicine_name: destItem.medicine_name,
      source_phc_id: bestSource.phc_id,
      source_phc_name: bestSource.phc_name,
      destination_phc_id: destPhc.phc_id,
      destination_phc_name: destPhc.phc_name,
      quantity: transferQty,
      urgency,
      reason: `${destPhc.phc_name} will stock out ${daysText}. ${bestSource.phc_name} has safe surplus of ${srcItem.quantity} units (${Math.floor(srcItem.quantity / srcItem.daily_consumption_rate)} days supply).`,
      source_days_after: daysAfterForSrc !== null ? Math.round(daysAfterForSrc) : 999,
      destination_days_after: daysAfterForDest !== null ? Math.round(daysAfterForDest) : 999,
      source_surplus: transferQty,
    });
  }

  // Sort: urgent first, then high, then medium
  const urgencyOrder = { urgent: 0, high: 1, medium: 2 };
  return recommendations
    .sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])
    .slice(0, 10); // top 10
}

/**
 * Generate structured alert data from enriched PHCs.
 */
export function computeAlerts(phcs: PHC[]): Alert[] {
  const alerts: Alert[] = [];
  const enriched = enrichAllPHCs(phcs);

  for (const phc of enriched) {
    // Stock alerts
    for (const item of phc.enriched_inventory) {
      if (item.item_status === 'critical') {
        const daysLeft = item.days_until_stockout;
        alerts.push({
          id: `${phc.phc_id}-${item.medicine_name}-stock-critical`,
          phc_id: phc.phc_id,
          phc_name: phc.phc_name,
          district: phc.district,
          category: 'stock',
          severity: 'critical',
          title: `${item.medicine_name} critically low at ${phc.phc_name}`,
          description: daysLeft !== null
            ? `Only ${item.quantity} units remaining — stocks out in ${daysLeft.toFixed(1)} days at current consumption of ${item.daily_consumption_rate}/day. Below reorder threshold of ${item.reorder_threshold}.`
            : `Only ${item.quantity} units remaining — below reorder threshold of ${item.reorder_threshold}.`,
          value: item.quantity,
          unit: 'units',
          action_label: 'View transfer options',
        });
      } else if (item.item_status === 'low') {
        const daysLeft = item.days_until_stockout!;
        alerts.push({
          id: `${phc.phc_id}-${item.medicine_name}-stock-low`,
          phc_id: phc.phc_id,
          phc_name: phc.phc_name,
          district: phc.district,
          category: 'stock',
          severity: 'high',
          title: `${item.medicine_name} at ${phc.phc_name} runs out in ${daysLeft.toFixed(1)} days`,
          description: `Current stock: ${item.quantity} units at ${item.daily_consumption_rate}/day consumption. Order or transfer needed within 24 hours.`,
          value: daysLeft,
          unit: 'days',
          action_label: 'Review reorder',
        });
      }
    }

    // Bed occupancy alert
    if (phc.bed_occupancy_pct > 90) {
      alerts.push({
        id: `${phc.phc_id}-beds-critical`,
        phc_id: phc.phc_id,
        phc_name: phc.phc_name,
        district: phc.district,
        category: 'bed',
        severity: 'critical',
        title: `Bed occupancy at ${phc.phc_name} reached ${phc.bed_occupancy_pct}%`,
        description: `${phc.beds_occupied}/${phc.beds_total} beds occupied. At or near saturation — assess demand surge and potential patient diversion.`,
        value: phc.bed_occupancy_pct,
        unit: '%',
        action_label: 'View facility status',
      });
    } else if (phc.bed_occupancy_pct > 75) {
      alerts.push({
        id: `${phc.phc_id}-beds-high`,
        phc_id: phc.phc_id,
        phc_name: phc.phc_name,
        district: phc.district,
        category: 'bed',
        severity: 'high',
        title: `Bed occupancy at ${phc.phc_name} is ${phc.bed_occupancy_pct}%`,
        description: `${phc.beds_occupied}/${phc.beds_total} beds occupied. Approaching capacity — monitor closely.`,
        value: phc.bed_occupancy_pct,
        unit: '%',
        action_label: 'Check schedule',
      });
    }

    // Staff alert
    if (phc.staff_attendance_pct < 70) {
      alerts.push({
        id: `${phc.phc_id}-staff-low`,
        phc_id: phc.phc_id,
        phc_name: phc.phc_name,
        district: phc.district,
        category: 'staff',
        severity: phc.staff_attendance_pct < 50 ? 'critical' : 'high',
        title: `Staff attendance at ${phc.phc_name} is lower than usual`,
        description: `${phc.staff_present}/${phc.staff_total} staff present (${phc.staff_attendance_pct}%). Check attendance records and roster status for today.`,
        value: phc.staff_attendance_pct,
        unit: '%',
        action_label: 'View roster status',
      });
    }
  }

  // Sort: critical first, then by district
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

/**
 * Get network-level summary statistics.
 */
export function getNetworkSummary(enriched: EnrichedPHC[]) {
  const critical = enriched.filter(p => p.status === 'critical').length;
  const low = enriched.filter(p => p.status === 'low').length;
  const healthy = enriched.filter(p => p.status === 'healthy').length;
  const avgBedOccupancy = Math.round(
    enriched.reduce((sum, p) => sum + p.bed_occupancy_pct, 0) / enriched.length
  );
  const districts = [...new Set(enriched.map(p => p.district))];
  return { total: enriched.length, critical, low, healthy, avgBedOccupancy, districts };
}
