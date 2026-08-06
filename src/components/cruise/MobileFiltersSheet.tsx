"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CruiseFilters } from "@/components/cruise/CruiseFilters";

export function MobileFiltersSheet() {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" className="w-full justify-center gap-2 rounded-xl lg:hidden" />}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <CruiseFilters />
        </div>
      </SheetContent>
    </Sheet>
  );
}
