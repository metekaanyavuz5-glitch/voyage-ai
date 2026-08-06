"use client";

import { Ship } from "lucide-react";

interface CruisePinProps {
  onClick?: () => void;
  cruiseName: string;
}

/**
 * Visual for a single cruise marker. Rendered into a detached DOM node and
 * mounted via `Marker({ element })` inside `CruiseMap`, so it stays a normal
 * React component rather than a hand-built HTML string.
 */
export function CruisePin({ onClick, cruiseName }: CruisePinProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex items-center justify-center"
      aria-label={cruiseName}
    >
      <span className="absolute -inset-1.5 rounded-full bg-blue-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-50" />
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg transition-transform duration-200 group-hover:scale-125">
        <Ship className="h-3 w-3 text-white" />
      </span>
    </button>
  );
}
