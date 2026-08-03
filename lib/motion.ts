export type MotionLayer = "fullMotion" | "reducedMotion" | "mobileMotion";

/** Shared cubic-bezier presets (CSS + Motion). GSAP uses named easings. */
export const easings = {
  outExpo: [0.16, 1, 0.3, 1] as const,
} as const;

export const gsapEasings = {
  outExpo: "expo.out",
  outPower: "power3.out",
  inOut: "power2.inOut",
  none: "none",
} as const;

export const durations = {
  fast: 0.2,
  base: 0.35,
  mid: 0.5,
  slow: 0.6,
  reveal: 0.7,
  cinematic: 0.85,
  heroIntro: 1.15,
  auroraCycle: 18,
  showcaseSwap: 0.42,
  sheen: 0.65,
  pointer: 0.6,
} as const;

export const staggers = {
  lines: 0.09,
  words: 0.028,
  soft: 0.05,
} as const;

/** Pixel / unit distances for pointer & parallax (desktop fullMotion). */
export const distances = {
  heroPointerX: 12,
  heroPointerY: 8,
  showcasePointerX: 14,
  showcasePointerY: 10,
  parallaxBg: 40,
  parallaxMid: 22,
  parallaxFg: 12,
  scrollBridgeY: 36,
} as const;

export const scales = {
  heroCanEnter: 0.94,
  heroCanRest: 1,
  heroScrollOut: 0.96,
  editorialTitle: 1.05,
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
    enableMagnetic: true,
    enablePointerHero: true,
    enablePointerShowcase: true,
    enableAurora: true,
    parallaxStrength: 1,
    pointerStrength: 1,
  },
  mobileMotion: {
    enableMagnetic: false,
    enablePointerHero: false,
    enablePointerShowcase: false,
    enableAurora: true,
    parallaxStrength: 0.35,
    pointerStrength: 0,
  },
  reducedMotion: {
    enableMagnetic: false,
    enablePointerHero: false,
    enablePointerShowcase: false,
    enableAurora: false,
    parallaxStrength: 0,
    pointerStrength: 0,
  },
} as const;

export type MotionProfile = (typeof motionProfiles)[MotionLayer];
