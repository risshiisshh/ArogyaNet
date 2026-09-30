import { useState, useRef } from "react";
import { useNetworkData, PRESET_SCENARIOS } from "@/context/NetworkDataContext";

export function DatasetModal() {
  const {
    isDatasetModalOpen,
    closeDatasetModal,
    phcs,
    activePresetId,
    loadPreset,
    resetToDefault,
    uploadDataset,
    parseAndUploadCSV,
  } = useNetworkData();

  const [dragActive, setDragActive] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isDatasetModalOpen) return null;

  const handleFile = (file: File) => {
    setFeedback(null);
    const reader = new FileReader();

    if (file.name.endsWith(".json")) {
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            uploadDataset(parsed);
            setFeedback({ type: "success", message: `Successfully loaded ${parsed.length} facilities from JSON!` });
          } else {
            setFeedback({ type: "error", message: "JSON file must contain an array of PHC objects." });
          }
        } catch {
          setFeedback({ type: "error", message: "Invalid JSON format." });
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".csv") || file.type === "text/csv") {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const res = parseAndUploadCSV(text);
        if (res.success) {
          setFeedback({ type: "success", message: `Successfully loaded ${res.count} facilities from CSV!` });
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to parse CSV." });
        }
      };
      reader.readAsText(file);
    } else {
      setFeedback({ type: "error", message: "Please upload a .json or .csv health record file." });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent =
      "phc_id,phc_name,district,block,latitude,longitude,beds_total,beds_occupied,staff_total,staff_present,medicine_name,quantity,daily_consumption_rate,reorder_threshold\n" +
      "PHC001,Rampur PHC,Sitapur,Central,27.57,80.68,20,18,6,4,ORS Sachets,20,8,30\n" +
      "PHC001,Rampur PHC,Sitapur,Central,27.57,80.68,20,18,6,4,Amoxicillin 500mg,40,15,50\n" +
      "PHC002,Maholi PHC,Sitapur,North,27.65,80.47,25,12,8,7,ORS Sachets,360,9,40\n" +
      "PHC002,Maholi PHC,Sitapur,North,27.65,80.47,25,12,8,7,Amoxicillin 500mg,240,12,40\n" +
      "PHC003,Biswan PHC,Sitapur,South-East,27.48,80.99,30,28,10,6,ORS Sachets,45,14,35\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "arogyanet_sample_phc_dataset.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card-surface w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-border-hairline flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border-hairline pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">dataset</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-text-primary">
                Dataset &amp; Crisis Scenario Manager
              </h3>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Load preset resilience stress-tests or upload custom district telemetry.
              </p>
            </div>
          </div>
          <button
            onClick={closeDatasetModal}
            className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2 text-sm font-label-md ${
              feedback.type === "success"
                ? "bg-green-tint text-green-healthy"
                : "bg-red-tint text-red-critical"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Section 1: Pre-Bundled Crisis Scenarios */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
              1. One-Click Crisis Presets
            </span>
            <button
              onClick={resetToDefault}
              className="text-xs font-label-sm text-teal-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[13px]">restart_alt</span>
              <span>Reset to Baseline</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_SCENARIOS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    loadPreset(preset.id);
                    setFeedback({ type: "success", message: `Activated ${preset.name} scenario!` });
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal-tint/50 border-teal-accent ring-2 ring-teal-accent/20"
                      : "bg-surface-muted border-border-hairline hover:border-text-muted/40 hover:bg-surface-muted/80"
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-teal-accent text-xl">
                      {preset.icon}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-accent text-white text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md font-bold text-text-primary">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-text-secondary leading-snug mt-1">
                      {preset.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Drag & Drop Custom File Upload */}
        <div className="flex flex-col gap-3">
          <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
            2. Upload Custom Health Records (CSV / JSON)
          </span>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              dragActive
                ? "border-teal-accent bg-teal-tint/30"
                : "border-border-hairline bg-surface-muted hover:bg-surface-muted/80"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-full bg-card-surface flex items-center justify-center text-teal-accent shadow-sm">
              <span className="material-symbols-outlined text-2xl">upload_file</span>
            </div>
            <div>
              <p className="font-label-md text-label-md text-text-primary font-bold">
                Drop your CSV or JSON file here, or <span className="text-teal-accent">browse</span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                Supports HMIS, e-Aushadhi, or standard ArogyaNet PHC telemetry formats
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Currently Loaded: <strong>{phcs.length} Facilities</strong></span>
            <button
              onClick={downloadSampleCSV}
              className="inline-flex items-center gap-1 text-teal-accent hover:underline font-semibold cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download sample CSV template</span>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
          <button
            onClick={closeDatasetModal}
            className="px-5 py-2.5 rounded-full bg-text-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-action-hover transition-colors cursor-pointer"
            type="button"
          >
            Done &amp; Apply Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
