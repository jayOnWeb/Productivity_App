import React, { useState, useEffect } from "react";
import { breakdownTask } from "../api/apiAI";
import { updateTask, batchCreateTasks } from "../api/apiTask";

const AIBreakdownModal = ({ task, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [subtasks, setSubtasks] = useState([]);
  const [modelUsed, setModelUsed] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("attach"); // "attach" to parent task, or "separate" standalone tasks

  useEffect(() => {
    const runBreakdown = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await breakdownTask(task.title, task.description || task.discription || "");
        setSubtasks(res.subtasks.map((st) => ({ ...st, checked: true })));
        setModelUsed(res.modelUsed);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to generate AI breakdown");
      } finally {
        setLoading(false);
      }
    };
    if (task) runBreakdown();
  }, [task]);

  const handleSave = async () => {
    const selectedSubtasks = subtasks.filter((st) => st.checked);
    if (selectedSubtasks.length === 0) return onClose();

    try {
      if (mode === "attach") {
        const newSubtaskObjects = selectedSubtasks.map((st) => ({
          title: st.title,
          completed: false,
        }));
        const existing = task.subtasks || [];
        await updateTask(task._id, { subtasks: [...existing, ...newSubtaskObjects] });
      } else {
        const batchTasks = selectedSubtasks.map((st) => ({
          title: st.title,
          description: `Subtask of "${task.title}"`,
          priority: task.priority || "medium",
          category: task.category || "work",
          estimatedMinutes: st.estimatedMinutes || 15,
        }));
        await batchCreateTasks(batchTasks);
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save subtasks");
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">AI Task Breakdown</h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-xs">"{task.title}"</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mb-3" />
              <p className="text-sm font-medium text-zinc-300">Deconstructing task into actionable steps...</p>
              <p className="text-xs text-zinc-500 mt-1">Calling OpenRouter AI fallback chain</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              ⚠️ {error}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Select subtasks to include:</span>
                <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                  Model: {modelUsed}
                </span>
              </div>

              {/* Subtasks List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {subtasks.map((st, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSubtasks((prev) =>
                        prev.map((item, idx) => (idx === i ? { ...item, checked: !item.checked } : item))
                      );
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      st.checked
                        ? "bg-violet-950/20 border-violet-500/30 text-zinc-200"
                        : "bg-zinc-800/40 border-zinc-800 text-zinc-500 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={st.checked}
                        onChange={() => {}}
                        className="rounded border-zinc-700 text-violet-600 focus:ring-0"
                      />
                      <span className="text-xs font-medium">{st.title}</span>
                    </div>
                    {st.estimatedMinutes && (
                      <span className="text-[11px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                        ⏱ {st.estimatedMinutes}m
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Mode Selection */}
              <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                <span className="text-xs text-zinc-400 shrink-0">Save as:</span>
                <button
                  type="button"
                  onClick={() => setMode("attach")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    mode === "attach"
                      ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                      : "bg-zinc-800 border-zinc-700/50 text-zinc-400"
                  }`}
                >
                  Subchecklist on Task
                </button>
                <button
                  type="button"
                  onClick={() => setMode("separate")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    mode === "separate"
                      ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                      : "bg-zinc-800 border-zinc-700/50 text-zinc-400"
                  }`}
                >
                  Individual Tasks
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-800 bg-zinc-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || error || subtasks.filter((st) => st.checked).length === 0}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-900/30 transition-all disabled:opacity-50"
          >
            Save Subtasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIBreakdownModal;
