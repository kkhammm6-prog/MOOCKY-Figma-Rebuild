"use client";

import { useState } from "react";
import { AuthenticatedHeaderControls } from "../components/AuthenticatedHeaderControls";
import { LumenIcon } from "../components/LumenIcon";
import { LogoMark } from "../components/LogoMark";
import { useThemeState } from "../hooks/useThemeState";

export default function SettingsPage() {
  const [theme, setTheme] = useThemeState();
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <main className={`prototype-page settings-page theme-${theme}`}>
      <header className={`marketing-header is-authenticated ${isSearchActive ? "is-searching" : ""}`}>
        <div className="marketing-header-inner">
          <div className="header-left">
            <a className="logo-lockup" href="/" aria-label="MOOCKY home"><LogoMark /></a>
            <a className="prototype-button prototype-button-ghost" href="/my-progress">
              <LumenIcon name="loader" />
              <span>MyProgress</span>
            </a>
          </div>
          <div className="header-actions">
            <AuthenticatedHeaderControls
              onSearchActiveChange={setIsSearchActive}
              onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
              theme={theme}
              themeToggleLabel={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            />
          </div>
        </div>
      </header>

      <section className="settings-shell" aria-labelledby="settings-title">
        <p className="settings-eyebrow">Profile preferences</p>
        <h1 id="settings-title">Your learning space</h1>
        <p className="settings-intro">A settings workspace is ready for the next implementation round. Your current profile drawer remains the fastest way to review learning activity.</p>
        <a className="settings-return" href="/my-progress">
          <LumenIcon name="arrow-left" />
          <span>Return to MyProgress</span>
        </a>
      </section>
    </main>
  );
}
