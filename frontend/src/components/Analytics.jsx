import React, { useEffect, useState } from "react";
import { getTasks, getLogs } from "../api/apiTask";

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const taskData = await getTasks();
      setTasks(taskData.tasks);

      const logData = await getLogs();
      console.log("LOGS FROM BACKEND:", logData.logs); // 👈 add this
      setLogs(logData.logs);
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();
}, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const workingTasks = tasks.filter((t) => t.status === "working").length;
  const completedPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    { label: "Total Tasks", value: totalTasks, icon: "📋", color: "text-white" },
    { label: "Completed", value: completedTasks, icon: "✅", color: "text-emerald-400" },
    { label: "In Progress", value: workingTasks, icon: "⚡", color: "text-blue-400" },
    { label: "Completion Rate", value: `${completedPercent}%`, icon: "📈", color: "text-violet-400" },
  ];

  // ✅ Now using logs from backend — persistent across days
  const last7Days = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = date.toISOString().split("T")[0];

    const log = logs.find((l) => l.date === dateStr);
    return { day: dayLabel, completed: log?.completed || 0 };
  });

  const maxBar = totalTasks === 0 ? 1 : totalTasks;

  const statusBreakdown = [
    { label: "Completed", value: completedTasks, color: "bg-emerald-500", textColor: "text-emerald-400", pct: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100) },
    { label: "Working", value: workingTasks, color: "bg-blue-500", textColor: "text-blue-400", pct: totalTasks === 0 ? 0 : Math.round((workingTasks / totalTasks) * 100) },
    { label: "Pending", value: pendingTasks, color: "bg-amber-500", textColor: "text-amber-400", pct: totalTasks === 0 ? 0 : Math.round((pendingTasks / totalTasks) * 100) },
  ];

  let cumulativePct = 0;
  const donutGradient = [
    { pct: totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100, color: "#10b981" },
    { pct: totalTasks === 0 ? 0 : (workingTasks / totalTasks) * 100, color: "#3b82f6" },
    { pct: totalTasks === 0 ? 0 : (pendingTasks / totalTasks) * 100, color: "#f59e0b" },
  ].map((seg) => {
    const start = cumulativePct;
    cumulativePct += seg.pct;
    return `${seg.color} ${start}% ${cumulativePct}%`;
  }).join(", ");

  const conicStyle = totalTasks === 0
    ? { background: "#27272a" }
    : { background: `conic-gradient(${donutGradient})` };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-4 max-w-6xl mx-auto">

      {/* Header */}
      <div>
        <p className="text-zinc-500 text-sm mb-0.5">Insights & Trends</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold leading-tight ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">

        {/* Bar chart */}
        <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col min-h-0">
          <div className="mb-4 shrink-0">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">Productivity Trend</p>
            <h2 className="text-white text-sm font-semibold">Tasks Completed — Last 7 Days</h2>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-end">
            <div className="flex items-end gap-2 h-full">
              <div className="flex flex-col justify-between h-full pb-6 pr-1 shrink-0">
                {[maxBar, Math.ceil(maxBar / 2), 0].map((val) => (
                  <span key={val} className="text-zinc-700 text-xs">{val}</span>
                ))}
              </div>
              <div className="flex-1 flex items-end gap-2 h-full">
                {last7Days.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                    <span className="text-zinc-500 text-xs">{item.completed > 0 ? item.completed : ""}</span>
                    <div className="w-full flex items-end" style={{ height: "calc(100% - 32px)" }}>
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${(item.completed / maxBar) * 100}%`,
                          minHeight: item.completed > 0 ? "6px" : "2px",
                          background: item.completed > 0
                            ? "linear-gradient(to top, #7c3aed, #a78bfa)"
                            : "#27272a",
                        }}
                      />
                    </div>
                    <p className="text-zinc-600 text-xs">{item.day}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Donut */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center flex-1">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Status Breakdown</p>
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full" style={conicStyle} />
              <div className="absolute inset-3 bg-zinc-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-base">{completedPercent}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-4 w-full">
              {[
                { label: "Completed", color: "bg-emerald-500" },
                { label: "Working", color: "bg-blue-500" },
                { label: "Pending", color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex-1">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">Task Breakdown</p>
            <div className="space-y-3">
              {statusBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-400 text-xs">{item.label}</span>
                    <span className={`text-xs font-semibold ${item.textColor}`}>
                      {item.value} <span className="text-zinc-600 font-normal">({item.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-1 border-t border-zinc-800 flex justify-between text-xs">
                <span className="text-zinc-500">Total</span>
                <span className="text-white font-semibold">{totalTasks}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;