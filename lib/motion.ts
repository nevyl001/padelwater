export type MotionLayer = "fullMotion" | "reducedMotion" | "mobileMotion";

export const easings = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  inOutCubic: [0.65, 0, 0.35, 1] as const,
};

export const durations = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  story: 1.2,
} as const;

export function resolveMotionLayer(options: {
  prefersReducedMotion: boolean;
  isMobile: boolean;
}): MotionLayer {
  if (options.prefersReducedMotion) return "reducedMotion";
  if (options.isMobile) return "mobileMotion";
  return "fullMotion";
}

export const motionProfiles = {
  fullMotion: {
    enableParallax: true,
    enableMagnetic: true,
    enablePointerHero: true,
    storyVh: 300,
    storyStages: 4,
  },
  mobileMotion: {
    enableParallax: false,
    enableMagnetic: false,
    enablePointerHero: false,
    storyVh: 180,
    storyStages: 3,
  },
  reducedMotion: {
    enableParallax: false,
    enableMagnetic: false,
    enablePointerHero: false,
    storyVh: 100,
    storyStages: 4,
  },
} as const;
