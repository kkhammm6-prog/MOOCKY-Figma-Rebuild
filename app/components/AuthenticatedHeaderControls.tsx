"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { Button } from "./Button";
import { LumenIcon } from "./LumenIcon";

type AuthenticatedHeaderControlsProps = {
  onSearchActiveChange?: (active: boolean) => void;
  onThemeToggle: () => void;
  themeToggleLabel: string;
};

function HeaderSearchField({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedValue = value.trim();
  const expanded = isActive || value.length > 0;

  const updateActiveState = (nextState: boolean) => {
    setIsActive(nextState);
    onActiveChange?.(nextState);
  };

  const activate = () => {
    updateActiveState(true);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const deactivateIfEmpty = () => {
    if (trimmedValue.length > 0) {
      return;
    }

    updateActiveState(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (trimmedValue.length === 0) {
      activate();
      return;
    }

    window.location.href = `/ai?question=${encodeURIComponent(trimmedValue)}`;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") {
      return;
    }

    setValue("");
    updateActiveState(false);
    inputRef.current?.blur();
  };

  return (
    <form
      aria-label="MOOCKY AI search"
      className={`header-search-prompt header-search-form ${expanded ? "is-active" : ""} ${value.length > 0 ? "has-value" : ""}`}
      onClick={activate}
      onSubmit={submit}
      role="search"
    >
      <span className="header-search-icon">
        <LumenIcon name="search" />
      </span>
      <label className="sr-only" htmlFor="header-search-input">
        Tell us what you want to achieve
      </label>
      <input
        aria-label="Tell us what you want to achieve"
        id="header-search-input"
        onBlur={deactivateIfEmpty}
        onChange={(event) => setValue(event.currentTarget.value)}
        onFocus={activate}
        onKeyDown={handleKeyDown}
        placeholder="Tell us what you want to achieve"
        ref={inputRef}
        type="search"
        value={value}
      />
    </form>
  );
}

export function AuthenticatedHeaderControls({ onSearchActiveChange, onThemeToggle, themeToggleLabel }: AuthenticatedHeaderControlsProps) {
  return (
    <>
      <HeaderSearchField onActiveChange={onSearchActiveChange} />
      <div className="header-utility-panel" aria-label="Learning utilities" role="group">
        <button aria-label="Notifications" className="header-utility-button" type="button">
          <LumenIcon name="bell" />
        </button>
        <a aria-label="MOOCKY coins" className="header-utility-button" href="/redeem">
          <LumenIcon name="coins" />
        </a>
        <button aria-label={themeToggleLabel} className="header-utility-button" onClick={onThemeToggle} type="button">
          <LumenIcon name="eclipse" />
        </button>
      </div>
      <Button aria-label="Open learner profile" className="header-profile-action" icon="circle-user" kind="standaloneIcon" />
    </>
  );
}
