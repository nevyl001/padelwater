export type MotionLayer = "fullMotion" | "reducedMotion" | "mobileMotion";

/** Shared cubic-bezier presets (CSS + Motion). GSAP uses named easings. */
export const easings = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  inOutCubic: [0.65, 0, 0.35, 1] as const,
  soft: [0.22, 1, 0.36, 1] as const,
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
  cinematic: 0.75,
  story: 1.2,
  heroIntro: 1.4,
  auroraCycle: 18,
  showcaseSwap: 0.55,
} as const;

export const staggers = {
  lines: 0.08,
  words: 0.03,
  cards: 0.1,
  orbits: 0.12,
} as const;

/** Pixel / unit distances for pointer & parallax (desktop fullMotion). */
export const distances = {
  heroPointerX: 18,
  heroPointerY: 12,
  showcasePointerX: 22,
  showcasePointerY: 14,
  parallaxBg: 48,
  parallaxMid: 28,
  parallaxFg: 14,
  scrollBridgeY: 48,
} as const;

export const scales = {
  heroCanEnter: 0.9,
  heroCanRest: 1,
  heroScrollOut: 0.92,
  showcaseCan: 1,
  showcaseCanHover: 1.02,
  editorialTitle: 1.08,
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
    enablePointerShowcase: true,
    enableAurora: true,
    storyVh: 400,
    storyStages: 4,
    parallaxStrength: 1,
    pointerStrength: 1,
  },
  mobileMotion: {
    enableParallax: true,
    enableMagnetic: false,
    enablePointerHero: false,
    enablePointerShowcase: false,
    enableAurora: true,
    storyVh: 360,
    storyStages: 4,
    parallaxStrength: 0.35,
    pointerStrength: 0,
  },
  reducedMotion: {
    enableParallax: false,
    enableMagnetic: false,
    enablePointerHero: false,
    enablePointerShowcase: false,
    enableAurora: false,
    storyVh: 100,
    storyStages: 4,
    parallaxStrength: 0,
    pointerStrength: 0,
  },
} as const;

export type MotionProfile = (typeof motionProfiles)[MotionLayer];
