"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type CourtFieldProps = {
  className?: string;
  tone?: "dark" | "light" | "water" | "lime";
  intensity?: "soft" | "medium";
  animated?: boolean;
  /** When false, only soft court lines render (no floating balls). */
  showBalls?: boolean;
};

type Palette = {
  line: string;
  glow: string;
  washA: string;
};

const palettes: Record<NonNullable<CourtFieldProps["tone"]>, Palette> = {
  dark: {
    line: "rgba(255,255,255,0.28)",
    glow: "rgba(0,169,203,0.4)",
    washA: "rgba(0,169,203,0.1)",
  },
  light: {
    line: "rgba(7,26,56,0.16)",
    glow: "rgba(0,169,203,0.22)",
    washA: "rgba(0,169,203,0.06)",
  },
  water: {
    line: "rgba(255,255,255,0.32)",
    glow: "rgba(255,255,255,0.35)",
    washA: "rgba(255,255,255,0.08)",
  },
  lime: {
    line: "rgba(7,26,56,0.14)",
    glow: "rgba(0,169,203,0.28)",
    washA: "rgba(0,169,203,0.08)",
  },
};

type Particle = {
  u: number;
  speed: number;
  size: number;
  life: number;
  phase: number;
  spin: number;
};

/**
 * Soft court lines (blurred) + clearer padel balls on a separate layer.
 */
