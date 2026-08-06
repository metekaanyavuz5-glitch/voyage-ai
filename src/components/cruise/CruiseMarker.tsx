"use client";

import { Ship } from "lucide-react";
import { cn } from "@/lib/utils";

interface CruiseMarkerProps {
  cruiseCount: number;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Visual for a departure-port marker. Rendered into a detached DOM node and
 * mounted via `mapboxgl.Marker({ element })` inside `CruiseMap`, so it stays
 * a normal React component rather than a hand-built HTML string.
 */
export function CruiseMarker({ cruiseCount, isSelected, onClick }: CruiseMarkerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center"
      aria-label={`${cruiseCount} cruises from this port`}
    >
      <span
        className={cn(
          "absolute -inset-2 rounded-full bg-blue-500/30 opacity-0 transition-opacity duration-300",
          isSelected ? "animate-ping opacity-60" : "group-hover:opacity-40",
        )}
      />
      <span
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform duration-200 group-hover:scale-110",
          isSelected
            ? "bg-gradient-to-br from-indigo-600 to-blue-700"
            : "bg-gradient-to-br from-blue-500 to-blue-700",
        )}
      >
        <Ship className="h-4 w-4 text-white" />
      </span>
      <span className="mt-1 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-slate-900 shadow-sm">
        {cruiseCount}
      </span>
    </button>
  );
}
