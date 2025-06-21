"use client";

import { Button } from "../ui/button";
import { X } from "lucide-react";
import React from "react";

interface MenuIconProps {
  onClick: (e: React.MouseEvent) => void;
  isClose?: boolean;
}

export default function MenuIcon({ onClick, isClose = false }: MenuIconProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="text-foreground z-[130]"
      aria-label={isClose ? "Close menu" : "Open menu"}
      data-testid={isClose ? "menu-close" : "menu-open"}
    >
      {isClose ? (
        <X className="w-6 h-6" />
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      )}
    </Button>
  );
}