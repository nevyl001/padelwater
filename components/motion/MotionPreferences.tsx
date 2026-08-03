"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  motionProfiles,
  resolveMotionLayer,
  type MotionLayer,
} from "@/lib/motion";

type MotionPreferencesValue = {
  layer: MotionLayer;
  profile: (typeof motionProfiles)[MotionLayer];
  prefersReducedMotion: boolean;
  isMobile: boolean;
  ready: boolean;
};

const MotionPreferencesContext = createContext<MotionPreferencesValue>({
  layer: "fullMotion",
  profile: motionProfiles.fullMotion,
  prefersReducedMotion: false,
  isMobile: false,
  ready: false,
});

export function MotionPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const sync = () => {
      setPrefersReducedMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
      setReady(true);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
    };
  }, []);

  const value = useMemo(() => {
    const layer = resolveMotionLayer({ prefersReducedMotion, isMobile });
    return {
      layer,
      profile: motionProfiles[layer],
      prefersReducedMotion,
      isMobile,
      ready,
    };
  }, [prefersReducedMotion, isMobile, ready]);

  return (
    <MotionPreferencesContext.Provider value={value}>
      {children}
    </MotionPreferencesContext.Provider>
  );
}

export function useMotionPreferences() {
  return useContext(MotionPreferencesContext);
}
