"use client";

// Core
import { ReactNode } from "react";

interface NavbarProps {
  actions: ReactNode;
  title?: string;
}

export function Navbar({ title, actions }: NavbarProps) {
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
