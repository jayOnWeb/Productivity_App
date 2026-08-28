import React, { useState } from "react";
import { createTask } from "../api/apiTask";
import { chatWithAI } from "../api/apiAI";

const AddTaskModal = ({ setShowModal, setTasks }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discription: "",
    status: "pending",
    priority: "medium",
    category: "work",
    dueDate: "",
    estimatedMinutes: 30,
  });
  const [aiLoading, setAiLoading] = useState(false);

  const handleAddTask = async () => {
    if (!formData.title.trim()) return;
    try {
      const res = await createTask({
        ...formData,
        description: formData.description || formData.discription,
      });
      setTasks((prev) => [res.task, ...prev]);
      setShowModal(false);
    } catch (error) {
      console.error("Task creation failed:", error);
    }
  };

  const handleAIEnhance = async () => {
    if (!formData.title.trim()) return;
    setAiLoading(true);
    try {
      const prompt = `Task Title: "${formData.title}". Please generate a clear 1-2 sentence task description and estimate duration in minutes.`;
      const res = await chatWithAI(prompt);
      setFormData((prev) => ({
        ...prev,
        description: res.reply,
        discription: res.reply,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-white text-sm font-semibold tracking-wide">New Task</h2>
          </div>
          <button onClick={() => setShowModal(false)} className="text-zinc-600 hover:text-zinc-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Title</label>
              {formData.title.trim() && (
                <button
                  type="button"
                  onClick={handleAIEnhance}
                  disabled={aiLoading}
                  className="text-[10px] text-violet-400 hover:underline flex items-center gap-1"
                >
                  ✨ {aiLoading ? "Generating..." : "AI Auto-Fill Description"}
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-800/60 border border-zinc-700/60 focus:border-violet-500 text-white placeholder-zinc-600 rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Description</label>
            <textarea
              placeholder="Add some details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value, discription: e.target.value })}
              rows={2}
              className="w-full bg-zinc-800/60 border border-zinc-700/60 focus:border-violet-500 text-white placeholder-zinc-600 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-zinc-800/60 border border-zinc-700/60 focus:border-violet-500 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-zinc-800/60 border border-zinc-700/60 focus:border-violet-500 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none capitalize"
              >
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="learning">📚 Learning</option>
                <option value="health">🏃 Health</option>
                <option value="finance">💰 Finance</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
          </div>

          {/* Due Date & Est. Minutes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-zinc-800/60 border border-zinc-700/60 focus:border-violet-500 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Est. Minutes</label>
              <input
                type="number"
                min="5"
                step="5"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-800/60 border border-zinc-700/60 focus:border-violet-500 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            disabled={!formData.title.trim()}
            className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-lg shadow-violet-900/30 disabled:opacity-50"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;