"use client";

import { useEffect, useState } from "react";

const DEMO_AUTH_KEY = "moocky-demo-authenticated-v1";

function readStoredAuthState() {
  return window.localStorage.getItem(DEMO_AUTH_KEY) === "true";
}

export function useDemoAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(readStoredAuthState());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === DEMO_AUTH_KEY) {
        setIsAuthenticated(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateAuthState = (nextState: boolean) => {
    setIsAuthenticated(nextState);
    window.localStorage.setItem(DEMO_AUTH_KEY, String(nextState));
  };

  return [isAuthenticated, updateAuthState] as const;
}
