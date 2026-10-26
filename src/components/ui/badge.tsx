import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-blue-600 text-white",
  secondary: "bg-slate-700 text-slate-200",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-600 text-white",
  destructive: "bg-rose-600 text-white",
  outline: "border border-slate-700 text-slate-300",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const styles = `${base} ${variantStyles[variant]} ${className}`.trim();

  return (
    <span className={styles} {...props}>
      {children}
    </span>
  );
}
