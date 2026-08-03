"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type CourtFieldProps = {
  className?: string;
  tone?: "dark" | "light" | "water" | "lime";
  intensity?: "soft" | "medium";
  animated?: boolean;
};

type Palette = {
  line: string;
  glow: string;
  accent: string;
  washA: string;
  washB: string;
};

const palettes: Record<NonNullable<CourtFieldProps["tone"]>, Palette> = {
  dark: {
    line: "rgba(255,255,255,0.28)",
    glow: "rgba(0,169,203,0.4)",
    accent: "rgba(183,243,51,0.28)",
    washA: "rgba(0,169,203,0.1)",
    washB: "rgba(183,243,51,0.06)",
  },
  light: {
    line: "rgba(7,26,56,0.16)",
    glow: "rgba(0,169,203,0.22)",
    accent: "rgba(7,26,56,0.12)",
    washA: "rgba(0,169,203,0.06)",
    washB: "rgba(183,243,51,0.08)",
  },
  water: {
    line: "rgba(255,255,255,0.32)",
    glow: "rgba(255,255,255,0.35)",
    accent: "rgba(183,243,51,0.28)",
    washA: "rgba(255,255,255,0.08)",
    washB: "rgba(183,243,51,0.08)",
  },
  lime: {
    line: "rgba(7,26,56,0.14)",
    glow: "rgba(0,169,203,0.28)",
    accent: "rgba(7,26,56,0.1)",
    washA: "rgba(0,169,203,0.08)",
    washB: "rgba(7,26,56,0.04)",
  },
};

type Particle = {
  u: number;
  v: number;
  speed: number;
  size: number;
  life: number;
  phase: number;
};

/**
 * Minimal padel-court atmosphere: soft perspective lines only.
 * Elegant and diffused — suggests a court without drawing one hard.
 */
export function CourtField({
  className,
  tone = "dark",
  intensity = "medium",
  animated = true,
}: CourtFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

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
      u: 0.25 + Math.random() * 0.5,
      v: 0.4 + Math.random() * 0.45,
      speed: 0.02 + Math.random() * 0.03,
      size: 2.2 + Math.random() * 1.6,
      life: Math.random(),
      phase: i * 0.5,
    }));

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      const mobile = isMobileView();
      const pulse = animated ? 0.85 + 0.15 * Math.sin(time * 0.0004) : 0.9;
      const drawProgress = animated
        ? Math.min(1, (time - t0) / 1600)
        : 1;
      const alpha = (mobile ? 0.38 : 0.42) * strength * pulse * drawProgress;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = mobile ? Math.max(1.1, w * 0.0032) : Math.max(1.15, w * 0.0018);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.setLineDash([]);

      // Outer padel footprint
      strokePoly(
        [project(-1, 0.05), project(1, 0.05), project(1, 1), project(-1, 1)],
        true,
      );

      // Service lines + center (reads as padel, not tennis alone)
      for (const d of [0.34, 0.66]) {
        strokePoly([project(-1, d), project(1, d)]);
      }
      strokePoly([project(0, 0.34), project(0, 0.66)]);

      // Soft net glow — one elegant cue, no posts/mesh
      const nL = project(-0.98, 0.5);
      const nR = project(0.98, 0.5);
      const netGrad = ctx.createLinearGradient(nL.x, nL.y, nR.x, nR.y);
      netGrad.addColorStop(0, "transparent");
      netGrad.addColorStop(0.5, palette.glow);
      netGrad.addColorStop(1, "transparent");
      ctx.globalAlpha = alpha * 1.15;
      ctx.strokeStyle = netGrad;
      ctx.lineWidth = mobile ? Math.max(1.6, w * 0.005) : Math.max(1.8, w * 0.0028);
      ctx.beginPath();
      ctx.moveTo(nL.x, nL.y);
      ctx.lineTo(nR.x, nR.y);
      ctx.stroke();

      // Far glass — three faint vertical ticks only (not a solid wall)
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

    const drawWashes = () => {
      const g = ctx.createRadialGradient(
        w * 0.5,
        isMobileView() ? h * 0.7 : h * 0.55,
        0,
        w * 0.5,
        isMobileView() ? h * 0.7 : h * 0.55,
        w * (isMobileView() ? 0.5 : 0.42),
      );
      g.addColorStop(0, palette.washA);
      g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.5 * strength;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    };

    const drawParticles = (time: number) => {
      ctx.save();
      for (const p of particles) {
        const travel = animated
          ? (p.life + time * 0.00008 * p.speed) % 1
          : (p.life + 0.4) % 1;
        const depth = 0.42 + travel * 0.5;
        const sway = Math.sin(time * 0.0006 + p.phase) * 0.04;
        const nx = (p.u * 2 - 1) * 0.5 + sway;
        const pos = project(nx, depth);
        const alpha =
          (animated ? Math.sin(travel * Math.PI) * 0.45 : 0.35) * strength;
        const r = p.size * (0.7 + depth * 0.9);

        ctx.globalAlpha = Math.max(0, alpha);
        const bloom = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          r * 4,
        );
        bloom.addColorStop(0, palette.accent);
        bloom.addColorStop(1, "transparent");
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Soft orb — no hard ball drawing
        ctx.beginPath();
        ctx.fillStyle = "rgba(212,240,0,0.55)";
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      drawWashes();
      drawCourt(now);
      drawParticles(now);
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
  }, [tone, intensity, animated]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      data-court-field
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full origin-center scale-[1.04] opacity-80 blur-[2.5px] max-md:opacity-70 max-md:blur-[3px]"
      />
    </div>
  );
}
