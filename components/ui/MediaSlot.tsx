import Image from "next/image";
import { cn } from "@/lib/cn";

type MediaSlotProps = {
  src?: string | null;
  alt: string;
  /** Aspect ratio for reserved space — can silhouette ~3:7 */
  aspect?: "can" | "square" | "video" | "wide";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  label?: string;
  tone?: "navy" | "ice" | "water" | "lime";
  /** Constrain height for sticky/viewport scenes */
  fitHeight?: boolean;
};

const aspects = {
  can: "aspect-[3/7]",
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[16/10]",
} as const;

const tones = {
  navy: "bg-pw-navy/40 border-white/10",
  ice: "bg-pw-ice border-pw-navy/10",
  water: "bg-pw-water/30 border-white/15",
  lime: "bg-pw-lime-soft border-pw-navy/10",
} as const;

/**
 * Reserved media region. Swap `src` when final assets arrive —
 * layout proportions stay stable (no CLS).
 */
export function MediaSlot({
  src,
  alt,
  aspect = "can",
  className,
  imageClassName,
  priority = false,
  label = "Producto",
  tone = "navy",
  fitHeight = false,
}: MediaSlotProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border",
        fitHeight
          ? "mx-auto aspect-[3/7] h-[min(58svh,440px)] w-auto"
          : aspects[aspect],
        tones[tone],
        className,
      )}
      data-media-slot
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 70vw, 420px"
          className={cn("object-contain", imageClassName)}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
          aria-hidden={false}
        >
          {/* PROVISIONAL: geometric slot only — not a fake can render */}
          <div className="h-[72%] w-[42%] rounded-[1.6rem] border border-dashed border-current/25 opacity-60" />
          <span className="max-w-[10rem] text-[0.65rem] uppercase tracking-[0.18em] text-current/45">
            {label}
          </span>
          <span className="sr-only">{alt}</span>
        </div>
      )}
    </div>
  );
}
