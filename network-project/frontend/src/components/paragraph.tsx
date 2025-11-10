// Core
import { ReactNode } from "react";

// Libraries
import clsx from "clsx";

interface ParagraphProps {
  children: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "bold";
}

export function Paragraph({
  children,
  className,
  size = "md",
  weight = "normal",
}: ParagraphProps) {
  const textSize: string = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const fontWeight: string = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
  }[weight];

  return (
    <p className={clsx(textSize, fontWeight, className)}>
      {children}
    </p>
  );
}
