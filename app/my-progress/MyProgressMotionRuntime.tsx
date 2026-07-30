"use client";

import { useEffect } from "react";

const countSelector = "[data-count-value]";
const progressSelector = "[data-progress-motion]";
const ringSelector = "[data-ring-motion]";
const countDurationMs = 900;
const ringFillDurationMs = 860;
const progressFillFallbackDelayMs = 80;
const progressFillSettleDelayMs = 60;

type CountTarget = {
  decimals: number;
  suffix: string;
  target: number;
};

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function readCountTarget(element: HTMLElement): CountTarget | null {
  const target = Number.parseFloat(element.dataset.countValue ?? "");

  if (!Number.isFinite(target)) {
    return null;
  }

  return {
    decimals: Number.parseInt(element.dataset.countDecimals ?? "0", 10) || 0,
    suffix: element.dataset.countSuffix ?? "",
    target,
  };
}

function readRingTarget(element: HTMLElement) {
  const target = Number.parseFloat(element.dataset.ringValue ?? "");

  return Number.isFinite(target) ? target : null;
}

function setCountText(element: HTMLElement, count: CountTarget, progressValue: number) {
  element.textContent = `${progressValue.toLocaleString("en-US", {
    maximumFractionDigits: count.decimals,
    minimumFractionDigits: count.decimals,
  })}${count.suffix}`;
}

function readMotionMs(styles: CSSStyleDeclaration, name: string, fallbackMs: number) {
  const value = styles.getPropertyValue(name).trim();

  if (value.endsWith("ms")) {
    return Number.parseFloat(value) || fallbackMs;
  }

  if (value.endsWith("s")) {
    return (Number.parseFloat(value) || fallbackMs / 1000) * 1000;
  }

  return fallbackMs;
}

