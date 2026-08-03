"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function getGsap() {
  if (typeof window === "undefined") {
    return { gsap, ScrollTrigger };
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  return { gsap, ScrollTrigger };
}

export function killScrollTriggers(scope?: string | Element) {
  const { ScrollTrigger: ST } = getGsap();
  if (scope) {
    ST.getAll()
      .filter((t) => {
        const trigger = t.trigger;
        if (!trigger) return false;
        if (typeof scope === "string") {
          return (trigger as Element).closest?.(scope) != null || trigger === document.querySelector(scope);
        }
        return scope.contains(trigger as Node) || trigger === scope;
      })
      .forEach((t) => t.kill());
    return;
  }
  ST.getAll().forEach((t) => t.kill());
}
