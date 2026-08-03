"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/cn";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type ButtonVariant = "primary" | "secondary" | "ghost" | "lime";
type ButtonSize = "md" | "lg";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
};

type ButtonAsButton = BaseProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className"
  > & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  external?: boolean;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary: "bg-pw-lime text-pw-navy-deep hover:bg-[#c8f85a]",
  secondary:
    "bg-transparent text-pw-white border border-white/35 hover:border-white hover:bg-white/5",
  ghost:
    "bg-transparent text-pw-ink border border-pw-ink/15 hover:border-pw-ink/40",
  lime: "bg-pw-lime text-pw-navy-deep hover:brightness-105",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
};

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = "primary",
    size = "md",
    magnetic = false,
  } = props;
  const { profile, layer } = useMotionPreferences();
  const enableMagnetic =
    magnetic && profile.enableMagnetic && layer === "fullMotion";

  const nodeRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enableMagnetic) return;
      const node = nodeRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.18);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.18);
    },
    [enableMagnetic, x, y],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background,border-color,filter] duration-300 ease-out",
    variants[variant],
    sizes[size],
    className,
  );

  const motionStyle = enableMagnetic
    ? { x: springX, y: springY }
    : undefined;

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <motion.a
          ref={(node) => {
            nodeRef.current = node;
          }}
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          style={motionStyle}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <motion.div style={motionStyle} className="inline-flex">
        <Link
          href={props.href}
          className={classes}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          ref={(node) => {
            nodeRef.current = node;
          }}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  const { type, disabled, onClick, ...rest } = props as ButtonAsButton;

  return (
    <motion.button
      ref={(node) => {
        nodeRef.current = node;
      }}
      type={type ?? "button"}
      className={classes}
      style={motionStyle}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      onClick={onClick}
      aria-label={rest["aria-label"]}
    >
      {children}
    </motion.button>
  );
}
