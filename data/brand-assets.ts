/**
 * Flip to true when final photography/logo assets are in public/brand.
 * Layout must not depend on this flag — only which media src is shown.
 */
export const BRAND_ASSETS_READY = false;

export const brandAssetPaths = {
  canFront: "/brand/product/can-front.webp",
  canHero: "/brand/product/can-hero.webp",
  logo: "/brand/logo/padel-water.svg",
} as const;

export function resolveCanImage(
  preferred: string | null | undefined,
): string | null {
  if (!BRAND_ASSETS_READY) return null;
  return preferred ?? brandAssetPaths.canFront;
}
