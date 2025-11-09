import { ReactNode } from "react";
import clsx from "clsx";

interface ParagraphProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "bold";
  className?: string;
}

export function Paragraph({
  children,
  size = "md",
  weight = "normal",
  className,
}: ParagraphProps) {
  const textSize = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const fontWeight = {
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
