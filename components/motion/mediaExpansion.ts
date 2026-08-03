type GsapCore = typeof import("gsap").gsap;
type Timeline = gsap.core.Timeline;
type TweenTarget = gsap.TweenTarget;
type TweenVars = gsap.TweenVars;

/**
 * The "Container Scroll"-inspired physical settle, shared by every
 * scene that opens on product art (Story, Showcase, Final): the can
 * arrives from a slight tilt/lift into resting place — just enough to
 * read as a real object, never a showy 3D flip. One tuned recipe
 * instead of three near-identical inline tweens.
 */
export function prepareMediaExpansion(
  gsap: GsapCore,
  target: TweenTarget,
  transformOrigin = "50% 100%",
) {
  gsap.set(target, { transformPerspective: 800, transformOrigin });
}

export function applyMediaExpansion(
  timeline: Timeline,
  target: TweenTarget,
  options: {
    from?: TweenVars;
    to?: TweenVars;
    duration?: number;
    ease?: string;
    position?: number | string;
  } = {},
) {
  const {
    from = { rotateX: -8, scale: 0.92, y: 20 },
    to = { rotateX: 0, scale: 1, y: 0 },
    duration = 0.9,
    ease = "expo.out",
    position = 0,
  } = options;

  return timeline.fromTo(target, from, { ...to, duration, ease }, position);
}
