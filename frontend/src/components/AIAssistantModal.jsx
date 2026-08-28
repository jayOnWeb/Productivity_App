import React, { useState, useEffect, useRef } from "react";
import { chatWithAI, autoOrganizeTasks } from "../api/apiAI";
import { createTask } from "../api/apiTask";
import { useSettings } from "../context/SettingsContext";
import FormattedAIResponse from "./FormattedAIResponse";

const AIAssistantModal = ({ isOpen, onClose, onRefreshTasks }) => {
  const { accentText, accentStyle } = useSettings();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm **Focus AI**, your productivity assistant. Ask me anything, or tap a quick shortcut below to organize your day!",
      modelUsed: "Primary AI Engine",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await chatWithAI(query, history);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          modelUsed: res.modelUsed,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, I encountered an issue connecting to OpenRouter AI models. Please check your API key in Settings.",
          modelUsed: "Error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoOrganize = async () => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "⚡ Auto-organize my tasks using AI" },
    ]);

    try {
      const res = await autoOrganizeTasks();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ **Tasks Auto-Organized!**\n\nI evaluated your active workload and assigned priority levels, categories, and duration estimates.\n\nCheck your **Tasks** tab to see your newly prioritized workflow.`,
          modelUsed: res.modelUsed,
        },
      ]);
      if (onRefreshTasks) onRefreshTasks();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Auto-organize failed: " + (err.response?.data?.message || err.message),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={accentStyle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Focus AI Assistant</h3>
              <p className="text-[11px] text-zinc-400">OpenRouter AI • Multi-Model Backup Active</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 py-2 bg-zinc-950/60 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSendMessage("Suggest 3 high-impact tasks I should work on today.")}
            disabled={loading}
            className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:border-violet-500/50 text-[11px] text-zinc-300 whitespace-nowrap transition-all"
          >
            🚀 Suggest Next Tasks
          </button>
          <button
            onClick={handleAutoOrganize}
            disabled={loading}
            className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:border-violet-500/50 text-[11px] text-zinc-300 whitespace-nowrap transition-all"
          >
            ⚡ Auto-Prioritize
          </button>
          <button
            onClick={() => handleSendMessage("Give me a quick productivity tip for staying focused.")}
            disabled={loading}
            className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:border-violet-500/50 text-[11px] text-zinc-300 whitespace-nowrap transition-all"
          >
            🎯 Focus Tip
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white rounded-br-none shadow-md"
                    : "bg-zinc-800/90 text-zinc-200 border border-zinc-700/50 rounded-bl-none shadow-md"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                ) : (
                  <FormattedAIResponse content={msg.content} />
                )}

                {msg.modelUsed && msg.role === "assistant" && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-700/40 text-[10px] text-zinc-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Model: {msg.modelUsed}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
              Focus AI is processing via OpenRouter...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Focus AI for task help..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-zinc-800/80 border border-zinc-700/60 focus:border-violet-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-violet-900/20"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
