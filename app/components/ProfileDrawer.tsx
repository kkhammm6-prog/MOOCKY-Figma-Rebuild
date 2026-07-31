"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LumenIcon } from "./LumenIcon";
import type { AppTheme } from "../hooks/useThemeState";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
};

const learningStats = [
  { label: "Active courses", value: "4" },
  { label: "Learning hours", value: "184.5" },
  { label: "Current streak", value: "7 days" },
];

const activeCourses = [
  { progress: 68, title: "Nature Architecture", meta: "Module 3 · next: Regenerative Spatial Strategy" },
  { progress: 42, title: "Ethics in AI Governance", meta: "Module 3 · next: Global Policy" },
];

const achievements = [
  { icon: "badge-check" as const, label: "Systems thinker", detail: "Completed 6 learning frameworks" },
  { icon: "sparkle" as const, label: "Focused learner", detail: "Seven-day learning streak" },
];

export function ProfileDrawer({ isOpen, onClose, theme }: ProfileDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="profile-drawer-layer" data-testid="profile-drawer-layer">
      <button aria-label="Close learner profile" className="profile-drawer-backdrop" onClick={onClose} type="button" />
      <aside aria-label="Learner profile" aria-modal="true" className={`profile-drawer theme-${theme}`} role="dialog">
        <div className="profile-drawer-topbar">
          <span>Profile</span>
          <button aria-label="Close learner profile" className="profile-drawer-close" onClick={onClose} ref={closeButtonRef} type="button">
            <LumenIcon name="x" />
          </button>
        </div>

        <div className="profile-drawer-scroll">
          <section className="profile-identity" aria-labelledby="profile-name">
            <div className="profile-avatar" aria-hidden="true">AL</div>
            <div>
              <p className="profile-eyebrow">MOOCKY learner</p>
              <h2 id="profile-name">Avery Lin</h2>
              <p>AI product designer · cognitive systems learner</p>
            </div>
          </section>

          <section className="profile-section" aria-labelledby="learning-pulse-title">
            <div className="profile-section-heading">
              <p id="learning-pulse-title">Learning pulse</p>
              <span>This month</span>
            </div>
            <div className="profile-stat-grid">
              {learningStats.map((stat) => (
                <div className="profile-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section" aria-labelledby="continue-learning-title">
            <div className="profile-section-heading">
              <p id="continue-learning-title">Continue learning</p>
              <a href="/my-progress">View all</a>
            </div>
            <div className="profile-course-list">
              {activeCourses.map((course) => (
                <a className="profile-course" href="/my-progress" key={course.title}>
                  <div>
                    <strong>{course.title}</strong>
                    <span>{course.meta}</span>
                  </div>
                  <div aria-label={`${course.title} ${course.progress}% complete`} className="profile-progress" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={course.progress}>
                    <span style={{ "--profile-progress": `${course.progress}%` } as CSSProperties} />
                  </div>
                  <small>{course.progress}% complete</small>
                </a>
              ))}
            </div>
          </section>

          <section className="profile-section" aria-labelledby="achievement-title">
            <div className="profile-section-heading">
              <p id="achievement-title">Recent achievements</p>
              <a href="/my-progress#achievements">All achievements</a>
            </div>
            <div className="profile-achievement-list">
              {achievements.map((achievement) => (
                <div className="profile-achievement" key={achievement.label}>
                  <span className="profile-achievement-icon"><LumenIcon name={achievement.icon} /></span>
                  <div>
                    <strong>{achievement.label}</strong>
                    <span>{achievement.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section" aria-labelledby="saved-title">
            <div className="profile-section-heading">
              <p id="saved-title">Saved interests</p>
              <span>6 topics</span>
            </div>
            <div className="profile-interest-list">
              <span>AI systems</span>
              <span>Regenerative design</span>
              <span>Learning science</span>
            </div>
          </section>
        </div>

        <div className="profile-drawer-footer">
          <a className="profile-settings-link" href="/settings">
            <LumenIcon name="settings" />
            <span>Profile & settings</span>
            <LumenIcon name="arrow-right" />
          </a>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
