"use client";

import { CalendarDays, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatDuration } from "@/lib/format";
import type { Cruise } from "@/types/cruise";

interface CruisePinPopupProps {
  cruise: Cruise;
  onViewDetails: () => void;
}

/** Content rendered inside the map popup when a cruise pin is clicked. */
export function CruisePinPopup({ cruise, onViewDetails }: CruisePinPopupProps) {
  return (
    <div className="flex w-60 flex-col gap-2 p-1">
      <div className="flex items-start gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400">
          <Ship className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight text-foreground">{cruise.cruiseName}</p>
          <p className="text-xs text-muted-foreground">{cruise.shipName}</p>
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        {formatDate(cruise.departureDate)} · {formatDuration(cruise.duration)}
      </p>
      <p className="text-sm font-bold text-foreground">
        {formatCurrency(cruise.price)}
        <span className="text-xs font-normal text-muted-foreground"> /guest, estimated</span>
      </p>
      <Button
        size="sm"
        onClick={onViewDetails}
        className="mt-1 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
      >
        View Details
      </Button>
    </div>
  );
}
