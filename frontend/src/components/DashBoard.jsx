import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, getTasks, updateTask } from "../api/apiTask";
import AddTaskModal from "../components/AddTaskModal";
import axios from "axios";
import { useSettings } from "../context/SettingsContext";

const DashBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { accentStyle, accentText } = useSettings();

  const accentBg = `rgb(var(--accent-r) var(--accent-g) var(--accent-b) / 0.12)`;
  const accentBorder = `rgb(var(--accent-r) var(--accent-g) var(--accent-b) / 0.25)`;
  const accentFull = `rgb(var(--accent-r) var(--accent-g) var(--accent-b))`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        const userRes = await axios.get("http://localhost:3000/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);
        const data = await getTasks();
        setTasks(data.tasks);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else { console.log(err); }
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) { console.log(error); }
  };

  const handleMarkCompleted = async (task) => {
    try {
      const updated = await updateTask(task._id, { toggle: true });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated.task : t)));
    } catch (error) { console.log(error); }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const today = new Date();

  const calculateStreak = (tasks) => {
    const completed = tasks.filter((t) => t.status === "completed");
    const dates = completed.map((t) => new Date(t.updatedAt).toDateString());
    const uniqueDates = [...new Set(dates)];
    uniqueDates.sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < uniqueDates.length; i++) {
      const taskDate = new Date(uniqueDates[i]);
      taskDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((currentDate - taskDate) / (1000 * 60 * 60 * 24));
      if (diff === 0 || diff === 1) { streak++; currentDate = taskDate; } else { break; }
    }
    return streak;
  };

  const streak = calculateStreak(tasks);

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending": return { style: "bg-amber-500/10 text-amber-400 border border-amber-500/20", dot: "bg-amber-400", label: "Pending" };
      case "working": return { style: "bg-blue-500/10 text-blue-400 border border-blue-500/20", dot: "bg-blue-400", label: "Working" };
      case "completed": return { style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", dot: "bg-emerald-400", label: "Completed" };
      default: return { style: "bg-zinc-800 text-zinc-400 border border-zinc-700", dot: "bg-zinc-400", label: status };
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {showModal && <AddTaskModal setShowModal={setShowModal} setTasks={setTasks} />}

      {/* Header */}
      <div className="mb-10">
        <p className="text-zinc-500 text-sm mb-1">{formattedDate}</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {getGreeting()}, {user?.name || "User"} 👋
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Tasks Today", value: totalTasks, icon: "✅" },
          { label: "Completed", value: completedTasks, icon: "🎯" },
          { label: "Streak", value: `${streak} Days`, icon: "🔥" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
            <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-zinc-300 text-sm font-medium mb-1">No tasks yet</p>
          <p className="text-zinc-600 text-xs mb-6 max-w-xs">You're all clear — add your first task and start building momentum.</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 border text-white text-xs font-medium rounded-lg transition-all duration-200"
            style={{ borderColor: accentBorder, backgroundColor: accentBg, ...accentText }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add your first task
          </button>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Recent Tasks</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer active:scale-95"
              style={accentText}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              return (
                <div
                  key={task._id}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-150 ${
                    task.status === "completed"
                      ? "bg-zinc-800/20 border-zinc-800/60"
                      : "bg-zinc-800/30 border-zinc-700/40 hover:border-zinc-600/60"
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    onClick={() => handleMarkCompleted(task)}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer"
                    style={
                      task.status === "completed"
                        ? { backgroundColor: accentFull, borderColor: accentFull }
                        : { borderColor: "#52525b" }
                    }
                  >
                    {task.status === "completed" && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "completed" ? "line-through text-zinc-600" : "text-zinc-100"}`}>
                        {task.title}
                      </p>
                      {task.discription && (
                        <p className={`text-xs mt-0.5 truncate ${task.status === "completed" ? "line-through text-zinc-700" : "text-zinc-500"}`}>
                          {task.discription}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${statusConfig.style}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className="p-1.5 rounded-lg text-zinc-600 transition-all duration-150"
                      title="Edit task"
                      onMouseEnter={e => { e.currentTarget.style.color = accentFull; e.currentTarget.style.backgroundColor = `${accentFull}18`; }}
                      onMouseLeave={e => { e.currentTarget.style.color = ""; e.currentTarget.style.backgroundColor = ""; }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                      title="Delete task"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;