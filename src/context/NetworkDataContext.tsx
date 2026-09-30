import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import defaultPhcs from "@/data/phcs.json";
import {
  PHC,
  EnrichedPHC,
  Alert,
  TransferRecommendation,
  enrichAllPHCs,
  getNetworkSummary,
  computeAlerts,
  computeRedistributions,
} from "@/lib/domain";

const STORAGE_KEY = "arogyanet_phc_data_v2";

export interface ScenarioPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  data: PHC[];
}

export interface NetworkDataContextType {
  phcs: PHC[];
  enrichedPHCs: EnrichedPHC[];
  summary: ReturnType<typeof getNetworkSummary>;
  alerts: Alert[];
  recommendations: TransferRecommendation[];
  activePresetId: string;
  
  // Actions
  uploadDataset: (importedData: PHC[]) => void;
  parseAndUploadCSV: (csvText: string) => { success: boolean; count?: number; error?: string };
  loadPreset: (presetId: string) => void;
  resetToDefault: () => void;
  updateInventoryItem: (phcId: string, medicineName: string, quantity: number, consumptionRate?: number) => void;
  
  // Modals & Tour
  isDatasetModalOpen: boolean;
  openDatasetModal: () => void;
  closeDatasetModal: () => void;
  
  isPitchModalOpen: boolean;
  openPitchModal: () => void;
  closePitchModal: () => void;
  
  isTourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
}

const NetworkDataContext = createContext<NetworkDataContextType | undefined>(undefined);

// Define Crisis Presets
export const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: "sitapur-baseline",
    name: "Sitapur Baseline",
    tagline: "Live Telemetry Baseline",
    description: "Standard operational state. Rampur PHC faces imminent ORS stockout (2.5 days left) with Maholi PHC having surplus.",
    icon: "grid_view",
    data: defaultPhcs as PHC[],
  },
  {
    id: "monsoon-flood",
    name: "Monsoon Flash Flood",
    tagline: "Waterborne Epidemic Surge",
    description: "Severe water logging along SH-26. Rampur & Biswan PHCs suffer acute ORS & Zinc shortages (+300% consumption rate) and 95% bed saturation.",
    icon: "thunderstorm",
    data: (defaultPhcs as PHC[]).map((p) => {
      if (p.phc_id === "PHC001" || p.phc_id === "PHC003") {
        return {
          ...p,
          beds_occupied: Math.min(p.beds_total, Math.round(p.beds_total * 0.95)),
          inventory: p.inventory.map((item) =>
            item.medicine_name.includes("ORS") || item.medicine_name.includes("Zinc")
              ? { ...item, quantity: Math.max(5, Math.round(item.quantity * 0.3)), daily_consumption_rate: item.daily_consumption_rate * 2.5 }
              : item
          ),
        };
      }
      return p;
    }),
  },
  {
    id: "dengue-outbreak",
    name: "Dengue & Febrile Cluster",
    tagline: "Platelet & Paracetamol Deficit",
    description: "Concentrated vector-borne spike at Laharpur & Khairabad. Paracetamol and IV saline fluids depleted to critical levels.",
    icon: "coronavirus",
    data: (defaultPhcs as PHC[]).map((p) => {
      if (p.phc_id === "PHC005" || p.phc_id === "PHC007") {
        return {
          ...p,
          beds_occupied: Math.min(p.beds_total, Math.round(p.beds_total * 0.92)),
          inventory: p.inventory.map((item) =>
            item.medicine_name.includes("Paracetamol") || item.medicine_name.includes("Saline")
              ? { ...item, quantity: 15, daily_consumption_rate: item.daily_consumption_rate * 3 }
              : item
          ),
        };
      }
      return p;
    }),
  },
];

