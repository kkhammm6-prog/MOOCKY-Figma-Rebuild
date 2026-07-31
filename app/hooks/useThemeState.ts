"use client";

import { useEffect, useState } from "react";

export type AppTheme = "light" | "dark";

const THEME_KEY = "moocky-theme";

function readStoredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_KEY);
  return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
}

/**
 * Shared visual-preference state for all MOOCKY routes.
 *
 * The initial light value keeps the server and client render aligned; the saved
 * preference is restored immediately after the page mounts and is reused on the
 * next route visit.
 */
export function useThemeState() {
  const [theme, setTheme] = useState<AppTheme>("light");

  useEffect(() => {
    const restoreTheme = () => {
      const storedTheme = readStoredTheme();
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };

    restoreTheme();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY) {
        const storedTheme = event.newValue;
        if (storedTheme === "dark" || storedTheme === "light") {
          setTheme(storedTheme);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
  };

  return [theme, updateTheme] as const;
}
