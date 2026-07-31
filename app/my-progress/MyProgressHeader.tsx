"use client";

import { useState } from "react";
import { AuthenticatedHeaderControls } from "../components/AuthenticatedHeaderControls";
import { LumenIcon } from "../components/LumenIcon";
import { LogoMark } from "../components/LogoMark";
import type { AppTheme } from "../hooks/useThemeState";

export function MyProgressHeader({ theme, onThemeToggle }: { theme: AppTheme; onThemeToggle: () => void }) {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className={`marketing-header is-authenticated ${isSearchActive ? "is-searching" : ""}`}>
      <div className="marketing-header-inner">
        <div className="header-left">
          <a className="logo-lockup" href="/" aria-label="MOOCKY home">
            <LogoMark />
          </a>
          <a className="prototype-button prototype-button-ghost" href="/my-progress" aria-current="page">
            <LumenIcon name="loader" />
            <span>MyProgress</span>
          </a>
        </div>
        <div className="header-actions">
          <AuthenticatedHeaderControls
            onSearchActiveChange={setIsSearchActive}
            onThemeToggle={onThemeToggle}
            themeToggleLabel={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          />
        </div>
      </div>
    </header>
  );
}
