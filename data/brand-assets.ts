/**
 * Official brand media — paths under /public.
 * Site identity follows these assets; do not invent placeholders.
 */
export const BRAND_ASSETS_READY = true;

export const brandAssetPaths = {
  logoHorizontal: "/branding/logo-horizontal.webp",
  logoHorizontalPng: "/branding/logo-horizontal.png",
  logoStacked: "/branding/logo-stacked.webp",
  logoIcon: "/branding/logo-icon.webp",
  logoIconPng: "/branding/logo-icon.png",
  badge: "/branding/badge.webp",
  /** Photographed can with transparent background */
  canFront: "/product/can-front.webp",
  canFrontPng: "/product/can-front.png",
  canHero: "/product/can-hero.webp",
  canDetail: "/product/can-detail.webp",
  label: "/product/label.webp",
  ogShare: "/branding/og-share.webp",
} as const;

export function resolveCanImage(
  preferred: string | null | undefined,
): string {
  return preferred ?? brandAssetPaths.canFront;
}
