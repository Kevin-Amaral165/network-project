// Core
import { ReactNode } from "react";

// Libraries
import clsx from "clsx";

interface TitleProps {
  children: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  weight?: "normal" | "medium" | "bold";
}

export function Title({
  children,
  className,
  size = "lg",
  weight = "bold",
}: TitleProps) {
  const textSize: string = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }[size];

  const fontWeight: string = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
  }[weight];

  return (
    <h1 className={clsx(textSize, fontWeight, className)}>
      {children}
    </h1>
  );
}
