export const toneBg = {
  navy: "bg-pw-navy-deep",
  water: "bg-[#087A9A]",
  ice: "bg-pw-ice",
  "lime-soft": "bg-[#d8f08a]",
} as const;

export const toneText = {
  navy: "text-pw-white",
  water: "text-pw-white",
  ice: "text-pw-navy",
  "lime-soft": "text-pw-navy",
} as const;

export const courtTone = {
  navy: "dark" as const,
  water: "water" as const,
  ice: "light" as const,
  "lime-soft": "lime" as const,
};

export function canToneFromStage(
  tone: keyof typeof toneBg,
): "navy" | "ice" | "water" {
  if (tone === "lime-soft") return "ice";
  if (tone === "water") return "water";
  return "navy";
}
