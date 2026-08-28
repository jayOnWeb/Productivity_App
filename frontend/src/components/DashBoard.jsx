import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, getTasks, updateTask, createTask } from "../api/apiTask";
import { getAISuggestions } from "../api/apiAI";
import AddTaskModal from "../components/AddTaskModal";
import AIAssistantModal from "../components/AIAssistantModal";
import axios from "axios";
import { useSettings } from "../context/SettingsContext";

const DashBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

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

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
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
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFetchAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await getAISuggestions();
      setAiSuggestions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAddSuggestedTask = async (sTask) => {
    try {
      const res = await createTask({
        title: sTask.title,
        description: sTask.description,
        priority: sTask.priority || "high",
        category: sTask.category || "work",
      });
      setTasks((prev) => [res.task, ...prev]);
      // Remove from suggestions array UI
      setAiSuggestions((prev) => ({
        ...prev,
        suggestedTasks: prev.suggestedTasks.filter((t) => t.title !== sTask.title),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkCompleted = async (task) => {
    try {
      const updated = await updateTask(task._id, { toggle: true });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated.task : t)));
    } catch (error) {
      console.log(error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const urgentCount = tasks.filter((t) => t.priority === "urgent" && t.status !== "completed").length;

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
      if (diff === 0 || diff === 1) {
        streak++;
        currentDate = taskDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak(tasks);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {showModal && <AddTaskModal setShowModal={setShowModal} setTasks={setTasks} />}
      <AIAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onRefreshTasks={fetchDashboardData}
      />

      {/* Header with AI Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-500 text-sm mb-1">{formattedDate}</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {getGreeting()}, {user?.name || "User"} 👋
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-900/30 transition-all"
          >
            ✨ Open Focus AI Assistant
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: totalTasks, icon: "📋" },
          { label: "Completed", value: completedTasks, icon: "🎯" },
          { label: "Urgent Priority", value: urgentCount, icon: "🔴" },
          { label: "Streak", value: `${streak} Days`, icon: "🔥" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-base">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* AI Smart Suggestions Card */}
      <div className="bg-gradient-to-r from-violet-950/40 via-zinc-900 to-zinc-900 border border-violet-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Productivity Coach</h3>
              <p className="text-[11px] text-zinc-400">Powered by OpenRouter Multi-Tier AI</p>
            </div>
          </div>

          <button
            onClick={handleFetchAISuggestions}
            disabled={loadingSuggestions}
            className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-semibold rounded-lg border border-violet-500/30 transition-all"
          >
            {loadingSuggestions ? "Analyzing..." : "Generate AI Suggestions"}
          </button>
        </div>

        {aiSuggestions ? (
          <div className="space-y-4">
            <p className="text-xs text-zinc-300 italic bg-zinc-950/50 p-3 rounded-xl border border-zinc-800">
              💡 "{aiSuggestions.insights}"
            </p>

            {aiSuggestions.suggestedTasks?.length > 0 && (
              <div>
                <p className="text-[11px] text-zinc-400 uppercase font-semibold tracking-wider mb-2">
                  Recommended Tasks for You:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {aiSuggestions.suggestedTasks.map((sTask, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                          {sTask.priority}
                        </span>
                        <h4 className="text-xs font-semibold text-white mt-1.5 truncate">{sTask.title}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{sTask.description}</p>
                      </div>

                      <button
                        onClick={() => handleAddSuggestedTask(sTask)}
                        className="mt-3 w-full py-1 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold rounded-lg transition-all"
                      >
                        + Add to Tasks
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiSuggestions.tip && (
              <div className="text-xs text-violet-300 bg-violet-950/30 border border-violet-500/20 p-3 rounded-xl flex items-center gap-2">
                <span>🎯</span>
                <span><strong>Pro Tip:</strong> {aiSuggestions.tip}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-400">
            Click "Generate AI Suggestions" to receive tailored task recommendations and insights from Focus AI.
          </p>
        )}
      </div>

      {/* Recent Tasks List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Tasks</h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-semibold text-violet-400 hover:underline"
          >
            + Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">No active tasks. Start by adding one above!</p>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleMarkCompleted(task)}
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      task.status === "completed" ? "bg-violet-600 border-violet-600" : "border-zinc-600"
                    }`}
                  >
                    {task.status === "completed" && <span className="text-white text-[10px]">✓</span>}
                  </button>
                  <span className={`text-xs font-medium ${task.status === "completed" ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                    {task.title}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded capitalize">
                  {task.priority || "medium"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;