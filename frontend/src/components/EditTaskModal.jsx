import React, { useState } from "react";
import { updateTask } from "../api/apiTask";

const EditTaskModal = ({ task, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || task.discription || "",
    status: task.status || "pending",
    priority: task.priority || "medium",
    category: task.category || "work",
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    estimatedMinutes: task.estimatedMinutes || 30,
    subtasks: task.subtasks || [],
  });
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setFormData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { title: newSubtaskTitle.trim(), completed: false }],
    }));
    setNewSubtaskTitle("");
  };

  const handleRemoveSubtask = (index) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const handleToggleSubtask = (index) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((st, i) =>
        i === index ? { ...st, completed: !st.completed } : st
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);

    try {
      await updateTask(task._id, formData);
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-white text-sm font-semibold">Edit Task</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 focus:border-violet-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 focus:border-violet-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none capitalize"
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

          {/* Due Date & Est. Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Est. Time (mins)</label>
              <input
                type="number"
                min="5"
                step="5"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-2 border-t border-zinc-800">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
              Subtasks ({formData.subtasks.filter((st) => st.completed).length}/{formData.subtasks.length})
            </label>

            <div className="space-y-1.5 mb-2">
              {formData.subtasks.map((st, idx) => (
                <div key={idx} className="flex items-center justify-between bg-zinc-800/50 px-3 py-1.5 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(idx)}
                      className="rounded border-zinc-700 text-violet-600 focus:ring-0"
                    />
                    <span className={st.completed ? "line-through text-zinc-500" : "text-zinc-200"}>{st.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(idx)}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-900/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
