"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useMagnetic } from "@/components/motion/useMagnetic";

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
  primary: "bg-pw-lime text-pw-navy-deep hover:bg-pw-lime-hover",
  secondary:
    "bg-transparent text-pw-white border border-white/35 hover:border-white hover:bg-white/5",
  ghost:
    "bg-transparent text-pw-ink border border-pw-ink/15 hover:border-pw-ink/40",
  lime: "bg-pw-lime text-pw-navy-deep hover:bg-pw-lime-hover",
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
  const {
    ref: nodeRef,
    style: motionStyle,
    onMouseMove,
    onMouseLeave,
  } = useMagnetic({ enabled: magnetic });

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background,border-color,filter] duration-300 ease-out",
    variants[variant],
    sizes[size],
    className,
  );

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
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
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
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
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
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      onClick={onClick}
      aria-label={rest["aria-label"]}
    >
      {children}
    </motion.button>
  );
}