export function MyProgressMotionRuntime() {
  useEffect(() => {
    const countElements = Array.from(document.querySelectorAll<HTMLElement>(countSelector));
    const progressElements = Array.from(document.querySelectorAll<HTMLElement>(progressSelector));
    const ringElements = Array.from(document.querySelectorAll<HTMLElement>(ringSelector));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rootStyles = window.getComputedStyle(document.documentElement);
    const revealDurationMs = readMotionMs(rootStyles, "--section-reveal-duration", 300);
    const animationFrames = new Map<HTMLElement, number>();
    const countTimers = new Map<HTMLElement, number>();
    const progressTimers = new Map<HTMLElement, number>();
    const ringFrames = new Map<HTMLElement, number>();
    const ringTimers = new Map<HTMLElement, number>();
    const playedElements = new Set<HTMLElement>();

    const cancelCount = (element: HTMLElement) => {
      const frame = animationFrames.get(element);

      if (frame) {
        window.cancelAnimationFrame(frame);
        animationFrames.delete(element);
      }
    };

    const resetCount = (element: HTMLElement) => {
      const count = readCountTarget(element);
      const timer = countTimers.get(element);

      if (!count) {
        return;
      }

      if (timer) {
        window.clearTimeout(timer);
        countTimers.delete(element);
      }

      cancelCount(element);
      setCountText(element, count, 0);
    };

    const finishCount = (element: HTMLElement) => {
      const count = readCountTarget(element);

      if (!count) {
        return;
      }

      cancelCount(element);
      setCountText(element, count, count.target);
    };

    const animateCount = (element: HTMLElement) => {
      const count = readCountTarget(element);

      if (!count) {
        return;
      }

      if (prefersReducedMotion) {
        finishCount(element);
        return;
      }

      cancelCount(element);

      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / countDurationMs, 1);
        const eased = easeOutCubic(elapsed);

        setCountText(element, count, count.target * eased);

        if (elapsed < 1) {
          animationFrames.set(element, window.requestAnimationFrame(tick));
          return;
        }

        setCountText(element, count, count.target);
        animationFrames.delete(element);
      };

      animationFrames.set(element, window.requestAnimationFrame(tick));
    };

    const revealDelayFor = (element: HTMLElement) => {
      const revealAncestor = element.closest<HTMLElement>(".reveal-on-view");

      if (!revealAncestor) {
        return progressFillFallbackDelayMs;
      }

      const revealStyles = window.getComputedStyle(revealAncestor);
      const revealDelayMs = readMotionMs(revealStyles, "--reveal-delay", 0);
      const revealIsSettled = revealAncestor.classList.contains("is-visible") && !revealAncestor.classList.contains("reveal-pending") && Number.parseFloat(revealStyles.opacity) >= 0.99;

      return revealIsSettled ? progressFillFallbackDelayMs : revealDelayMs + revealDurationMs + progressFillSettleDelayMs;
    };

    const scheduleCount = (element: HTMLElement) => {
      const existingTimer = countTimers.get(element);

      if (existingTimer) {
        window.clearTimeout(existingTimer);
        countTimers.delete(element);
      }

      const timer = window.setTimeout(() => {
        animateCount(element);
        countTimers.delete(element);
      }, revealDelayFor(element));

      countTimers.set(element, timer);
    };

    const resetProgress = (element: HTMLElement) => {
      const timer = progressTimers.get(element);

      if (timer) {
        window.clearTimeout(timer);
        progressTimers.delete(element);
      }

      element.dataset.motionReady = "true";
      element.dataset.motionState = "idle";
    };

    const cancelRing = (element: HTMLElement) => {
      const frame = ringFrames.get(element);
      const timer = ringTimers.get(element);

      if (frame) {
        window.cancelAnimationFrame(frame);
        ringFrames.delete(element);
      }

      if (timer) {
        window.clearTimeout(timer);
        ringTimers.delete(element);
      }
    };

    const resetRing = (element: HTMLElement) => {
      cancelRing(element);
      element.dataset.motionReady = "true";
      element.dataset.motionState = "idle";
      element.style.setProperty("--skill-motion-progress", "0%");
    };

    const finishRing = (element: HTMLElement) => {
      const target = readRingTarget(element);

      if (target === null) {
        return;
      }

      cancelRing(element);
      element.dataset.motionReady = "true";
      element.dataset.motionState = "filled";
      element.style.setProperty("--skill-motion-progress", `${target}%`);
    };

    const animateRing = (element: HTMLElement) => {
      const target = readRingTarget(element);

      if (target === null) {
        return;
      }

      if (prefersReducedMotion) {
        finishRing(element);
        return;
      }

      cancelRing(element);
      element.dataset.motionReady = "true";
      element.dataset.motionState = "filled";

      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / ringFillDurationMs, 1);
        const eased = easeOutCubic(elapsed);

        element.style.setProperty("--skill-motion-progress", `${target * eased}%`);

        if (elapsed < 1) {
          ringFrames.set(element, window.requestAnimationFrame(tick));
          return;
        }

        element.style.setProperty("--skill-motion-progress", `${target}%`);
        ringFrames.delete(element);
      };

      ringFrames.set(element, window.requestAnimationFrame(tick));
    };

    const fillProgress = (element: HTMLElement) => {
      element.dataset.motionReady = "true";
      element.dataset.motionState = "filled";
    };

    const scheduleProgressFill = (element: HTMLElement) => {
      const existingTimer = progressTimers.get(element);

      if (existingTimer) {
        window.clearTimeout(existingTimer);
        progressTimers.delete(element);
      }

      const timer = window.setTimeout(() => {
        fillProgress(element);
        progressTimers.delete(element);
      }, revealDelayFor(element));

      progressTimers.set(element, timer);
    };

    const scheduleRingFill = (element: HTMLElement) => {
      const existingTimer = ringTimers.get(element);

      if (existingTimer) {
        window.clearTimeout(existingTimer);
        ringTimers.delete(element);
      }

      const timer = window.setTimeout(() => {
        animateRing(element);
        ringTimers.delete(element);
      }, revealDelayFor(element));

      ringTimers.set(element, timer);
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      countElements.forEach(finishCount);
      progressElements.forEach(fillProgress);
      ringElements.forEach(finishRing);

      return () => {
        animationFrames.forEach((frame) => window.cancelAnimationFrame(frame));
        ringFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      };
    }

    countElements.forEach(resetCount);
    progressElements.forEach(resetProgress);
    ringElements.forEach(resetRing);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (!entry.isIntersecting || playedElements.has(target)) {
            return;
          }

          playedElements.add(target);
          observer.unobserve(target);

          if (target.matches(countSelector)) {
            scheduleCount(target);
            return;
          }

          if (target.matches(ringSelector)) {
            scheduleRingFill(target);
            return;
          }

          scheduleProgressFill(target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.24 },
    );

    countElements.forEach((element) => observer.observe(element));
    progressElements.forEach((element) => observer.observe(element));
    ringElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      animationFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      countTimers.forEach((timer) => window.clearTimeout(timer));
      progressTimers.forEach((timer) => window.clearTimeout(timer));
      ringFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      ringTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}
