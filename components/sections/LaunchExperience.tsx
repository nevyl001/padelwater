"use client";

import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { LaunchExperienceDesktop } from "@/components/sections/LaunchExperienceDesktop";
import { LaunchExperienceMobile } from "@/components/sections/LaunchExperienceMobile";

/**
 * Launch split: mobile = vertical document flow (no overlays).
 * Desktop = pinned scrub theatre.
 */
export function LaunchExperience() {
  const { isMobile, ready } = useMotionPreferences();

  // Before hydration, render both behind CSS so layout doesn't flash empty.
  if (!ready) {
    return (
      <>
        <div id="producto" className="anchor-offset h-0 scroll-mt-[var(--header-offset)]" />
        <div className="md:hidden">
          <LaunchExperienceMobile />
        </div>
        <div className="hidden md:block">
          <LaunchExperienceDesktop />
        </div>
      </>
    );
  }

  return (
    <>
      <div id="producto" className="anchor-offset h-0 scroll-mt-[var(--header-offset)]" />
      {isMobile ? <LaunchExperienceMobile /> : <LaunchExperienceDesktop />}
    </>
  );
}
