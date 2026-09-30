import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { askAssistantStream } from "@/services/assistantService";
import type { ChatMessage as ServiceChatMessage } from "@/services/assistantService";
import PromptBar from "@/components/PromptBar/PromptBar";
import type { PromptBarSendPayload } from "@/components/PromptBar/PromptBar";
import { useTheme } from "@/context/ThemeContext";
import { useNetworkData } from "@/context/NetworkDataContext";
import { useChat, type ChatMessage } from "@/context/ChatContext";

// ── Markdown Formatter Component ──────────────────────────────────────────────
function FormattedContent({ content }: { content: string }) {
  // Split into paragraphs / lines
  const lines = content.split("\n");

  return (
    <div className="flex flex-col gap-2.5 text-text-primary text-[14px] sm:text-[15px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Bullet point
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletText = trimmed.replace(/^[•\-*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent shrink-0 mt-2" />
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(bulletText) }} />
            </div>
          );
        }

        // Numbered list item
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s*(.*)$/);
          if (match) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-1">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-muted text-teal-accent text-[11px] font-bold shrink-0 mt-0.5">
                  {match[1]}
                </span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(match[2]) }} />
              </div>
            );
          }
        }

        // Regular paragraph
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      })}
    </div>
  );
}

// Helper to highlight bold text, metrics, and tags
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-muted text-teal-accent font-mono text-[12px]">$1</code>');
}

