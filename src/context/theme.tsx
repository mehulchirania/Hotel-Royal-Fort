import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'rf_theme';

function readStoredTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch {
    // Private browsing / blocked storage — fall back to the OS preference.
    return null;
  }
}

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme() ?? (prefersDark() ? 'dark' : 'light')
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#16130f' : '#550a0a');

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Non-fatal: the theme still applies for this session.
    }
  }, [theme]);

  // Follow the OS only while the guest has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (!readStoredTheme()) setThemeState(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
