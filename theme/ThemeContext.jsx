import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
const ThemeCtx = createContext(null);
export const useTheme = () => useContext(ThemeCtx);

const getInitial = () => JSON.parse(localStorage.getItem('ui_prefs') || 'null') || {
  theme: 'dark', accent: '#6ee7b7', accent2: '#60a5fa'
};

export default function ThemeProvider({ children }) {
  const [prefs, setPrefs] = useState(getInitial);
  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-theme', prefs.theme);
    r.style.setProperty('--accent', prefs.accent);
    r.style.setProperty('--accent-2', prefs.accent2);
    localStorage.setItem('ui_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const value = useMemo(() => ({
    theme: prefs.theme,
    toggleTheme: () => setPrefs(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))
  }), [prefs]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
