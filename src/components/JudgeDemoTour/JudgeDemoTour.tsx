import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNetworkData } from "@/context/NetworkDataContext";

const TOUR_STEPS = [
  {
    step: 0,
    title: "1. Public Health Telemetry Radar",
    badge: "Sitapur Network Radar",
    route: "/",
    description:
      "ArogyaNet continuously ingests live inventory velocity, acute bed occupancy, and physician attendance across 10 Sitapur PHCs. Notice critical early warnings flagged before stockouts occur.",
    actionText: "Inspect Rampur Shortage →",
    hint: "Notice the 84% Network Readiness index and live transport corridor map.",
  },
  {
    step: 1,
    title: "2. Facility Inventory Ledger",
    badge: "Facility Drilldown",
    route: "/phc/PHC001",
    description:
      "Rampur PHC is down to 20 units of ORS Sachets (2.5 days left at 8/day consumption). Traditional monthly reporting takes 2-3 weeks to flag this; ArogyaNet detected it in real time.",
    actionText: "View AI Rebalancing Corridors →",
    hint: "Check the 7-day stockout trajectory chart predicting depletion by Friday.",
  },
  {
    step: 2,
    title: "3. Gemini Zero-Deficit Rebalancing",
    badge: "AI Logistics Corridors",
    route: "/redistributions",
    description:
      "Rather than ordering emergency high-cost central stock, Gemini identifies donor clinics (Maholi holds 380 units surplus) and calculates a safe 120-unit transfer leaving both clinics protected.",
    actionText: "Launch Crisis Simulator →",
    hint: "Haversine routing calculates transit times (24 mins via SH-26) with zero cascade risk.",
  },
  {
    step: 3,
    title: "4. Epidemiological Stress Testing",
    badge: "Crisis Simulator",
    route: "/simulator",
    description:
      "Stress-test district resilience against Monsoon Flash Floods, Highway Supply Shocks, and Dengue Outbreaks. Watch dynamic reallocation and bed overflow mitigations in action.",
    actionText: "Explore BRICS Framework →",
    hint: "Try toggling the Flood scenario to simulate acute ORS/IV dehydration surges.",
  },
  {
    step: 4,
    title: "5. Global South Replication",
    badge: "BRICS Innovation Hub",
    route: "/brics",
    description:
      "ArogyaNet's frugal operational model is designed for cross-border adaptation across rural South Africa, Brazil, and fellow Global South healthcare systems.",
    actionText: "Try AI Operational Copilot →",
    hint: "Review cross-border transferability metrics and policy briefing templates.",
  },
  {
    step: 5,
    title: "6. Autonomous Operational Copilot",
    badge: "Conversational Intelligence",
    route: "/assistant",
    description:
      "Healthcare commissioners query the copilot in natural language or ingest handwritten paper logbooks via OCR. Grounded in verified Sitapur telemetry with zero synthetic hallucinations.",
    actionText: "Complete Judge Walkthrough",
    hint: "Click any quick prompt or upload a formulary scan to test real-time reasoning.",
  },
];

export function JudgeDemoTour() {
  const { isTourActive, tourStep, nextTourStep, prevTourStep, endTour } = useNetworkData();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        endTour();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTourActive, tourStep]);

  if (!isTourActive) return null;

  const current = TOUR_STEPS[tourStep] || TOUR_STEPS[0];

  const handleNext = () => {
    if (tourStep >= TOUR_STEPS.length - 1) {
      endTour();
    } else {
      const nextStepIndex = tourStep + 1;
      nextTourStep();
      const nextStep = TOUR_STEPS[nextStepIndex];
      if (nextStep && location.pathname !== nextStep.route) {
        navigate(nextStep.route);
      }
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      const prevStepIndex = tourStep - 1;
      prevTourStep();
      const prevStep = TOUR_STEPS[prevStepIndex];
      if (prevStep && location.pathname !== prevStep.route) {
        navigate(prevStep.route);
      }
    }
  };

  const handleJumpToStep = (index: number) => {
    const target = TOUR_STEPS[index];
    if (target) {
      if (location.pathname !== target.route) {
        navigate(target.route);
      }
      // Set step index by stepping
      const diff = index - tourStep;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) nextTourStep();
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) prevTourStep();
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full px-4 sm:px-0 animate-bounce-in">
      <div className="bg-card-surface/95 backdrop-blur-xl border-2 border-teal-accent rounded-3xl p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] flex flex-col gap-3.5">
        {/* Step Indicator Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-accent"></span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-tint text-teal-accent font-label-sm text-[11px] font-bold uppercase tracking-wider">
              {current.badge}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-xs text-text-muted font-medium">
              Step {tourStep + 1} of {TOUR_STEPS.length}
            </span>
            <button
              onClick={endTour}
              aria-label="Exit walkthrough"
              className="w-6 h-6 rounded-full hover:bg-surface-muted flex items-center justify-center text-text-muted hover:text-text-primary text-xs font-bold transition-colors cursor-pointer"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div>
          <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
            {current.title}
          </h3>
          <p className="font-body-sm text-body-sm text-text-secondary mt-1.5 leading-relaxed">
            {current.description}
          </p>
          {current.hint && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-surface-muted/80 border border-border-hairline/60 flex items-center gap-2 text-[12px] text-text-secondary">
              <span className="material-symbols-outlined text-teal-accent text-[16px]">lightbulb</span>
              <span>{current.hint}</span>
            </div>
          )}
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5 my-0.5">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === tourStep
                  ? "w-8 bg-teal-accent"
                  : idx < tourStep
                  ? "w-3 bg-teal-accent/50 hover:bg-teal-accent"
                  : "w-3 bg-surface-muted hover:bg-text-muted"
              }`}
              type="button"
              title={`Jump to Step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-border-hairline">
          <button
            onClick={handlePrev}
            disabled={tourStep === 0}
            className={`px-3 py-1.5 rounded-full font-label-sm text-xs transition-colors cursor-pointer ${
              tourStep === 0
                ? "opacity-30 cursor-not-allowed text-text-muted"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted hidden sm:inline">Use ← → keys</span>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-full bg-teal-accent text-white font-label-md text-xs font-bold shadow-md hover:bg-teal-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span>{current.actionText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
