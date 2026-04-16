import React, { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [accent, setAccentState] = useState(localStorage.getItem("accent") || "violet");

  const setAccent = (newAccent) => {
    // Remove all accent classes
    ["violet", "blue", "emerald", "rose", "amber", "cyan"].forEach((a) => {
      document.documentElement.classList.remove(`accent-${a}`);
    });

    // Apply new accent class
    document.documentElement.classList.add(`accent-${newAccent}`);
    localStorage.setItem("accent", newAccent);
    setAccentState(newAccent);
  };

  // Apply on first load
  useEffect(() => {
    ["violet", "blue", "emerald", "rose", "amber", "cyan"].forEach((a) => {
      document.documentElement.classList.remove(`accent-${a}`);
    });
    document.documentElement.classList.add(`accent-${accent}`);
  }, []);

  // Helper — use this in components for accent color
  const accentStyle = {
    backgroundColor: `rgb(var(--accent-r) var(--accent-g) var(--accent-b))`,
  };

  const accentBorder = {
    borderColor: `rgb(var(--accent-r) var(--accent-g) var(--accent-b))`,
  };

  const accentText = {
    color: `rgb(var(--accent-r) var(--accent-g) var(--accent-b))`,
  };

  return (
    <SettingsContext.Provider value={{ accent, setAccent, accentStyle, accentBorder, accentText }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);