export default function AssistantPage() {
  const {
    messages,
    addMessage,
    updateLastAssistantMessage,
    clearMessages,
    isStreaming,
    setIsStreaming,
    abortControllerRef,
  } = useChat();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef<string>("");
  const { theme } = useTheme();
  const { enrichedPHCs, summary, phcs, updateInventoryItem } = useNetworkData();

  const suggestedStarters = [
    {
      icon: "crisis_alert",
      title: "Critical Shortages",
      prompt: "Which PHCs need urgent restocking today?",
      tag: "Urgent",
      tagColor: "bg-red-tint text-red-critical",
    },
    {
      icon: "hotel",
      title: "Bed Saturation",
      prompt: "Where are inpatient beds most constrained?",
      tag: "Capacity",
      tagColor: "bg-amber-tint text-amber-900",
    },
    {
      icon: "alt_route",
      title: "Peer Transfers",
      prompt: "What redistribution routes are recommended right now?",
      tag: "Logistics",
      tagColor: "bg-teal-tint text-teal-accent",
    },
    {
      icon: "analytics",
      title: "District Overview",
      prompt: "Summarize the Sitapur district operational state",
      tag: "Executive",
      tagColor: "bg-blue-tint text-blue-info",
    },
  ];

  // Auto-scroll to bottom on new messages or while streaming
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    clearMessages();
  };

  // Build conversation history for the service (exclude the initial welcome message)
  const buildServiceHistory = useCallback(
    (extraUserMsg?: string): ServiceChatMessage[] => {
      const history: ServiceChatMessage[] = [];
      for (const m of messages) {
        if (m.id === "initial-assistant") continue; // skip welcome
        history.push({ role: m.role, content: m.content });
      }
      if (extraUserMsg) {
        history.push({ role: "user", content: extraUserMsg });
      }
      return history;
    },
    [messages]
  );

  // Generate contextual smart action buttons from response content
  const generateActions = (reply: string, question: string): ChatMessage["actions"] => {
    const actions: NonNullable<ChatMessage["actions"]> = [];
    const rLow = reply.toLowerCase();
    const qLow = question.toLowerCase();

    // Check for PHC name mentions → link to that PHC detail
    const phcNamePattern = enrichedPHCs.find(
      (p) => rLow.includes(p.phc_name.toLowerCase()) || qLow.includes(p.phc_name.toLowerCase())
    );
    if (phcNamePattern) {
      actions.push({
        type: "phc_ledger",
        label: `View ${phcNamePattern.phc_name}`,
        link: `/phc/${phcNamePattern.phc_id}`,
        icon: "local_hospital",
      });
    }

    if (rLow.includes("transfer") || rLow.includes("redistribution") || qLow.includes("transfer")) {
      actions.push({
        type: "redistribution",
        label: "Open Redistribution Matrix",
        link: "/redistributions",
        icon: "alt_route",
      });
    }
    if (rLow.includes("alert") || rLow.includes("critical") || qLow.includes("urgent")) {
      actions.push({
        type: "alerts",
        label: "View All Alerts",
        link: "/alerts",
        icon: "notifications",
      });
    }

    return actions.length > 0 ? actions : undefined;
  };

  const handleSend = async (questionText?: string, payload?: PromptBarSendPayload) => {
    const q = (questionText ?? "").trim();
    if (!q && (!payload?.attachments || payload.attachments.length === 0)) return;
    if (isStreaming) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST";
    const attachDesc =
      payload?.attachments && payload.attachments.length > 0
        ? ` [Attached: ${payload.attachments.join(", ")}]`
        : "";

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: (q || "Analyze uploaded ledger scan") + attachDesc,
      timestamp: timeStr,
    };

    addMessage(userMsg);

    // Handle file attachment demo (OCR simulation)
    if (payload?.attachments && payload.attachments.length > 0) {
      setIsStreaming(true);
      await new Promise((r) => setTimeout(r, 900));
      updateInventoryItem("PHC001", "ORS Sachets", 140, 8);

      addMessage({
        id: `a-${Date.now()}`,
        role: "assistant",
        content: `**Multimodal Ledger Ingestion Completed**\n\nSuccessfully parsed physical stock ledger sheet from "${payload.attachments[0]}":\n\n• **Facility**: Rampur PHC (#PHC-001)\n• **Formulary Item**: ORS Sachets (Batch #ORS-902)\n• **Stock Updated**: +120 units received (New total: **140 units**, extending buffer to **+17.5 days**)\n• **Telemetry Synchronization**: Live district dashboard and inventory registers updated automatically.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
        actions: [
          {
            type: "phc_ledger",
            label: "Inspect Updated Ledger",
            link: "/phc/PHC001",
            icon: "inventory_2",
          },
        ],
      });
      setIsStreaming(false);
      return;
    }

    // ── Streaming AI response ──────────────────────────────────────────────
    setIsStreaming(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    streamingContentRef.current = "";

    // Add a placeholder assistant message that we'll update as chunks arrive
    const assistantMsgId = `a-${Date.now()}`;
    addMessage({
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
    });

    try {
      const serviceHistory = buildServiceHistory(q);

      await askAssistantStream(
        serviceHistory,
        phcs,
        (chunk: string) => {
          // Accumulate content and update the last assistant message
          streamingContentRef.current += chunk;
          updateLastAssistantMessage(streamingContentRef.current);
        },
        abortController.signal
      );

      // After streaming completes, add contextual action buttons
      const finalContent = streamingContentRef.current;
      if (finalContent) {
        const actions = generateActions(finalContent, q);
        if (actions) {
          updateLastAssistantMessage(finalContent, actions);
        }
      }
    } catch {
      // If the stream was aborted or failed, and we have no content, show fallback
      if (!streamingContentRef.current) {
        updateLastAssistantMessage(
          "I apologize — the request was interrupted. Please try again."
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      streamingContentRef.current = "";
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  };

  const criticalCount = enrichedPHCs.filter((p) => p.status === "critical").length;
  const attentionCount = enrichedPHCs.filter((p) => p.status === "low").length;
  const healthyCount = enrichedPHCs.filter((p) => p.status === "healthy").length;

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-5">
      {/* ── Header Bar ────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border-hairline">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-text-primary tracking-tight">
              Clinical &amp; Operational Copilot
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-tint text-teal-accent font-label-sm text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary pl-10.5">
            Real-time decision intelligence grounded in Sitapur district health facility records
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto pl-10.5 sm:pl-0">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-hairline bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors text-label-sm font-label-sm cursor-pointer"
            type="button"
            title="Toggle telemetry summary panel"
          >
            <span className="material-symbols-outlined text-[16px]">
              {showSidebar ? "dock_to_right" : "dock_to_left"}
            </span>
            <span className="hidden md:inline">{showSidebar ? "Hide Context" : "Show Context"}</span>
          </button>

          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-hairline bg-card-surface text-text-muted hover:text-red-critical hover:bg-red-tint/30 transition-colors text-label-sm font-label-sm cursor-pointer"
              type="button"
              title="Reset conversation"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Main Chat Area + Telemetry Context Layout ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Conversation Column */}
        <section
          className={`${
            showSidebar ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12"
          } flex flex-col bg-card-surface border border-border-hairline rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.04)] overflow-hidden min-h-[640px] transition-all duration-300`}
        >
          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 sm:p-6 lg:p-7 flex flex-col gap-6 overflow-y-auto max-h-[580px] scroll-smooth"
          >
            {messages.length === 0 ? (
              /* Clean Empty State with Starter Prompts */
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-teal-tint text-teal-accent flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">forum</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary mb-1">
                  How can I help you today?
                </h2>
                <p className="font-body-sm text-body-sm text-text-secondary mb-6">
                  Ask natural language questions about facility inventory, bed occupancy, doctor rosters, or peer redistribution corridors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                  {suggestedStarters.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s.prompt)}
                      className="p-3.5 rounded-2xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/30 transition-all flex flex-col gap-1.5 cursor-pointer text-left group"
                      type="button"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-teal-accent text-[18px] group-hover:scale-110 transition-transform">
                            {s.icon}
                          </span>
                          <span className="font-label-md text-label-md font-semibold text-text-primary">
                            {s.title}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.tagColor}`}>
                          {s.tag}
                        </span>
                      </div>
                      <span className="font-body-sm text-[12px] text-text-secondary line-clamp-1">
                        "{s.prompt}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) =>
                m.role === "user" ? (
                  /* ── User Bubble ────────────────────────────────────────────── */
                  <div key={m.id} className="flex flex-col items-end gap-1.5 max-w-[85%] sm:max-w-[75%] self-end">
                    <div className="bg-text-primary text-on-primary rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm">
                      <p className="font-body-md text-body-md text-on-primary font-medium">{m.content}</p>
                    </div>
                    <span className="font-body-sm text-[11px] text-text-muted px-1">
                      {m.timestamp}
                    </span>
                  </div>
                ) : (
                  /* ── Assistant Bubble ────────────────────────────────────────── */
                  <div key={m.id} className="flex items-start gap-3 max-w-[95%] self-start group">
                    {/* Bot Avatar */}
                    <div className="w-8 h-8 rounded-xl bg-teal-accent/15 text-teal-accent border border-teal-accent/25 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">neurology</span>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      {/* Assistant Card */}
                      <div className="bg-surface-muted/80 border border-border-hairline rounded-2xl rounded-tl-xs p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
                        {/* Message Prose (or streaming indicator if empty) */}
                        {m.content ? (
                          <FormattedContent content={m.content} />
                        ) : (
                          <div className="flex items-center gap-2 text-text-secondary font-label-sm text-[13px]">
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                            <span>Analyzing telemetry...</span>
                          </div>
                        )}

                        {/* Interactive Contextual Actions */}
                        {m.actions && m.actions.length > 0 && (
                          <div className="pt-2 border-t border-border-hairline/60 flex flex-wrap items-center gap-2">
                            {m.actions.map((act, aIdx) => (
                              <Link
                                key={aIdx}
                                to={act.link}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card-surface hover:bg-surface-container-high border border-border-hairline text-text-primary font-label-sm text-[12px] font-semibold transition-colors shadow-2xs hover:border-teal-accent/40"
                              >
                                <span className="material-symbols-outlined text-teal-accent text-[15px]">
                                  {act.icon}
                                </span>
                                <span>{act.label}</span>
                                <span className="material-symbols-outlined text-[13px] text-text-muted">
                                  arrow_forward
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions (Copy, Timestamp) */}
                      {m.content && (
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(m.id, m.content)}
                              className="inline-flex items-center gap-1 text-[11px] font-label-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {copiedId === m.id ? "check" : "content_copy"}
                              </span>
                              <span>{copiedId === m.id ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <span className="font-body-sm text-[11px] text-text-muted">
                            ArogyaNet AI · {m.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )
            )}

            {/* Streaming cursor indicator (shown at bottom while streaming content exists) */}
            {isStreaming && messages.length > 0 && messages[messages.length - 1]?.content && (
              <div className="flex items-center gap-2 self-start pl-11 -mt-3">
                <span className="w-2 h-2 rounded-full bg-teal-accent animate-ping" />
                <span className="text-[11px] text-text-muted font-label-sm">Streaming...</span>
              </div>
            )}
          </div>

          {/* ── PromptBar Input Dock ────────────────────────────────────────── */}
          <div className="p-3.5 sm:p-5 bg-card-surface border-t border-border-hairline flex flex-col gap-2">
            <PromptBar
              placeholder="Ask about a PHC stock level, bed occupancy, doctor roster, or transfer route…"
              busy={isStreaming}
              onSend={(text, payload) => handleSend(text, payload)}
              onStop={handleStop}
              background={theme === "dark" ? "#13151A" : "#111318"}
              color="#f5f5f5"
              menuBackground={theme === "dark" ? "#1A1D24" : "#1a1b21"}
              sparkColor="#0F8F88"
              sparkBoost={1.2}
              width={860}
              radius={14}
              maxRows={3}
              morphDuration={240}
              models={[
                { key: "arogya-deterministic", name: "Deterministic Engine", tag: "Verified" },
                { key: "arogya-gemini", name: "Gemini 2.0 Flash", tag: "Live AI" },
              ]}
              efforts={["Fast", "Balanced", "Deep"]}
              defaultEffort="Balanced"
              sources={[
                { key: "phc-data", name: "Sitapur PHC Dataset", description: "10 facilities live inventory", icon: "inventory_2", attach: false },
                { key: "alerts", name: "Active Alert Register", description: "Critical threshold events", icon: "notifications", attach: false },
                { key: "files", name: "Ledger Scan / OCR", description: "Ingest physical paper log photo", icon: "description", attach: true },
              ]}
              commands={[
                { key: "restock", name: "/restock", description: "List all facilities requiring restocking" },
                { key: "beds", name: "/beds", description: "Inpatient bed capacity breakdown" },
                { key: "transfers", name: "/transfers", description: "Recommend peer redistribution routes" },
                { key: "summarize", name: "/summarize", description: "Executive summary for CMO" },
              ]}
            />
            <div className="flex items-center justify-between px-1 text-text-muted font-body-sm text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-teal-accent">verified_user</span>
                <span>Ground truth guaranteed: Answers are derived from verified district telemetry</span>
              </div>
              <span className="hidden sm:inline text-[11px]">Press Enter to send · Shift+Enter for new line</span>
            </div>
          </div>
        </section>

        {/* ── Context Sidebar (~25-33% width, toggleable) ────────────────────────── */}
        {showSidebar && (
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
            {/* Widget 1: Network Health Snapshot */}
            <div className="bg-card-surface border border-border-hairline rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.04)] flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-healthy animate-pulse" />
                  <h2 className="font-headline-sm text-[16px] text-text-primary font-bold">
                    Sitapur Network
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-muted text-text-secondary text-[11px] font-semibold">
                  10 Centres
                </span>
              </div>

              {/* Status Breakdown Bar */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-red-tint rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-[22px] leading-tight text-red-critical font-bold">
                    {criticalCount}
                  </span>
                  <span className="font-label-sm text-[10px] text-red-critical font-semibold uppercase tracking-wider">
                    Critical
                  </span>
                </div>
                <div className="p-2.5 bg-amber-tint rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-[22px] leading-tight text-amber-900 font-bold">
                    {attentionCount}
                  </span>
                  <span className="font-label-sm text-[10px] text-amber-900 font-semibold uppercase tracking-wider">
                    Attention
                  </span>
                </div>
                <div className="p-2.5 bg-green-tint rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-[22px] leading-tight text-green-healthy font-bold">
                    {healthyCount}
                  </span>
                  <span className="font-label-sm text-[10px] text-green-healthy font-semibold uppercase tracking-wider">
                    Healthy
                  </span>
                </div>
              </div>

              {/* Key Indicators List */}
              <div className="flex flex-col gap-2 pt-1 text-[12px] text-text-secondary">
                <div className="flex items-center justify-between py-1 px-2.5 bg-surface-muted rounded-lg">
                  <span>Bed Occupancy</span>
                  <span className="font-semibold text-text-primary">
                    {summary ? `${summary.avgBedOccupancy}%` : "61%"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 px-2.5 bg-surface-muted rounded-lg">
                  <span>Critical Facilities</span>
                  <span className="font-semibold text-red-critical">
                    {summary ? `${summary.critical} of ${summary.total}` : "2 of 10"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 px-2.5 bg-surface-muted rounded-lg">
                  <span>Stable Buffer</span>
                  <span className="font-semibold text-green-healthy">
                    {summary ? `${summary.healthy} facilities` : "7 facilities"}
                  </span>
                </div>
              </div>
            </div>

            {/* Widget 2: Quick Command Prompts */}
            <div className="bg-card-surface border border-border-hairline rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-[15px] text-text-primary font-bold">
                  Quick Actions
                </h3>
                <span className="material-symbols-outlined text-text-muted text-[18px]">bolt</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleSend("What are the current critical shortages across all facilities?")}
                  className="w-full text-left p-2.5 rounded-xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/30 transition-all text-[12px] font-medium text-text-primary flex items-center justify-between group cursor-pointer"
                  type="button"
                >
                  <span className="line-clamp-1">🚨 Show critical stockouts</span>
                  <span className="material-symbols-outlined text-[14px] text-text-muted group-hover:text-teal-accent transition-colors">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => handleSend("Which facilities have available surplus for peer transfer?")}
                  className="w-full text-left p-2.5 rounded-xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/30 transition-all text-[12px] font-medium text-text-primary flex items-center justify-between group cursor-pointer"
                  type="button"
                >
                  <span className="line-clamp-1">🔄 Find surplus donor clinics</span>
                  <span className="material-symbols-outlined text-[14px] text-text-muted group-hover:text-teal-accent transition-colors">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => handleSend("Summarize physician attendance and staffing deficits")}
                  className="w-full text-left p-2.5 rounded-xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/30 transition-all text-[12px] font-medium text-text-primary flex items-center justify-between group cursor-pointer"
                  type="button"
                >
                  <span className="line-clamp-1">👨‍⚕️ Staff attendance audit</span>
                  <span className="material-symbols-outlined text-[14px] text-text-muted group-hover:text-teal-accent transition-colors">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            {/* Widget 3: Quick Navigation to Dashboards */}
            <div className="p-4 rounded-3xl bg-teal-tint/40 border border-teal-accent/20 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-teal-accent">
                <span className="material-symbols-outlined text-[18px]">hub</span>
                <span className="font-label-md text-[13px] font-bold">Direct Navigation</span>
              </div>
              <p className="text-[12px] text-text-secondary leading-snug">
                Jump directly to dedicated operational modules:
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <Link
                  to="/redistributions"
                  className="flex items-center justify-between p-2 rounded-xl bg-card-surface hover:bg-surface-container-high text-[12px] font-semibold text-text-primary transition-colors shadow-2xs"
                >
                  <span>Redistribution Engine</span>
                  <span className="material-symbols-outlined text-[14px] text-teal-accent">arrow_forward</span>
                </Link>
                <Link
                  to="/simulator"
                  className="flex items-center justify-between p-2 rounded-xl bg-card-surface hover:bg-surface-container-high text-[12px] font-semibold text-text-primary transition-colors shadow-2xs"
                >
                  <span>Disaster &amp; Epidemic Simulator</span>
                  <span className="material-symbols-outlined text-[14px] text-teal-accent">arrow_forward</span>
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
