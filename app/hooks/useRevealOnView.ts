"use client";

import { useEffect } from "react";

export function useRevealOnView() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-view"));

    if (elements.length === 0) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rootStyles = window.getComputedStyle(document.documentElement);
    const readMotionMs = (name: string, fallbackMs: number) => {
      const value = rootStyles.getPropertyValue(name).trim();

      if (value.endsWith("ms")) {
        return Number.parseFloat(value) || fallbackMs;
      }

      if (value.endsWith("s")) {
        return (Number.parseFloat(value) || fallbackMs / 1000) * 1000;
      }

      return fallbackMs;
    };
    const staggerStepMs = readMotionMs("--section-reveal-stagger-step", 160);
    const maxStaggerMs = readMotionMs("--section-reveal-stagger-max", 320);
    let revealFrame = 0;

    const showElement = (element: HTMLElement, delayMs = 0) => {
      element.style.setProperty("--reveal-delay", `${delayMs}ms`);
      element.classList.remove("reveal-pending");
      element.classList.add("is-visible");
    };
    const showElements = (items: HTMLElement[]) => {
      items
        .filter((element) => !element.classList.contains("is-visible"))
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
        .forEach((element, index) => {
          const delayMs = prefersReducedMotion ? 0 : Math.min(index * staggerStepMs, maxStaggerMs);
          showElement(element, delayMs);
        });
    };
    const showAllElements = () => showElements(elements);
    const handlePageHide = () => {
      showAllElements();
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        showAllElements();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    if (!("IntersectionObserver" in window)) {
      showElements(elements);
      return () => {
        window.removeEventListener("pagehide", handlePageHide);
        window.removeEventListener("pageshow", handlePageShow);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries: HTMLElement[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            visibleEntries.push(target);
            observer.unobserve(target);
          }
        });

        showElements(visibleEntries);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const initialVisibleElements: HTMLElement[] = [];

    elements.forEach((element) => {
      element.classList.remove("reveal-pending");

      const bounds = element.getBoundingClientRect();
      const isInInitialViewport = bounds.top < window.innerHeight && bounds.bottom > 0;

      if (isInInitialViewport) {
        initialVisibleElements.push(element);
        return;
      }

      if (element.classList.contains("is-visible")) {
        return;
      }

      element.classList.add("reveal-pending");
      observer.observe(element);
    });

    revealFrame = window.requestAnimationFrame(() => showElements(initialVisibleElements));

    return () => {
      showAllElements();
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.cancelAnimationFrame(revealFrame);
      observer.disconnect();
    };
  }, []);
}