export function CourtField({
  className,
  tone = "dark",
  intensity = "medium",
  animated = true,
  showBalls = true,
}: CourtFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const linesCanvas = linesRef.current;
    const ballsCanvas = ballsRef.current;
    if (!wrap || !linesCanvas) return;
    if (showBalls && !ballsCanvas) return;

    const linesCtx = linesCanvas.getContext("2d", { alpha: true });
    const ballsCtx = showBalls
      ? ballsCanvas?.getContext("2d", { alpha: true })
      : null;
    if (!linesCtx) return;
    if (showBalls && !ballsCtx) return;

    const palette = palettes[tone];
    const strength = intensity === "soft" ? 0.65 : 1;
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const t0 = performance.now();

    const mobileInit =
      typeof window !== "undefined" && window.innerWidth < 768;
    const particleCount = mobileInit ? 3 : 5;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      // Stay in the lower-right floor of the court — never the copy column
      u: 0.58 + Math.random() * 0.34,
      speed: 0.016 + Math.random() * 0.022,
      size: 3.6 + Math.random() * 2.4,
      life: Math.random(),
      phase: i * 0.47,
      spin: (Math.random() > 0.5 ? 1 : -1) * (0.0012 + Math.random() * 0.002),
    }));

    const sizeCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      sizeCanvas(linesCanvas, linesCtx);
      if (ballsCanvas && ballsCtx) sizeCanvas(ballsCanvas, ballsCtx);
    };

    const isMobileView = () => w < 768;

    const project = (nx: number, depth: number) => {
      const mobile = isMobileView();
      const vanishingY = mobile ? h * 0.4 : h * 0.18;
      const nearY = mobile ? h * 0.9 : h * 0.96;
      const y = vanishingY + (nearY - vanishingY) * depth;
      const halfFar = mobile ? w * 0.3 : w * 0.14;
      const halfNear = mobile ? w * 0.45 : w * 0.46;
      const half = halfFar + (halfNear - halfFar) * depth;
      return { x: w * 0.5 + nx * half, y };
    };

    const strokePoly = (
      ctx: CanvasRenderingContext2D,
      points: Array<{ x: number; y: number }>,
      close = false,
    ) => {
      if (!points.length) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      if (close) ctx.closePath();
      ctx.stroke();
    };

    const drawCourt = (time: number) => {
      const ctx = linesCtx;
      const mobile = isMobileView();
      const pulse = animated ? 0.85 + 0.15 * Math.sin(time * 0.0004) : 0.9;
      const drawProgress = animated
        ? Math.min(1, (time - t0) / 1600)
        : 1;
      const alpha = (mobile ? 0.38 : 0.42) * strength * pulse * drawProgress;

      ctx.clearRect(0, 0, w, h);

      const wash = ctx.createRadialGradient(
        w * 0.5,
        mobile ? h * 0.7 : h * 0.55,
        0,
        w * 0.5,
        mobile ? h * 0.7 : h * 0.55,
        w * (mobile ? 0.5 : 0.42),
      );
      wash.addColorStop(0, palette.washA);
      wash.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.5 * strength;
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = mobile
        ? Math.max(1.1, w * 0.0032)
        : Math.max(1.15, w * 0.0018);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      strokePoly(
        ctx,
        [project(-1, 0.05), project(1, 0.05), project(1, 1), project(-1, 1)],
        true,
      );
      for (const d of [0.34, 0.66]) {
        strokePoly(ctx, [project(-1, d), project(1, d)]);
      }
      strokePoly(ctx, [project(0, 0.34), project(0, 0.66)]);

      const nL = project(-0.98, 0.5);
      const nR = project(0.98, 0.5);
      const netGrad = ctx.createLinearGradient(nL.x, nL.y, nR.x, nR.y);
      netGrad.addColorStop(0, "transparent");
      netGrad.addColorStop(0.5, palette.glow);
      netGrad.addColorStop(1, "transparent");
      ctx.globalAlpha = alpha * 1.15;
      ctx.strokeStyle = netGrad;
      ctx.lineWidth = mobile
        ? Math.max(1.6, w * 0.005)
        : Math.max(1.8, w * 0.0028);
      ctx.beginPath();
      ctx.moveTo(nL.x, nL.y);
      ctx.lineTo(nR.x, nR.y);
      ctx.stroke();

      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = Math.max(0.9, w * 0.002);
      const farY = project(0, 0.05).y;
      const tickH = mobile ? h * 0.028 : h * 0.04;
      for (const nx of [-0.66, 0, 0.66]) {
        const p = project(nx, 0.05);
        ctx.beginPath();
        ctx.moveTo(p.x, farY);
        ctx.lineTo(p.x, farY - tickH);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawPadelBall = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      rotation: number,
      alpha: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      ctx.beginPath();
      ctx.fillStyle = "rgba(3,17,38,0.28)";
      ctx.ellipse(r * 0.1, r * 0.9, r * 0.9, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      const body = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.08, 0, 0, r);
      body.addColorStop(0, "#f2ff8a");
      body.addColorStop(0.45, "#d4f000");
      body.addColorStop(1, "#9fbe00");
      ctx.beginPath();
      ctx.fillStyle = body;
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(7,26,56,0.28)";
      ctx.lineWidth = Math.max(0.7, r * 0.08);
      ctx.arc(0, 0, r - ctx.lineWidth * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = Math.max(1, r * 0.14);
      ctx.lineCap = "round";
      ctx.moveTo(-r * 0.12, -r * 0.9);
      ctx.bezierCurveTo(r * 0.95, -r * 0.35, r * 0.95, r * 0.35, -r * 0.12, r * 0.9);
      ctx.moveTo(r * 0.12, -r * 0.9);
      ctx.bezierCurveTo(-r * 0.95, -r * 0.35, -r * 0.95, r * 0.35, r * 0.12, r * 0.9);
      ctx.stroke();

      ctx.restore();
    };

    const drawBalls = (time: number) => {
      if (!ballsCtx) return;
      const ctx = ballsCtx;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        const travel = animated
          ? (p.life + time * 0.00009 * p.speed) % 1
          : (p.life + 0.4) % 1;
        // Keep balls on the near floor only (bottom of frame) so they never meet headlines
        const depth = 0.72 + travel * 0.26;
        const sway = Math.sin(time * 0.0007 + p.phase) * 0.03;
        const nx = (p.u * 2 - 1) * 0.78 + sway;
        const pos = project(nx, depth);

        // Hard clip: no balls in the upper text band or left copy column
        if (pos.y < h * 0.58 || pos.x < w * 0.42) continue;

        const alpha =
          (animated
            ? 0.65 + 0.3 * Math.sin(travel * Math.PI)
            : 0.85) * strength;
        const r = p.size * (1.05 + depth * 0.85) * (isMobileView() ? 1.2 : 1.15);
        const rotation = animated ? time * p.spin + p.phase : p.phase;

        // Glow behind the ball so it pops on dark/teal scenes
        const bloom = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          r * 3.4,
        );
        bloom.addColorStop(0, "rgba(183,243,51,0.55)");
        bloom.addColorStop(1, "transparent");
        ctx.globalAlpha = Math.max(0, alpha * 0.55);
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 3.4, 0, Math.PI * 2);
        ctx.fill();

        drawPadelBall(ctx, pos.x, pos.y, r, rotation, Math.min(1, alpha + 0.15));
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      if (!running) return;
      drawCourt(now);
      if (showBalls) drawBalls(now);
      if (animated) raf = requestAnimationFrame(frame);
    };

    resize();
    frame(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      if (!animated) frame(performance.now());
    });
    ro.observe(wrap);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [tone, intensity, animated, showBalls]);

  return (
    <>
      <div
        ref={wrapRef}
        aria-hidden
        data-court-field
        className={cn(
          "pointer-events-none absolute inset-0 z-0 overflow-hidden",
          className,
        )}
      >
        <canvas
          ref={linesRef}
          className="absolute inset-0 h-full w-full origin-center scale-[1.04] opacity-80 blur-[2.5px] max-md:opacity-70 max-md:blur-[3px]"
        />
      </div>
      {showBalls ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[12] overflow-hidden md:z-[6]"
        >
          <canvas ref={ballsRef} className="absolute inset-0 h-full w-full" />
        </div>
      ) : null}
    </>
  );
}
