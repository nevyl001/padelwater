"use client";

import { MotionPreferencesProvider } from "@/components/motion/MotionPreferences";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionPreferencesProvider>
      <ScrollProgress />
      {children}
    </MotionPreferencesProvider>
  );
}
