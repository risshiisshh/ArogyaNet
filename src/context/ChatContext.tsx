import React, { createContext, useContext, useState, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: {
    type: "phc_ledger" | "redistribution" | "alerts";
    label: string;
    link: string;
    icon: string;
  }[];
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateLastAssistantMessage: (content: string, actions?: ChatMessage["actions"]) => void;
  clearMessages: () => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGE: ChatMessage = {
  id: "initial-assistant",
  role: "assistant",
  content:
    "Welcome to the **ArogyaNet Operational Copilot**. I am connected to real-time telemetry across all Primary Health Centres in Sitapur district.\n\nHow can I assist your clinical or supply chain decision-making today?",
  timestamp: "—",
  actions: [
    {
      type: "phc_ledger",
      label: "Inspect PHC Network",
      link: "/phc",
      icon: "inventory_2",
    },
    {
      type: "redistribution",
      label: "View Rebalancing Corridors",
      link: "/redistributions",
      icon: "local_shipping",
    },
  ],
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateLastAssistantMessage = useCallback((content: string, actions?: ChatMessage["actions"]) => {
    setMessages((prev) => {
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].role === "assistant") {
          updated[i] = {
            ...updated[i],
            content,
            ...(actions !== undefined ? { actions } : {}),
          };
          break;
        }
      }
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
    setMessages([INITIAL_MESSAGE]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        updateLastAssistantMessage,
        clearMessages,
        isStreaming,
        setIsStreaming,
        abortControllerRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
