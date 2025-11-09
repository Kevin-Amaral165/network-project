import { ReactNode } from "react";
import clsx from "clsx";

interface TitleProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  weight?: "normal" | "medium" | "bold";
  className?: string;
}

export function Title({
  children,
  size = "lg",
  weight = "bold",
  className,
}: TitleProps) {
  const textSize = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }[size];

  const fontWeight = {
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
