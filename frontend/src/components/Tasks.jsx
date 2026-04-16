import React, { useEffect, useState } from 'react'
import { getTasks, deleteTask, updateTask } from '../api/apiTask'
import AddTaskModal from '../components/AddTaskModal'

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data.tasks);
      } catch (error) { console.log(error); }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) { console.log(error); }
  };

  const handleMarkCompleted = async (task) => {
    try {
      const updated = await updateTask(task._id, { toggle: true });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated.task : t)));
    } catch (error) { console.log(error); }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending": return { style: "bg-amber-500/10 text-amber-400 border border-amber-500/20", dot: "bg-amber-400", label: "Pending" };
      case "working": return { style: "bg-blue-500/10 text-blue-400 border border-blue-500/20", dot: "bg-blue-400", label: "Working" };
      case "completed": return { style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", dot: "bg-emerald-400", label: "Completed" };
      default: return { style: "bg-zinc-800 text-zinc-400 border border-zinc-700", dot: "bg-zinc-400", label: status };
    }
  };

  const filters = [
    { key: "all", label: "All", count: tasks.length },
    { key: "pending", label: "Pending", count: tasks.filter((t) => t.status === "pending").length },
    { key: "working", label: "Working", count: tasks.filter((t) => t.status === "working").length },
    { key: "completed", label: "Completed", count: tasks.filter((t) => t.status === "completed").length },
  ];

  const filteredTasks = tasks
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) =>
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.discription?.toLowerCase().includes(search.toLowerCase())
    );

  const completedPercent = tasks.length === 0 ? 0 : Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      {showModal && <AddTaskModal setShowModal={setShowModal} setTasks={setTasks} />}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-sm mb-1">Manage your work</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-all duration-150 shadow-lg shadow-violet-900/30"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-xs">Overall Progress</span>
            <span className="text-zinc-400 text-xs font-medium">{completedPercent}% complete</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-700"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 text-white placeholder-zinc-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all duration-200"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              filter === f.key
                ? "bg-violet-600/15 text-violet-400 border border-violet-500/20"
                : "text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-800"
            }`}
          >
            {f.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.key ? "bg-violet-500/20 text-violet-400" : "bg-zinc-800 text-zinc-600"}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-zinc-500 text-sm font-medium">
            {search ? `No tasks matching "${search}"` : "No tasks here"}
          </p>
          <p className="text-zinc-700 text-xs mt-1">
            {search ? "Try a different search term" : "Add a new task to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            const isExpanded = expandedId === task._id;
            const createdAt = new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

            return (
              <div
                key={task._id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  task.status === "completed"
                    ? "bg-zinc-800/20 border-zinc-800/60"
                    : isExpanded
                    ? "bg-zinc-900 border-violet-500/30"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {/* Collapsed row — always visible */}
                <div
                  className="flex items-center gap-4 px-4 py-3.5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : task._id)}
                >
                  {/* Checkbox */}
                  <div
                    onClick={(e) => { e.stopPropagation(); handleMarkCompleted(task); }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                      task.status === "completed"
                        ? "bg-violet-600 border-violet-600"
                        : "border-zinc-600 hover:border-violet-500"
                    }`}
                  >
                    {task.status === "completed" && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Title */}
                  <p className={`flex-1 text-sm font-medium truncate ${task.status === "completed" ? "line-through text-zinc-600" : "text-zinc-100"}`}>
                    {task.title}
                  </p>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${statusConfig.style}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                    {statusConfig.label}
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-zinc-600 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-800/60">

                    {/* Description */}
                    <div className="pt-4 mb-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Description</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {task.discription || <span className="text-zinc-700 italic">No description added.</span>}
                      </p>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <p className="text-xs text-zinc-600 uppercase tracking-wider mb-0.5">Created</p>
                        <p className="text-xs text-zinc-400">{createdAt}</p>
                      </div>
                      <div className="w-px h-6 bg-zinc-800" />
                      <div>
                        <p className="text-xs text-zinc-600 uppercase tracking-wider mb-0.5">Status</p>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium w-fit ${statusConfig.style}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/60">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkCompleted(task); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                          task.status === "completed"
                            ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                            : "bg-violet-600/15 text-violet-400 border border-violet-500/20 hover:bg-violet-600/25"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {task.status === "completed" ? "Mark Incomplete" : "Mark Complete"}
                      </button>

                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/60 text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10 border border-zinc-700/40 transition-all duration-150"
                        title="Edit task"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/60 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-700/40 transition-all duration-150 ml-auto"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Tasks