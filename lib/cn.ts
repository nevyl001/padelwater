import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Our type-scale utilities (app/globals.css) are hand-written, not
// Tailwind-generated, so twMerge doesn't recognize them as font-size
// classes by default — it was falling back to generic text-* prefix
// matching and treating them as conflicting with text-color utilities
// (e.g. cn("text-editorial", "text-pw-navy") silently dropped
// text-editorial). Registering them under the built-in "font-size"
// group fixes that without changing merge behavior for anything else.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-hero",
        "text-editorial",
        "text-section",
        "text-body-lg",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
