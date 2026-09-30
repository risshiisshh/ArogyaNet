import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { EnrichedPHC } from "@/lib/domain";

interface DistrictMapProps {
  phcs: EnrichedPHC[];
  selectedPhcId?: string;
  onSelectPhc?: (phc: EnrichedPHC) => void;
  showCorridors?: boolean;
}

export function DistrictMap({
  phcs,
  selectedPhcId,
  onSelectPhc,
  showCorridors = true,
}: DistrictMapProps) {
  const [hoveredPhc, setHoveredPhc] = useState<EnrichedPHC | null>(null);
  const [activeLayer, setActiveLayer] = useState<"telemetry" | "corridors" | "flood">("corridors");

  const SVG_WIDTH = 940;
  const SVG_HEIGHT = 520;
  const PADDING_X = 80;
  const PADDING_Y = 65;

  // Compute bounding box and project real GPS coordinates to SVG canvas
  const projectedNodes = useMemo(() => {
    if (!phcs || phcs.length === 0) return [];

    const lats = phcs.map((p) => p.latitude);
    const lons = phcs.map((p) => p.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const latSpan = maxLat - minLat || 0.01;
    const lonSpan = maxLon - minLon || 0.01;

    return phcs.map((phc, idx) => {
      const normX = (phc.longitude - minLon) / lonSpan;
      // Invert Y because SVG coordinates increase downwards
      const normY = (phc.latitude - minLat) / latSpan;

      const x = PADDING_X + normX * (SVG_WIDTH - 2 * PADDING_X);
      const y = SVG_HEIGHT - PADDING_Y - normY * (SVG_HEIGHT - 2 * PADDING_Y);

      // Label offset placement strategy to avoid overlap
      // Alternate offsets based on quadrant and index
      const isTopHalf = normY > 0.5;
      const isRightHalf = normX > 0.5;

      const labelOffsetY = isTopHalf ? -16 : 22;
      const labelOffsetX = idx % 2 === 0 ? (isRightHalf ? 10 : -10) : 0;

      return {
        phc,
        x: Math.round(x),
        y: Math.round(y),
        labelOffsetX,
        labelOffsetY,
        isCritical: phc.status === "critical",
        isLow: phc.status === "low",
        isHealthy: phc.status === "healthy",
      };
    });
  }, [phcs]);

  // Find Rampur and Maholi for active transfer corridor
  const maholiNode = projectedNodes.find((n) => n.phc.phc_id === "PHC002" || n.phc.phc_name.includes("Maholi"));
  const rampurNode = projectedNodes.find((n) => n.phc.phc_id === "PHC001" || n.phc.phc_name.includes("Rampur"));
  const biswanNode = projectedNodes.find((n) => n.phc.phc_id === "PHC003" || n.phc.phc_name.includes("Biswan"));
  const laharpurNode = projectedNodes.find((n) => n.phc.phc_id === "PHC005" || n.phc.phc_name.includes("Laharpur"));

  // Build clean district perimeter polygon using bounding margin
  const perimeterPoints = useMemo(() => {
    if (projectedNodes.length === 0) return "";
    return "40,80 220,30 520,25 780,50 900,160 880,410 740,490 420,495 180,470 40,360 25,210";
  }, [projectedNodes]);

  // Compute road network lines connecting nearest geographic clusters
  const networkRoads = useMemo(() => {
    if (projectedNodes.length < 2) return [];
    const roads: { x1: number; y1: number; x2: number; y2: number; id: string }[] = [];

    // Connect each node to its 2 nearest geographic neighbors
    projectedNodes.forEach((node, i) => {
      const distances = projectedNodes
        .map((other, j) => ({
          j,
          other,
          dist: Math.hypot(node.x - other.x, node.y - other.y),
        }))
        .filter((d) => d.j !== i)
        .sort((a, b) => a.dist - b.dist);

      distances.slice(0, 2).forEach((d) => {
        const id = [Math.min(i, d.j), Math.max(i, d.j)].join("-");
        if (!roads.some((r) => r.id === id)) {
          roads.push({
            id,
            x1: node.x,
            y1: node.y,
            x2: d.other.x,
            y2: d.other.y,
          });
        }
      });
    });

    return roads;
  }, [projectedNodes]);

  const activePhc = hoveredPhc || phcs.find((p) => p.phc_id === selectedPhcId);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-workspace-surface border border-border-hairline shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-card-surface/90 backdrop-blur-md border-b border-border-hairline z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">explore</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-headline-sm text-text-primary">
                Sitapur Tactical Geospatial Grid
              </h3>
              <span className="text-[11px] font-label-sm px-2.5 py-0.5 rounded-full bg-teal-tint text-teal-accent font-bold">
                {phcs.length} Facilities Active
              </span>
            </div>
            <span className="text-xs text-text-muted font-body-sm">
              Real-time GPS telemetry &amp; dynamic supply corridors
            </span>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-xl">
          <button
            onClick={() => setActiveLayer("corridors")}
            className={`px-3 py-1.5 rounded-lg text-xs font-label-md font-semibold transition-all cursor-pointer ${
              activeLayer === "corridors"
                ? "bg-card-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
            type="button"
          >
            Corridors &amp; Transfers
          </button>
          <button
            onClick={() => setActiveLayer("telemetry")}
            className={`px-3 py-1.5 rounded-lg text-xs font-label-md font-semibold transition-all cursor-pointer ${
              activeLayer === "telemetry"
                ? "bg-card-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
            type="button"
          >
            Node Status
          </button>
          <button
            onClick={() => setActiveLayer("flood")}
            className={`px-3 py-1.5 rounded-lg text-xs font-label-md font-semibold transition-all cursor-pointer ${
              activeLayer === "flood"
                ? "bg-blue-tint text-blue-info shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
            type="button"
          >
            Flood Risk
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[520px] overflow-hidden bg-workspace-surface flex items-center justify-center select-none">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filters for node pins */}
            <filter id="glow-red-node" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-green-node" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F8F88" />
              <stop offset="100%" stopColor="#D93025" />
            </linearGradient>
            <linearGradient id="floodRiskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.08" />
            </linearGradient>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid Mesh */}
          <rect width="100%" height="100%" fill="url(#gridPattern)" className="text-text-primary" />

          {/* District Territorial Boundary Hull */}
          <polygon
            points={perimeterPoints}
            fill="var(--color-surface-muted, #F4F6F9)"
            fillOpacity="0.75"
            stroke="var(--color-border-hairline, #D4DAE4)"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="transition-colors duration-300"
          />

          {/* Sarayan / Gomti River Corridor */}
          <path
            d="M 60,70 Q 280,180 460,260 T 880,440"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="6"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />

          {/* Flood Inundation Overlay */}
          {activeLayer === "flood" && (
            <path
              d="M 380,180 C 440,220 540,240 600,340 C 520,380 430,360 380,280 Z"
              fill="url(#floodRiskGrad)"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
          )}

          {/* Inter-PHC Road Network Mesh */}
          <g className="road-network" opacity="0.35">
            {networkRoads.map((road) => (
              <line
                key={road.id}
                x1={road.x1}
                y1={road.y1}
                x2={road.x2}
                y2={road.y2}
                stroke="var(--color-border-hairline, #A3AAB8)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Active Logistics Corridors (Flow Animation) */}
          {showCorridors && (activeLayer === "corridors" || activeLayer === "telemetry") && maholiNode && rampurNode && (
            <g className="active-corridors">
              {/* Primary Transfer Route: Maholi (PHC002) → Rampur (PHC001) */}
              <path
                d={`M ${maholiNode.x},${maholiNode.y} Q ${(maholiNode.x + rampurNode.x) / 2 - 20},${
                  (maholiNode.y + rampurNode.y) / 2 - 25
                } ${rampurNode.x},${rampurNode.y}`}
                fill="none"
                stroke="#0F8F88"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
                className="animate-[dash_1.5s_linear_infinite]"
                style={{
                  strokeDashoffset: 100,
                  animation: "dash 1.5s linear infinite",
                }}
              />

              {/* Transit Marker Tag on SH-26 */}
              <g
                transform={`translate(${Math.round((maholiNode.x + rampurNode.x) / 2 - 15)}, ${Math.round(
                  (maholiNode.y + rampurNode.y) / 2 - 25
                )})`}
              >
                <rect
                  x="-42"
                  y="-12"
                  width="84"
                  height="24"
                  rx="12"
                  fill="#111318"
                  className="shadow-lg"
                />
                <text
                  x="0"
                  y="2"
                  fill="#ffffff"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ⚡ 120 ORS
                </text>
              </g>

              {/* Secondary Transfer Route if available: Laharpur → Biswan */}
              {laharpurNode && biswanNode && (
                <path
                  d={`M ${laharpurNode.x},${laharpurNode.y} Q ${
                    (laharpurNode.x + biswanNode.x) / 2 + 25
                  },${(laharpurNode.y + biswanNode.y) / 2} ${biswanNode.x},${biswanNode.y}`}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity="0.8"
                  className="animate-[dash_2s_linear_infinite]"
                />
              )}
            </g>
          )}

          {/* Facility Pins & Badges */}
          {projectedNodes.map(({ phc, x, y, labelOffsetX, labelOffsetY, isCritical, isLow }) => {
            const isSelected = selectedPhcId === phc.phc_id;
            const isHovered = hoveredPhc?.phc_id === phc.phc_id;
            const pinColor = isCritical ? "#D93025" : isLow ? "#F2994A" : "#10B981";

            const displayName = phc.phc_name.replace(" PHC", "");
            const badgeWidth = Math.max(displayName.length * 6.5 + 16, 52);

            return (
              <g
                key={phc.phc_id}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPhc(phc)}
                onMouseLeave={() => setHoveredPhc(null)}
                onClick={() => onSelectPhc?.(phc)}
              >
                {/* Critical Ripple Pulse */}
                {isCritical && (
                  <circle cx={x} cy={y} r="8" fill="#D93025" opacity="0.4">
                    <animate attributeName="r" values="8;20;8" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Selection Halo */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill="none"
                    stroke={pinColor}
                    strokeWidth="2.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Node Center Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isCritical ? "8.5" : "7"}
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter={isCritical ? "url(#glow-red-node)" : "url(#glow-green-node)"}
                  className="transition-transform group-hover:scale-125"
                />

                {/* Node Pill Badge Label with Backdrop */}
                <g transform={`translate(${x + labelOffsetX}, ${y + labelOffsetY})`}>
                  <rect
                    x={-badgeWidth / 2}
                    y="-9"
                    width={badgeWidth}
                    height="18"
                    rx="9"
                    fill="var(--color-card-surface, #ffffff)"
                    fillOpacity="0.92"
                    stroke={isCritical ? "#D93025" : isSelected ? pinColor : "var(--color-border-hairline, #E2E4E9)"}
                    strokeWidth={isCritical || isSelected ? "1.5" : "1"}
                    className="shadow-sm transition-all group-hover:fill-opacity-100"
                  />
                  <text
                    x="0"
                    y="1"
                    fill="var(--color-text-primary, #111318)"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight={isCritical || isSelected ? "bold" : "600"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                  >
                    {displayName}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Facility Hover Inspector Card */}
        {activePhc && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-84 bg-card-surface/95 backdrop-blur-md border border-border-hairline rounded-2xl p-4 shadow-[0_16px_35px_rgba(17,19,24,0.15)] z-30 transition-all animate-fade-in">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-hairline">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    activePhc.status === "critical"
                      ? "bg-red-critical animate-pulse"
                      : activePhc.status === "low"
                      ? "bg-amber-accent"
                      : "bg-green-healthy"
                  }`}
                />
                <h4 className="font-headline-sm text-sm font-bold text-text-primary truncate">
                  {activePhc.phc_name}
                </h4>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-label-sm font-bold uppercase tracking-wider ${
                  activePhc.status === "critical"
                    ? "bg-red-tint text-red-critical"
                    : activePhc.status === "low"
                    ? "bg-amber-tint text-amber-900"
                    : "bg-green-tint text-green-healthy"
                }`}
              >
                {activePhc.status}
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 my-2.5 text-center">
              <div className="bg-workspace-surface p-2 rounded-xl">
                <span className="block text-[10px] text-text-muted">Beds Occupied</span>
                <span className="font-label-md font-bold text-text-primary">
                  {activePhc.bed_occupancy_pct}%
                </span>
              </div>
              <div className="bg-workspace-surface p-2 rounded-xl">
                <span className="block text-[10px] text-text-muted">Staff Attendance</span>
                <span className="font-label-md font-bold text-text-primary">
                  {activePhc.staff_attendance_pct}%
                </span>
              </div>
              <div className="bg-workspace-surface p-2 rounded-xl">
                <span className="block text-[10px] text-text-muted">Stock Status</span>
                <span
                  className={`font-label-md font-bold ${
                    activePhc.critical_items.length > 0 ? "text-red-critical" : "text-green-healthy"
                  }`}
                >
                  {activePhc.critical_items.length > 0
                    ? `${activePhc.critical_items.length} Low`
                    : "Secure"}
                </span>
              </div>
            </div>

            {/* Deep dive link */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-text-muted font-body-sm">
                Block: {activePhc.block}
              </span>
              <Link
                to={`/phc/${activePhc.phc_id}`}
                className="inline-flex items-center gap-1 font-label-sm font-bold text-teal-accent hover:underline cursor-pointer"
              >
                <span>Inspect Facility Ledger</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-5 bg-card-surface/90 border-t border-border-hairline text-xs font-label-sm text-text-secondary">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-critical"></span> Critical Deficit (&le;3d)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-accent"></span> Attention
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-healthy"></span> Healthy Surplus
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-teal-accent font-semibold">
          <span className="w-3 h-0.5 bg-teal-accent border-b border-dashed"></span> Active Dispatch Corridor (SH-26 Maholi &rarr; Rampur)
        </div>
      </div>
    </div>
  );
}
