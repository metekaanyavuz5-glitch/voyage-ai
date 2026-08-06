"use client";

import { Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CruisePort } from "@/types/cruise";

interface PortPopupProps {
  port: CruisePort;
  onViewCruises: () => void;
}

/**
 * Content rendered inside the Mapbox popup when a port marker is clicked.
 * Kept as a standalone component so it can also be reused outside the map
 * (e.g. a future "nearby ports" list) without duplicating markup.
 */
export function PortPopup({ port, onViewCruises }: PortPopupProps) {
  return (
    <div className="flex w-56 flex-col gap-2 p-1">
      <div className="flex items-start gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400">
          <Ship className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight text-foreground">{port.name}</p>
          <p className="text-xs text-muted-foreground">{port.country}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{port.cruiseCount}</span> cruise
        {port.cruiseCount === 1 ? "" : "s"} departing from here
      </p>
      <Button
        size="sm"
        onClick={onViewCruises}
        className="mt-1 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
      >
        View Cruises
      </Button>
    </div>
  );
}