export function NetworkDataProvider({ children }: { children: React.ReactNode }) {
  const [phcs, setPhcs] = useState<PHC[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return defaultPhcs as PHC[];
  });

  const [activePresetId, setActivePresetId] = useState<string>("sitapur-baseline");
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState<boolean>(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(phcs));
    } catch {
      // Ignore quota errors
    }
  }, [phcs]);

  // Enriched Computations
  const enrichedPHCs = useMemo(() => enrichAllPHCs(phcs), [phcs]);
  const summary = useMemo(() => getNetworkSummary(enrichedPHCs), [enrichedPHCs]);
  const alerts = useMemo(() => computeAlerts(phcs), [phcs]);
  const recommendations = useMemo(() => computeRedistributions(phcs), [phcs]);

  const uploadDataset = (importedData: PHC[]) => {
    if (!Array.isArray(importedData) || importedData.length === 0) return;
    setPhcs(importedData);
    setActivePresetId("custom");
  };

  const parseAndUploadCSV = (csvText: string): { success: boolean; count?: number; error?: string } => {
    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) {
        return { success: false, error: "CSV must contain a header and at least 1 data row." };
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const phcMap = new Map<string, Partial<PHC>>();

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",").map((col) => col.trim());
        if (!row[0]) continue;

        const record: Record<string, string> = {};
        headers.forEach((h, idx) => {
          record[h] = row[idx] || "";
        });

        const phcId = record["phc_id"] || `PHC-${String(phcMap.size + 1).padStart(3, "0")}`;
        const phcName = record["phc_name"] || `PHC ${phcId}`;
        const district = record["district"] || "Sitapur";
        const block = record["block"] || "Central";
        const lat = parseFloat(record["latitude"] || "27.57");
        const lon = parseFloat(record["longitude"] || "80.68");
        const bedsTotal = parseInt(record["beds_total"] || "20", 10);
        const bedsOccupied = parseInt(record["beds_occupied"] || "10", 10);
        const staffTotal = parseInt(record["staff_total"] || "6", 10);
        const staffPresent = parseInt(record["staff_present"] || "5", 10);

        if (!phcMap.has(phcId)) {
          phcMap.set(phcId, {
            phc_id: phcId,
            phc_name: phcName,
            district,
            block,
            latitude: lat,
            longitude: lon,
            beds_total: bedsTotal,
            beds_occupied: bedsOccupied,
            staff_total: staffTotal,
            staff_present: staffPresent,
            last_updated: new Date().toISOString(),
            inventory: [],
          });
        }

        // Add inventory item if columns exist
        const medName = record["medicine_name"];
        if (medName) {
          const qty = parseInt(record["quantity"] || "50", 10);
          const rate = parseFloat(record["daily_consumption_rate"] || "5");
          const threshold = parseInt(record["reorder_threshold"] || "20", 10);
          phcMap.get(phcId)!.inventory!.push({
            medicine_name: medName,
            quantity: qty,
            daily_consumption_rate: rate,
            reorder_threshold: threshold,
          });
        }
      }

      const parsedPHCs = Array.from(phcMap.values()) as PHC[];
      if (parsedPHCs.length === 0) {
        return { success: false, error: "No valid PHC rows found." };
      }

      // Ensure every PHC has at least standard inventory items if none specified
      parsedPHCs.forEach((p) => {
        if (!p.inventory || p.inventory.length === 0) {
          p.inventory = [
            { medicine_name: "ORS Sachets", quantity: 60, daily_consumption_rate: 6, reorder_threshold: 25 },
            { medicine_name: "Amoxicillin 500mg", quantity: 120, daily_consumption_rate: 10, reorder_threshold: 40 },
            { medicine_name: "Paracetamol", quantity: 200, daily_consumption_rate: 18, reorder_threshold: 60 },
          ];
        }
      });

      setPhcs(parsedPHCs);
      setActivePresetId("custom-csv");
      return { success: true, count: parsedPHCs.length };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to parse CSV." };
    }
  };

  const loadPreset = (presetId: string) => {
    const found = PRESET_SCENARIOS.find((s) => s.id === presetId);
    if (found) {
      setPhcs(found.data);
      setActivePresetId(found.id);
    }
  };

  const resetToDefault = () => {
    setPhcs(defaultPhcs as PHC[]);
    setActivePresetId("sitapur-baseline");
  };

  const updateInventoryItem = (
    phcId: string,
    medicineName: string,
    quantity: number,
    consumptionRate?: number
  ) => {
    setPhcs((prev) =>
      prev.map((p) => {
        if (p.phc_id !== phcId) return p;
        const exists = p.inventory.some((i) => i.medicine_name.toLowerCase() === medicineName.toLowerCase());
        let newInv = [...p.inventory];
        if (exists) {
          newInv = newInv.map((i) =>
            i.medicine_name.toLowerCase() === medicineName.toLowerCase()
              ? {
                  ...i,
                  quantity,
                  daily_consumption_rate: consumptionRate !== undefined ? consumptionRate : i.daily_consumption_rate,
                }
              : i
          );
        } else {
          newInv.push({
            medicine_name: medicineName,
            quantity,
            daily_consumption_rate: consumptionRate || 5,
            reorder_threshold: 30,
          });
        }
        return {
          ...p,
          inventory: newInv,
          last_updated: new Date().toISOString(),
        };
      })
    );
  };

  // Tour controls
  const startTour = () => {
    setIsTourActive(true);
    setTourStep(0);
  };
  const nextTourStep = () => setTourStep((s) => Math.min(s + 1, 3));
  const prevTourStep = () => setTourStep((s) => Math.max(s - 1, 0));
  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  return (
    <NetworkDataContext.Provider
      value={{
        phcs,
        enrichedPHCs,
        summary,
        alerts,
        recommendations,
        activePresetId,
        uploadDataset,
        parseAndUploadCSV,
        loadPreset,
        resetToDefault,
        updateInventoryItem,
        isDatasetModalOpen,
        openDatasetModal: () => setIsDatasetModalOpen(true),
        closeDatasetModal: () => setIsDatasetModalOpen(false),
        isPitchModalOpen,
        openPitchModal: () => setIsPitchModalOpen(true),
        closePitchModal: () => setIsPitchModalOpen(false),
        isTourActive,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        endTour,
      }}
    >
      {children}
    </NetworkDataContext.Provider>
  );
}

export function useNetworkData() {
  const context = useContext(NetworkDataContext);
  if (!context) {
    throw new Error("useNetworkData must be used within a NetworkDataProvider");
  }
  return context;
}
