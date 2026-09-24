"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Hospital,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Commissioner. I am your ArogyaNet District Health Operations Assistant. I monitor real-time telemetry from all 18 PHCs in Sitapur and Hardoi. You can ask me about stock-outs, bed occupancy, staffing shortages, or inter-facility transfers.",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const suggestedQuestions = [
    "Which PHCs need urgent restocking today?",
    "Which facilities have bed occupancy above 85%?",
    "Where can we source surplus ORS sachets for Rampur PHC?",
    "Are there any PHCs with low staff attendance today?",
    "Summarize the district network resilience state.",
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const userMessage: Message = {
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      const botResponse: Message = {
        role: "assistant",
        content: data.answer || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error communicating with the surveillance engine.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#E7E9EE] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626875]">
              Operations Copilot
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7F7F5] text-[#0F8F88]">
              <Sparkles className="w-3.5 h-3.5" />
              Grounded on 18 PHC Telemetry Nodes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111318] tracking-tight">
            District Admin AI Assistant
          </h1>
          <p className="text-sm text-[#626875] max-w-3xl">
            Free-text operational question answering powered by Google Gemini and deterministic district health inventory computations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8F8FA] text-[#111318] text-xs font-bold border border-[#E7E9EE] hover:bg-[#EDEEF0] transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#D93838]" />
            <span>View Active Alerts</span>
          </Link>
        </div>
      </div>

      {/* Main Chat Layout (8 cols chat + 4 cols context sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Chat Stream */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-[#E7E9EE] shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, index) => {
              const isBot = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${isBot ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isBot
                        ? "bg-[#0F8F88] text-white shadow-sm"
                        : "bg-[#111318] text-white shadow-sm"
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                      isBot
                        ? "bg-[#F8F8FA] text-[#111318] border border-[#E7E9EE]"
                        : "bg-[#111318] text-white"
                    }`}
                  >
                    <div className="whitespace-pre-line font-medium">{msg.content}</div>
                    <div
                      className={`text-[10px] text-right ${
                        isBot ? "text-[#8D93A1]" : "text-white/60"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0F8F88] text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#F8F8FA] border border-[#E7E9EE] rounded-2xl px-4 py-3 text-xs text-[#626875] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0F8F88] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#0F8F88] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#0F8F88] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-semibold text-[#111318] ml-1">
                    Analyzing district network data...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Chip Bar */}
          <div className="px-6 py-2 bg-[#F8F8FA] border-t border-[#E7E9EE] overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#8D93A1] shrink-0">
              Suggestions:
            </span>
            {suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-[#626875] hover:text-[#111318] hover:border-[#111318] border border-[#E7E9EE] whitespace-nowrap shrink-0 transition-colors shadow-2xs"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input Box Bar */}
          <div className="p-4 bg-white border-t border-[#E7E9EE]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about facility inventory, bed occupancy, doctor rosters..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-[#F8F8FA] border border-[#E7E9EE] rounded-full px-5 py-3 text-xs text-[#111318] placeholder-[#8D93A1] focus:outline-none focus:ring-1 focus:ring-[#111318]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-full bg-[#111318] text-white flex items-center justify-center hover:bg-[#252830] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4 text-[#0F8F88]" />
              </button>
            </form>
          </div>
        </div>

        {/* Right 4 Cols: Grounding & Telemetry Context */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E9EE] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F8F88]" />
              <h3 className="font-extrabold text-sm text-[#111318]">
                Grounding Knowledge Source
              </h3>
            </div>

            <p className="text-xs text-[#626875] leading-relaxed">
              Responses are computed directly over the active 18 Primary Health Centre dataset from Sitapur &amp; Hardoi districts. Arithmetic is handled deterministically before model synthesis.
            </p>

            <div className="space-y-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] flex items-center justify-between">
                <span className="text-[#626875]">Monitored Facilities:</span>
                <span className="font-bold text-[#111318]">18 PHCs</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] flex items-center justify-between">
                <span className="text-[#626875]">Critical Stock Alert Nodes:</span>
                <span className="font-bold text-[#D93838]">4 PHCs</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F8FA] border border-[#E7E9EE] flex items-center justify-between">
                <span className="text-[#626875]">Average Inpatient Saturation:</span>
                <span className="font-bold text-[#111318]">61%</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/phc/PHC001"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#F8F8FA] text-[#111318] border border-[#E7E9EE] text-xs font-bold hover:bg-[#EDEEF0] transition-colors"
              >
                <Hospital className="w-3.5 h-3.5" />
                <span>Examine Rampur PHC Data</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
