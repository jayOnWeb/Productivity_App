import React, { useState } from "react";
import { createTask } from "../api/apiTask";

const AddTaskModal = ({ setShowModal, setTasks }) => {
  const [formData, setFormData] = useState({
    title: "",
    discription: "",
    status: "pending",
  });

  const handleAddTask = async () => {
    try {
      const res = await createTask(formData);
      setTasks((prev) => [res.task, ...prev]);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-white text-sm font-semibold tracking-wide">New Task</h2>
          </div>
          <button onClick={() => setShowModal(false)} className="text-zinc-600 hover:text-zinc-400 transition-colors duration-150">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Title</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-transparent border-b border-zinc-800 hover:border-zinc-700 focus:border-violet-500 text-white placeholder-zinc-700 py-2.5 text-sm focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Description</label>
            <textarea
              placeholder="Add some details..."
              value={formData.discription}
              onChange={(e) => setFormData({ ...formData, discription: e.target.value })}
              rows={3}
              className="w-full bg-transparent border-b border-zinc-800 hover:border-zinc-700 focus:border-violet-500 text-white placeholder-zinc-700 py-2.5 text-sm focus:outline-none transition-all duration-200 resize-none"
            />
          </div>

          {/* Status toggle */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Status</label>
            <div className="flex gap-2">
              {["pending", "working"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-150 border ${
                    formData.status === s
                      ? s === "pending"
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                        : "bg-violet-500/15 border-violet-500/30 text-violet-400"
                      : "bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                  }`}
                >
                  {s === "pending" ? "⏳ Pending" : "⚡ Working"}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-lg transition-all duration-150 shadow-lg shadow-violet-900/30"
          >
            Add Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddTaskModal;