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
  particle: string;
  washA: string;
  washB: string;
};

const palettes: Record<NonNullable<CourtFieldProps["tone"]>, Palette> = {
  dark: {
    line: "rgba(255,255,255,0.22)",
    glow: "rgba(0,169,203,0.55)",
    accent: "rgba(183,243,51,0.45)",
    particle: "rgba(183,243,51,0.85)",
    washA: "rgba(0,169,203,0.16)",
    washB: "rgba(183,243,51,0.1)",
  },
  light: {
    line: "rgba(7,26,56,0.14)",
    glow: "rgba(0,169,203,0.28)",
    accent: "rgba(7,26,56,0.18)",
    particle: "rgba(0,169,203,0.55)",
    washA: "rgba(0,169,203,0.08)",
    washB: "rgba(183,243,51,0.12)",
  },
  water: {
    line: "rgba(255,255,255,0.28)",
    glow: "rgba(255,255,255,0.45)",
    accent: "rgba(183,243,51,0.4)",
    particle: "rgba(183,243,51,0.8)",
    washA: "rgba(255,255,255,0.1)",
    washB: "rgba(183,243,51,0.12)",
  },
  lime: {
    line: "rgba(7,26,56,0.16)",
    glow: "rgba(0,169,203,0.35)",
    accent: "rgba(7,26,56,0.2)",
    particle: "rgba(0,169,203,0.65)",
    washA: "rgba(0,169,203,0.1)",
    washB: "rgba(7,26,56,0.06)",
  },
};

type Particle = {
  u: number;
  v: number;
  speed: number;
  size: number;
  life: number;
  phase: number;
  spin: number;
};

const BALL_FILL = "#d4f000";
const BALL_SHADE = "#a8c400";
const BALL_SEAM = "rgba(255,255,255,0.88)";
const BALL_EDGE = "rgba(7,26,56,0.22)";

