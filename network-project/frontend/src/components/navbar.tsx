"use client";

import { ReactNode } from "react";
import { Button } from "./button";

interface NavbarProps {
  title?: string;
  actions?: ReactNode;
}

export function Navbar({ title = "MyApp", actions }: NavbarProps) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">{title}</div>
        <div className="flex items-center gap-4">
          {actions}
        </div>
      </div>
    </nav>
  );
}
