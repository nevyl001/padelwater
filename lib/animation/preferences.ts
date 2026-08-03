export type MotionLayer = "fullMotion" | "reducedMotion" | "mobileMotion";

export const easings = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  cinematic: [0.22, 1, 0.36, 1] as const,
};

export const durations = {
  fast: 0.2,
  base: 0.35,
  intro: 1.35,
  mobileIntro: 0.8,
} as const;

/** Story progress bands (desktop scrub) */
export const storyBands = {
  stage1: [0, 0.22] as const,
  stage2: [0.22, 0.47] as const,
  stage3: [0.47, 0.73] as const,
  stage4: [0.73, 0.92] as const,
  hold: [0.92, 1] as const,
};

export function resolveMotionLayer(options: {
  prefersReducedMotion: boolean;
  isMobile: boolean;
}): MotionLayer {
  if (options.prefersReducedMotion) return "reducedMotion";
  if (options.isMobile) return "mobileMotion";
  return "fullMotion";
}
