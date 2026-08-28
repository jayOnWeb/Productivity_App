import React, { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../api/apiTask";
import { autoOrganizeTasks } from "../api/apiAI";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import AIBreakdownModal from "../components/AIBreakdownModal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [breakdownTask, setBreakdownTask] = useState(null);

  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [aiOrganizing, setAiOrganizing] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkCompleted = async (task) => {
    try {
      const updated = await updateTask(task._id, { toggle: true });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated.task : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleSubtask = async (task, subtaskIndex) => {
    const updatedSubtasks = task.subtasks.map((st, i) =>
      i === subtaskIndex ? { ...st, completed: !st.completed } : st
    );
    try {
      const updated = await updateTask(task._id, { subtasks: updatedSubtasks });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated.task : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAutoOrganize = async () => {
    setAiOrganizing(true);
    try {
      const res = await autoOrganizeTasks();
      if (res.tasks) setTasks(res.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setAiOrganizing(false);
    }
  };

  const getPriorityBadge = (priority = "medium") => {
    switch (priority) {
      case "urgent":
        return { label: "Urgent", style: "bg-red-500/10 text-red-400 border-red-500/30" };
      case "high":
        return { label: "High", style: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "medium":
        return { label: "Medium", style: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      case "low":
        return { label: "Low", style: "bg-zinc-800 text-zinc-400 border-zinc-700" };
      default:
        return { label: priority, style: "bg-zinc-800 text-zinc-400 border-zinc-700" };
    }
  };

  const getCategoryIcon = (cat = "work") => {
    switch (cat) {
      case "work": return "💼";
      case "personal": return "🏠";
      case "learning": return "📚";
      case "health": return "🏃";
      case "finance": return "💰";
      default: return "📌";
    }
  };

  // Filtering & Sorting
  const filteredTasks = tasks
    .filter((t) => statusFilter === "all" || t.status === statusFilter)
    .filter((t) => categoryFilter === "all" || (t.category || "work") === categoryFilter)
    .filter((t) =>
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || t.discription || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "priority") {
        const pMap = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (pMap[b.priority || "medium"] || 2) - (pMap[a.priority || "medium"] || 2);
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const completedPercent =
    tasks.length === 0
      ? 0
      : Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showAddModal && <AddTaskModal setShowModal={setShowAddModal} setTasks={setTasks} />}
      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onRefresh={fetchTasks} />
      )}
      {breakdownTask && (
        <AIBreakdownModal task={breakdownTask} onClose={() => setBreakdownTask(null)} onRefresh={fetchTasks} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-xs mb-0.5">Focus & Execution</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks Management</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoOrganize}
            disabled={aiOrganizing}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-violet-300 text-xs font-semibold rounded-xl border border-violet-500/30 transition-all"
          >
            ✨ {aiOrganizing ? "Organizing..." : "AI Auto-Prioritize"}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-violet-900/30"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-xs font-medium">Completion Rate</span>
            <span className="text-violet-400 text-xs font-bold">{completedPercent}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls Bar: Search, Category, Status, Sort */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-500 text-white placeholder-zinc-500 rounded-xl px-4 py-2 text-xs focus:outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="createdAt">Sort: Created Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="dueDate">Sort: Due Date</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
            {["all", "pending", "working", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  statusFilter === st
                    ? "bg-violet-600 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-2.5 py-1 focus:outline-none capitalize"
            >
              <option value="all">All Categories</option>
              <option value="work">💼 Work</option>
              <option value="personal">🏠 Personal</option>
              <option value="learning">📚 Learning</option>
              <option value="health">🏃 Health</option>
              <option value="finance">💰 Finance</option>
              <option value="other">📌 Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 text-sm font-medium">No matching tasks found</p>
          <p className="text-zinc-600 text-xs mt-1">Try adjusting your filter or create a new task.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isExpanded = expandedId === task._id;
            const pBadge = getPriorityBadge(task.priority);
            const isDone = task.status === "completed";

            const completedSubtaskCount = (task.subtasks || []).filter((st) => st.completed).length;
            const totalSubtaskCount = (task.subtasks || []).length;

            return (
              <div
                key={task._id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDone
                    ? "bg-zinc-950/40 border-zinc-900 opacity-75"
                    : isExpanded
                    ? "bg-zinc-900 border-violet-500/40"
                    : "bg-zinc-900/90 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {/* Main Row */}
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : task._id)}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkCompleted(task);
                    }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isDone ? "bg-violet-600 border-violet-600" : "border-zinc-600 hover:border-violet-500"
                    }`}
                  >
                    {isDone && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{getCategoryIcon(task.category)}</span>
                      <p className={`text-sm font-medium truncate ${isDone ? "line-through text-zinc-500" : "text-zinc-100"}`}>
                        {task.title}
                      </p>
                    </div>

                    {totalSubtaskCount > 0 && (
                      <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                        <span>Checklist: {completedSubtaskCount}/{totalSubtaskCount} subtasks done</span>
                      </div>
                    )}
                  </div>

                  {/* Priority Badge */}
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${pBadge.style}`}>
                    {pBadge.label}
                  </span>

                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-800/80 pt-3 space-y-3">
                    {/* Description */}
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Description</p>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap">
                        {task.description || task.discription || <span className="text-zinc-600 italic">No description provided.</span>}
                      </p>
                    </div>

                    {/* Subtasks Checklist */}
                    {totalSubtaskCount > 0 && (
                      <div className="space-y-1 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                        <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">Subtasks</p>
                        {task.subtasks.map((st, i) => (
                          <div
                            key={i}
                            onClick={() => handleToggleSubtask(task, i)}
                            className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer hover:text-white"
                          >
                            <input
                              type="checkbox"
                              checked={st.completed}
                              readOnly
                              className="rounded border-zinc-700 text-violet-600 focus:ring-0"
                            />
                            <span className={st.completed ? "line-through text-zinc-500" : ""}>{st.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 pt-1">
                      {task.dueDate && (
                        <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      {task.estimatedMinutes && (
                        <span>⏱ Est: {task.estimatedMinutes} mins</span>
                      )}
                      <span>Category: {task.category || "work"}</span>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setBreakdownTask(task)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-semibold rounded-lg border border-violet-500/20 transition-all"
                      >
                        ✨ AI Breakdown
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingTask(task)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(task._id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;