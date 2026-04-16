import React, { useState } from 'react'
import { useSettings } from '../context/SettingsContext'

const Settings = () => {
  const { theme, setTheme, accent, setAccent } = useSettings();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const themes = [
    {
      key: "dark",
      label: "Dark",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      key: "light",
      label: "Light",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
    },
    {
      key: "system",
      label: "System",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const accents = [
    { key: "violet", label: "Violet", color: "bg-violet-500", ring: "ring-violet-500" },
    { key: "blue", label: "Blue", color: "bg-blue-500", ring: "ring-blue-500" },
    { key: "emerald", label: "Emerald", color: "bg-emerald-500", ring: "ring-emerald-500" },
    { key: "rose", label: "Rose", color: "bg-rose-500", ring: "ring-rose-500" },
    { key: "amber", label: "Amber", color: "bg-amber-500", ring: "ring-amber-500" },
    { key: "cyan", label: "Cyan", color: "bg-cyan-500", ring: "ring-cyan-500" },
  ];

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-zinc-500 text-sm mb-1">Preferences</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
      </div>

      <div className="space-y-4">

        {/* Theme */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Appearance</h2>
            <p className="text-zinc-500 text-xs mt-1">Choose how FocusFlow looks for you</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-150 ${
                  theme === t.key
                    ? "bg-violet-600/10 border-violet-500/30 text-violet-400"
                    : "bg-zinc-800/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                {t.icon}
                <span className="text-xs font-medium">{t.label}</span>
                {theme === t.key && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Accent Color</h2>
            <p className="text-zinc-500 text-xs mt-1">Pick your preferred highlight color</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {accents.map((a) => (
              <button
                key={a.key}
                onClick={() => setAccent(a.key)}
                title={a.label}
                className={`w-8 h-8 rounded-full ${a.color} transition-all duration-150 ${
                  accent === a.key
                    ? `ring-2 ring-offset-2 ring-offset-zinc-900 ${a.ring} scale-110`
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-zinc-600 text-xs">Selected:</span>
            <span className="text-zinc-300 text-xs font-medium capitalize">{accent}</span>
          </div>
        </div>

        {/* About */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">About</h2>
          <div className="space-y-3">
            {[
              { label: "App", value: "FocusFlow" },
              { label: "Version", value: "1.0.0" },
              { label: "Build", value: "Production" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-zinc-500 text-sm">{item.label}</span>
                <span className="text-zinc-300 text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
            <p className="text-zinc-500 text-xs mt-1">These actions are permanent and cannot be undone</p>
          </div>

          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <div>
                <p className="text-sm font-medium text-zinc-300">Delete Account</p>
                <p className="text-xs text-zinc-600 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-lg transition-all duration-150"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-400">Are you absolutely sure?</p>
                  <p className="text-xs text-zinc-500 mt-1">Type <span className="text-zinc-300 font-mono">DELETE</span> to confirm</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Type DELETE to confirm"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-700 focus:border-red-500 text-white placeholder-zinc-700 py-2 text-sm focus:outline-none transition-all duration-200"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteInput !== "DELETE"}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                    deleteInput === "DELETE"
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Settings