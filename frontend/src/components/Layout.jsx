import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

const Layout = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const { accentStyle, accentText, accentBorder } = useSettings();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const userRes = await axios.get("http://localhost:3000/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserEmail(userRes.data.user.email);
        setUserName(userRes.data.user.name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: "Tasks",
      to: "/tasks",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Analytics",
      to: "/analytics",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "Profile",
      to: "/profile",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: "Settings",
      to: "/settings",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* SIDEBAR */}
      <div className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-4 fixed h-full">

        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-10">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={accentStyle}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight text-sm">FocusFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          <p className="text-zinc-600 text-xs uppercase tracking-widest font-medium px-2 mb-3">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
                    isActive
                      ? "border-opacity-20"
                      : "border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
                  }`}
                  style={isActive ? {
                    backgroundColor: `rgb(var(--accent-r) var(--accent-g) var(--accent-b) / 0.12)`,
                    color: `rgb(var(--accent-r) var(--accent-g) var(--accent-b))`,
                    borderColor: `rgb(var(--accent-r) var(--accent-g) var(--accent-b) / 0.25)`,
                  } : {}}
                >
                  {item.icon}
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 mt-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>

        {/* User pill */}
        <div className="mt-4 px-3 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/40 flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `rgb(var(--accent-r) var(--accent-g) var(--accent-b) / 0.25)`,
              borderWidth: "1px",
              borderColor: `rgb(var(--accent-r) var(--accent-g) var(--accent-b) / 0.35)`,
            }}
          >
            <span className="text-xs font-bold" style={accentText}>
              {userName ? userName[0].toUpperCase() : "U"}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-zinc-200 text-xs font-medium truncate">{userName ? userName : "User"}</p>
            <p className="text-zinc-600 text-xs truncate">{userEmail ? userEmail : "user@email.com"}</p>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-60 p-8 text-white min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;