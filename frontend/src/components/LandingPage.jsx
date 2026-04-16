import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-16">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-zinc-100 font-semibold tracking-tight text-sm">FocusFlow</span>
        </div>

        {/* Motivational Quote */}
        <div className="mb-12">
          <span className="text-violet-500 text-xs uppercase tracking-[0.3em] font-medium mb-4 block">Daily Reminder</span>
          <blockquote className="text-3xl font-bold text-white tracking-tight leading-snug">
            "Small steps taken daily <br />
            <span className="text-violet-400">build empires over time.</span>"
          </blockquote>
          <p className="text-zinc-600 text-sm mt-4">— consistency beats intensity, always.</p>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gradient-to-b from-zinc-700 to-transparent mb-12" />

        {/* Headline */}
        <div className="mb-10">
          <h1 className="text-lg font-semibold text-zinc-300 tracking-tight">
            Your productivity, <span className="text-white">finally under control.</span>
          </h1>
          <p className="text-zinc-600 text-sm mt-2">Track tasks, build habits, and stay focused — every single day.</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <Link
            to="/register"
            className="flex-1 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold rounded-xl px-4 py-3 text-sm text-center transition-all duration-200 shadow-lg shadow-violet-900/30"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="flex-1 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-300 hover:text-white font-semibold rounded-xl px-4 py-3 text-sm text-center transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Bottom note */}
        <p className="text-zinc-700 text-xs mt-8">Free to use. No credit card required.</p>

      </div>
    </div>
  )
}

export default LandingPage