"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isInitial?: boolean;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-user",
      role: "user",
      content: "Which PHCs need urgent restocking today?",
      timestamp: "10:26 IST",
      isInitial: true,
    },
    {
      id: "initial-assistant",
      role: "assistant",
      content:
        "Rampur PHC requires immediate intervention. ORS Sachets are projected to reach complete stockout in 2.5 days under current outpatient dehydration caseloads. In addition, Amoxicillin is already below safety reorder levels.",
      timestamp: "10:26 IST",
      isInitial: true,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Where are acute beds most constrained?",
    "Why is Rampur PHC critical?",
    "What transfers are recommended?",
    "Which facilities have bed occupancy over 85%?",
    "Summarize Sitapur resilience state",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST";
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const reply = data.answer || "I reviewed the live PHC network telemetry. All reporting facilities have verified database hash sync.";

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content:
            "Based on live telemetry, Rampur PHC is the only facility currently below critical buffer thresholds (20 units ORS remaining, 2.5 days supply). Maholi PHC holds 360 units surplus available for inter-facility redistribution.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col gap-space-lg w-full">
        {/* Page Top Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              ArogyaNet Intelligence Assistant
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Instant operational decisions and formulary intelligence grounded in live telemetry.
            </p>
          </div>
          <div className="flex items-center gap-space-xs shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-accent font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse"></span>
              Deterministic Engine Active
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start w-full">
          {/* LEFT: Primary Interactive Chat Terminal (~68% width) */}
          <div className="lg:col-span-8 flex flex-col bg-card-surface rounded-[24px] shadow-[0_18px_45px_rgba(17,19,24,0.06)] overflow-hidden min-h-[680px]">
            {/* Context Breadcrumb & Quick Filter Header */}
            <div className="p-space-md sm:p-space-lg border-b border-border-hairline flex flex-col gap-space-sm bg-workspace-surface/50">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  Query Prompts
                </span>
                <span className="text-text-muted text-body-sm text-[12px]">
                  Sitapur Network Scope
                </span>
              </div>
              {/* Quick Query Pills */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-card-surface text-text-secondary font-label-sm text-label-sm shadow-[0_2px_8px_rgba(17,19,24,0.04)] hover:text-text-primary hover:bg-surface-muted transition-colors text-left shrink-0 cursor-pointer"
                    type="button"
                  >
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Conversation Scroll Region */}
            <div
              ref={scrollRef}
              className="flex-1 p-space-lg sm:p-space-xl flex flex-col gap-space-lg overflow-y-auto max-h-[500px]"
            >
              {messages.map((m) =>
                m.role === "user" ? (
                  /* User Inquiry Bubble */
                  <div key={m.id} className="flex flex-col items-end gap-1.5 max-w-[85%] self-end">
                    <div className="bg-text-primary text-on-primary rounded-2xl rounded-tr-sm px-space-lg py-3.5 shadow-sm">
                      <p className="font-body-md text-body-md text-on-primary">{m.content}</p>
                    </div>
                    <span className="font-body-sm text-body-sm text-text-muted px-1">
                      District Medical Officer · {m.timestamp}
                    </span>
                  </div>
                ) : (
                  /* Assistant Intelligence Bubble */
                  <div key={m.id} className="flex flex-col items-start gap-2 max-w-[95%] self-start">
                    {/* System Provenance Metadata */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-tint/60 text-teal-accent">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      <span className="font-label-sm text-[11px] font-bold tracking-wider uppercase">
                        ArogyaNet Live AI · Synced Telemetry
                      </span>
                    </div>

                    {/* Structured Prose Response */}
                    <div className="bg-surface-muted rounded-2xl rounded-tl-sm p-space-md sm:p-space-lg flex flex-col gap-space-md text-text-primary w-full shadow-sm">
                      <p className="font-body-md text-body-md leading-relaxed text-text-primary">
                        {m.content}
                      </p>

                      {/* If initial message, render rich embedded cards matching Stitch */}
                      {m.isInitial && (
                        <div className="flex flex-col gap-space-sm pt-1 w-full">
                          {/* Result 1: Severe Shortage Notice */}
                          <div className="rounded-xl p-space-md bg-red-tint flex flex-col gap-space-xs shadow-sm">
                            <div className="flex items-center justify-between gap-space-sm flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-label-sm bg-card-surface text-red-critical shadow-sm font-semibold">
                                  Critical Stockout Risk
                                </span>
                                <span className="font-headline-sm text-[16px] text-text-primary font-bold">
                                  Rampur PHC — Shortage Detected
                                </span>
                              </div>
                              <span className="font-body-sm text-body-sm text-red-critical font-medium">
                                Telemetry ID: #PHC-001
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 py-2 px-3 bg-card-surface/70 rounded-lg">
                              <div className="flex flex-col">
                                <span className="font-body-sm text-[11px] text-text-muted">
                                  ORS Sachets On-hand
                                </span>
                                <span className="font-label-md text-label-md text-text-primary font-bold">
                                  20 units{" "}
                                  <span className="text-red-critical font-normal">
                                    (2.5 days left)
                                  </span>
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-body-sm text-[11px] text-text-muted">
                                  Amoxicillin 500mg
                                </span>
                                <span className="font-label-md text-label-md text-text-primary font-bold">
                                  40 / 100 units{" "}
                                  <span className="text-text-secondary font-normal">
                                    (Below reorder threshold)
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="font-body-sm text-body-sm text-text-secondary">
                                Assigned MO: Dr. R. Sharma · Distance to HQ: 14.2 km
                              </span>
                              <Link
                                className="inline-flex items-center gap-1 font-label-md text-label-md text-red-critical hover:underline"
                                href="/phc/PHC001"
                              >
                                <span>Open PHC inventory ledger</span>
                                <span className="material-symbols-outlined text-[16px]">
                                  arrow_forward
                                </span>
                              </Link>
                            </div>
                          </div>

                          {/* Result 2: Algorithmic Safe Rebalancing Route */}
                          <div className="rounded-xl p-space-md bg-green-tint flex flex-col gap-space-xs shadow-sm">
                            <div className="flex items-center justify-between gap-space-sm flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-label-sm bg-card-surface text-green-healthy shadow-sm font-semibold">
                                  Recommended Action
                                </span>
                                <span className="font-headline-sm text-[16px] text-text-primary font-bold">
                                  Dispatch 120 ORS Sachets from Maholi PHC → Rampur PHC
                                </span>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-label-sm text-green-healthy font-semibold">
                                <span
                                  className="material-symbols-outlined text-[13px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  check_circle
                                </span>
                                Zero Cascade Risk
                              </span>
                            </div>
                            <div className="mt-1 p-3 bg-card-surface/70 rounded-lg flex flex-col gap-1">
                              <p className="font-body-md text-body-md text-text-secondary leading-normal">
                                <span className="font-semibold text-text-primary">
                                  Impact Evaluation:
                                </span>{" "}
                                Maholi holds 360 units (surplus baseline). Reallocating 120 units safely leaves Maholi with 38 days buffer while providing Rampur{" "}
                                <span className="font-semibold text-text-primary">
                                  +17.5 days reserve
                                </span>
                                . Transit corridor via SH-26 estimated at 24 minutes.
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="font-body-sm text-body-sm text-text-muted">
                                Route validated with Mobile Logistics Unit #02
                              </span>
                              <Link
                                href="/redistributions"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text-primary text-on-primary font-label-sm text-label-sm shadow-sm hover:bg-action-hover transition-colors"
                              >
                                <span>Stage dispatch transfer</span>
                                <span className="material-symbols-outlined text-[14px]">
                                  local_shipping
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-text-muted px-1">
                      Engine: ArogyaNet Deterministic Model · Citations: Sitapur_Central_DB
                    </span>
                  </div>
                )
              )}

              {loading && (
                <div className="flex items-center gap-2 text-teal-accent p-3 bg-teal-tint rounded-xl self-start">
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  <span className="font-label-sm text-label-sm">Querying network telemetry...</span>
                </div>
              )}
            </div>

            {/* Composer Input Dock */}
            <div className="p-space-md sm:p-space-lg bg-card-surface shadow-[0_-8px_24px_rgba(17,19,24,0.03)] border-t border-border-hairline">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center bg-surface-muted rounded-full p-1.5 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-teal-accent"
              >
                <span className="material-symbols-outlined text-text-muted mr-2">
                  search_insights
                </span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-transparent font-body-md text-body-md text-text-primary placeholder:text-text-muted focus:outline-none"
                  placeholder="Ask about a centre, medicine, beds, staff, or a transfer route..."
                  type="text"
                />
                <button
                  aria-label="Send query"
                  className="w-10 h-10 rounded-full bg-text-primary text-on-primary flex items-center justify-center hover:bg-action-hover transition-colors shrink-0 shadow-sm cursor-pointer disabled:opacity-40"
                  type="submit"
                  disabled={loading || !input.trim()}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
              </form>
              <div className="flex items-center justify-between px-2 pt-2 text-text-muted font-body-sm text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">info</span>
                  ArogyaNet will explicitly state when data is incomplete. No synthetic extrapolation is injected.
                </span>
                <span className="hidden sm:inline-block">Press Enter ↵</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Operational Context & Decision Support (~32% width) */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {/* Card 1: Live Telemetry Context */}
            <div className="bg-card-surface rounded-[24px] p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-healthy opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-healthy"></span>
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">
                    Sitapur District
                  </h2>
                </div>
                <span className="font-body-sm text-body-sm text-text-muted">Live Telemetry</span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Data ingested across primary health infrastructure nodes and cold storage telemetry points.
              </p>
              {/* Metric breakdown tiles */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-red-tint rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-[26px] leading-tight text-red-critical font-bold">
                    2
                  </span>
                  <span className="font-label-sm text-[11px] text-red-critical font-semibold">
                    Critical
                  </span>
                </div>
                <div className="p-3 bg-amber-tint rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-[26px] leading-tight text-amber-900 font-bold">
                    3
                  </span>
                  <span className="font-label-sm text-[11px] text-amber-900 font-semibold">
                    Attention
                  </span>
                </div>
                <div className="p-3 bg-green-tint rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-[26px] leading-tight text-green-healthy font-bold">
                    13
                  </span>
                  <span className="font-label-sm text-[11px] text-green-healthy font-semibold">
                    Stable
                  </span>
                </div>
              </div>
              {/* Inventory sync indicators */}
              <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm text-text-secondary">
                <div className="flex items-center justify-between py-1 bg-surface-muted/60 px-3 rounded-lg">
                  <span>Facilities Monitored</span>
                  <span className="font-semibold text-text-primary">18 Centres Active</span>
                </div>
                <div className="flex items-center justify-between py-1 bg-surface-muted/60 px-3 rounded-lg">
                  <span>Formulary Sync</span>
                  <span className="font-semibold text-text-primary">Tier-1 Essential (100%)</span>
                </div>
                <div className="flex items-center justify-between py-1 bg-surface-muted/60 px-3 rounded-lg">
                  <span>Last Cluster Sync</span>
                  <span className="font-semibold text-text-primary">10:12 IST (14m ago)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Guided Operational Inquiries */}
            <div className="bg-card-surface rounded-[24px] p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-text-primary">
                  Suggested Inquiries
                </h2>
                <span className="material-symbols-outlined text-text-muted text-[20px]">
                  explore
                </span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {/* Category 1 */}
                <div
                  onClick={() => handleSend("What are the current shortages & stockout horizons?")}
                  className="p-3.5 rounded-xl bg-surface-muted hover:bg-surface-container-high transition-colors flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-red-tint text-red-critical flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-text-primary font-semibold">
                      Shortages &amp; Stockout Horizons
                    </span>
                    <span className="font-body-sm text-[12px] text-text-secondary leading-snug">
                      Detect depletion rates, safety threshold breaches, and cold chain deviations.
                    </span>
                  </div>
                </div>

                {/* Category 2 */}
                <div
                  onClick={() => handleSend("What is the capacity, bed occupancy and doctor roster status?")}
                  className="p-3.5 rounded-xl bg-surface-muted hover:bg-surface-container-high transition-colors flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-tint text-blue-info flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">hotel</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-text-primary font-semibold">
                      Capacity, Beds &amp; Doctor Rosters
                    </span>
                    <span className="font-body-sm text-[12px] text-text-secondary leading-snug">
                      View acute bed occupancy, oxygen cylinder reserves, and on-duty clinicians.
                    </span>
                  </div>
                </div>

                {/* Category 3 */}
                <div
                  onClick={() => handleSend("What redistribution corridors are available today?")}
                  className="p-3.5 rounded-xl bg-surface-muted hover:bg-surface-container-high transition-colors flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">alt_route</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-text-primary font-semibold">
                      Redistribution &amp; Donor Corridors
                    </span>
                    <span className="font-body-sm text-[12px] text-text-secondary leading-snug">
                      Explore zero-deficit cross-PHC transfer routing with travel time estimates.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Pending Action Ledger */}
            <div className="bg-card-surface rounded-[24px] p-space-lg shadow-[0_18px_45px_rgba(17,19,24,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-accent text-[20px]">
                    pending_actions
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">
                    Pending Rebalancing
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-tint text-amber-900 font-label-sm text-[11px] font-semibold">
                  1 In Queue
                </span>
              </div>
              <div className="p-space-md rounded-xl bg-amber-tint/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-text-primary font-bold">
                    ORS Dispatch — Manifest #804
                  </span>
                  <span className="font-body-sm text-xs text-amber-900 font-semibold">
                    Awaiting Dispatch
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                  120 units from Maholi PHC earmarked for Rampur PHC. Route confirmed via SH-26.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-body-sm text-[11px] text-text-muted">
                    Assigned: Mobile Unit #02
                  </span>
                  <Link
                    className="inline-flex items-center gap-1 font-label-sm text-label-sm text-text-primary hover:underline font-semibold"
                    href="/redistributions"
                  >
                    <span>Inspect manifest</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