/**
 * Live canvas atmosphere: perspective court, floating padel balls, glow washes.
 * Falls back to a static frame when `animated` is false.
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
    const strength = intensity === "soft" ? 0.72 : 1;
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const t0 = performance.now();

    const particleCount =
      typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 12;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      u: 0.2 + Math.random() * 0.6,
      v: 0.35 + Math.random() * 0.55,
      speed: 0.025 + Math.random() * 0.04,
      size: 2.8 + Math.random() * 2.2,
      life: Math.random(),
      phase: i * 0.37,
      spin: (Math.random() > 0.5 ? 1 : -1) * (0.001 + Math.random() * 0.0025),
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

    /**
     * Mobile: flatter, wider court parked in the lower half so it reads as
     * a padel court — not a tall wireframe spike behind the copy.
     * Desktop: deeper perspective across more of the frame.
     */
    const project = (nx: number, depth: number) => {
      const mobile = isMobileView();
      const vanishingY = mobile ? h * 0.42 : h * 0.2;
      const nearY = mobile ? h * 0.9 : h * 0.96;
      const y = vanishingY + (nearY - vanishingY) * depth;
      const halfFar = mobile ? w * 0.32 : w * 0.15;
      const halfNear = mobile ? w * 0.46 : w * 0.46;
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

    const fillCourtSurface = () => {
      const tl = project(-1, 0.02);
      const tr = project(1, 0.02);
      const br = project(1, 1);
      const bl = project(-1, 1);
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      const turf = ctx.createLinearGradient(0, tl.y, 0, br.y);
      // Classic blue padel turf — readable on lime and navy scenes
      if (tone === "lime") {
        turf.addColorStop(0, "rgba(0,140,170,0.42)");
        turf.addColorStop(1, "rgba(0,95,125,0.55)");
      } else if (tone === "dark" || tone === "water") {
        turf.addColorStop(0, "rgba(0,130,160,0.28)");
        turf.addColorStop(1, "rgba(0,85,115,0.4)");
      } else {
        turf.addColorStop(0, "rgba(0,140,170,0.22)");
        turf.addColorStop(1, "rgba(0,100,130,0.34)");
      }
      ctx.fillStyle = turf;
      ctx.fill();
    };

    const drawSideGlass = (side: -1 | 1, drawProgress: number) => {
      const mobile = isMobileView();
      const wallH = mobile ? h * 0.07 : h * 0.09;
      const near = project(side, 1);
      const far = project(side, 0.02);
      const nearTop = { x: near.x, y: near.y - wallH * 0.55 };
      const farTop = { x: far.x, y: far.y - wallH };

      ctx.beginPath();
      ctx.moveTo(near.x, near.y);
      ctx.lineTo(far.x, far.y);
      ctx.lineTo(farTop.x, farTop.y);
      ctx.lineTo(nearTop.x, nearTop.y);
      ctx.closePath();
      ctx.fillStyle =
        tone === "dark" || tone === "water"
          ? "rgba(180,220,235,0.08)"
          : "rgba(255,255,255,0.22)";
      ctx.globalAlpha = 0.9 * strength * drawProgress;
      ctx.fill();
      ctx.strokeStyle =
        tone === "dark" || tone === "water"
          ? "rgba(255,255,255,0.35)"
          : "rgba(255,255,255,0.75)";
      ctx.lineWidth = Math.max(1.5, w * 0.003);
      ctx.stroke();

      // Glass mullions
      ctx.globalAlpha = 0.35 * strength * drawProgress;
      for (const d of [0.25, 0.5, 0.75]) {
        const p = project(side, d);
        const top = p.y - wallH * (0.55 + (1 - d) * 0.45);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, top);
        ctx.stroke();
      }
    };

    const drawCourt = (time: number) => {
      const mobile = isMobileView();
      const pulse = animated ? 0.7 + 0.3 * Math.sin(time * 0.00045) : 0.85;
      const drawProgress = animated
        ? Math.min(1, (time - t0) / 1400)
        : 1;

      ctx.save();
      ctx.globalAlpha = (mobile ? 0.95 : 0.85) * strength * drawProgress;
      fillCourtSurface();
      ctx.restore();

      // Side glass cages — key padel cue
      ctx.save();
      drawSideGlass(-1, drawProgress);
      drawSideGlass(1, drawProgress);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.95 * strength * pulse * drawProgress;
      ctx.strokeStyle = "rgba(255,255,255,0.92)";
      ctx.lineWidth = mobile
        ? Math.max(2.4, w * 0.007)
        : Math.max(2, w * 0.0026);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.setLineDash([]);

      // Outer boundary
      strokePoly(
        [project(-1, 0.02), project(1, 0.02), project(1, 1), project(-1, 1)],
        true,
      );

      // Service boxes — padel proportions
      for (const d of [0.34, 0.66]) {
        strokePoly([project(-1, d), project(1, d)]);
      }
      strokePoly([project(0, 0.34), project(0, 0.66)]);

      // Net
      const netD = 0.5;
      const nL = project(-1, netD);
      const nR = project(1, netD);
      const postH = mobile ? Math.max(18, h * 0.028) : Math.max(16, h * 0.035);

      ctx.globalAlpha = 0.95 * strength * drawProgress;
      ctx.strokeStyle = tone === "lime" ? "rgba(7,26,56,0.55)" : palette.accent;
      ctx.lineWidth = Math.max(2.5, w * 0.004);
      ctx.beginPath();
      ctx.moveTo(nL.x, nL.y);
      ctx.lineTo(nL.x, nL.y - postH);
      ctx.moveTo(nR.x, nR.y);
      ctx.lineTo(nR.x, nR.y - postH);
      ctx.stroke();

      const netGrad = ctx.createLinearGradient(nL.x, nL.y, nR.x, nR.y);
      netGrad.addColorStop(0, "transparent");
      netGrad.addColorStop(0.15, palette.glow);
      netGrad.addColorStop(0.5, "rgba(255,255,255,0.95)");
      netGrad.addColorStop(0.85, palette.glow);
      netGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = netGrad;
      ctx.lineWidth = mobile ? Math.max(3.5, w * 0.01) : Math.max(3, w * 0.0045);
      ctx.beginPath();
      ctx.moveTo(nL.x, nL.y - postH * 0.5);
      ctx.lineTo(nR.x, nR.y - postH * 0.5);
      ctx.stroke();

      // Back glass wall
      const gL = project(-1, 0.02);
      const gR = project(1, 0.02);
      const wallH = mobile ? h * 0.055 : h * 0.07;
      const glassTop = gL.y - wallH;
      ctx.globalAlpha = 0.55 * strength * drawProgress;
      ctx.fillStyle =
        tone === "dark" || tone === "water"
          ? "rgba(180,220,235,0.1)"
          : "rgba(255,255,255,0.28)";
      ctx.beginPath();
      ctx.moveTo(gL.x, gL.y);
      ctx.lineTo(gR.x, gR.y);
      ctx.lineTo(gR.x, glassTop);
      ctx.lineTo(gL.x, glassTop);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = Math.max(1.8, w * 0.004);
      ctx.stroke();
      ctx.globalAlpha = 0.4 * strength * drawProgress;
      for (const nx of [-0.5, 0, 0.5]) {
        const p = project(nx, 0.02);
        ctx.beginPath();
        ctx.moveTo(p.x, glassTop);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawWashes = (time: number) => {
      if (isMobileView()) {
        // Single soft wash — keep the court readable
        const g = ctx.createRadialGradient(
          w * 0.5,
          h * 0.72,
          0,
          w * 0.5,
          h * 0.72,
          w * 0.55,
        );
        g.addColorStop(0, palette.washA);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.55 * strength;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        return;
      }
      const a = animated ? time * 0.00015 : 0;
      const x1 = w * (0.25 + 0.08 * Math.sin(a));
      const y1 = h * (0.35 + 0.06 * Math.cos(a * 1.3));
      const x2 = w * (0.72 + 0.07 * Math.cos(a * 0.9));
      const y2 = h * (0.55 + 0.05 * Math.sin(a * 1.1));

      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.42);
      g1.addColorStop(0, palette.washA);
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, w * 0.38);
      g2.addColorStop(0, palette.washB);
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    const drawPadelBall = (
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

      // soft contact shadow
      ctx.beginPath();
      ctx.fillStyle = "rgba(3,17,38,0.22)";
      ctx.ellipse(r * 0.15, r * 0.85, r * 0.85, r * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();

      // ball body
      const body = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
      body.addColorStop(0, "#e8ff66");
      body.addColorStop(0.55, BALL_FILL);
      body.addColorStop(1, BALL_SHADE);
      ctx.beginPath();
      ctx.fillStyle = body;
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // edge
      ctx.beginPath();
      ctx.strokeStyle = BALL_EDGE;
      ctx.lineWidth = Math.max(0.6, r * 0.08);
      ctx.arc(0, 0, r - ctx.lineWidth * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // classic curved seam (tennis/padel)
      ctx.beginPath();
      ctx.strokeStyle = BALL_SEAM;
      ctx.lineWidth = Math.max(0.8, r * 0.12);
      ctx.lineCap = "round";
      ctx.moveTo(-r * 0.15, -r * 0.92);
      ctx.bezierCurveTo(
        r * 0.95,
        -r * 0.35,
        r * 0.95,
        r * 0.35,
        -r * 0.15,
        r * 0.92,
      );
      ctx.moveTo(r * 0.15, -r * 0.92);
      ctx.bezierCurveTo(
        -r * 0.95,
        -r * 0.35,
        -r * 0.95,
        r * 0.35,
        r * 0.15,
        r * 0.92,
      );
      ctx.stroke();

      ctx.restore();
    };

    const drawParticles = (time: number) => {
      ctx.save();
      for (const p of particles) {
        const travel = animated
          ? (p.life + time * 0.0001 * p.speed) % 1
          : (p.life + 0.35) % 1;
        const depth = isMobileView()
          ? 0.4 + travel * 0.55
          : 0.18 + travel * 0.72;
        const sway = animated
          ? Math.sin(time * 0.001 + p.phase) * 0.05
          : Math.sin(p.phase) * 0.03;
        const nx = (p.u * 2 - 1) * (isMobileView() ? 0.55 : 0.72) + sway;
        const pos = project(nx, depth);
        const alpha =
          (animated
            ? Math.sin(travel * Math.PI) *
              (0.55 + 0.45 * Math.sin(time * 0.0018 + p.phase))
            : 0.7) *
          0.92 *
          strength;
        const r = p.size * (0.85 + depth * 1.35);
        const rotation = animated
          ? time * p.spin + p.phase
          : p.phase;

        // tiny bloom behind the ball
        const bloom = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          r * 3.2,
        );
        bloom.addColorStop(0, palette.glow);
        bloom.addColorStop(1, "transparent");
        ctx.globalAlpha = Math.max(0, alpha * 0.22);
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        drawPadelBall(pos.x, pos.y, r, rotation, alpha);
      }
      ctx.restore();
    };

    const drawSweep = (time: number) => {
      if (!animated || isMobileView()) return;
      const cycle = ((time * 0.00008) % 1) * w * 1.6 - w * 0.3;
      const grad = ctx.createLinearGradient(cycle, 0, cycle + w * 0.35, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, palette.accent);
      grad.addColorStop(1, "transparent");
      ctx.save();
      ctx.globalAlpha = 0.08 * strength;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    };

    const frame = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      drawWashes(now);
      drawCourt(now);
      drawParticles(now);
      drawSweep(now);
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
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_55%,rgba(3,17,38,0.18)_100%)] opacity-40 mix-blend-multiply max-md:opacity-25" />
    </div>
  );
}
