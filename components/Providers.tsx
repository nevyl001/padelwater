"use client";

import { MotionPreferencesProvider } from "@/components/motion/MotionPreferences";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionPreferencesProvider>
      <SmoothScrollProvider>
        <ScrollProgress />
        {children}
      </SmoothScrollProvider>
    </MotionPreferencesProvider>
  );
}
