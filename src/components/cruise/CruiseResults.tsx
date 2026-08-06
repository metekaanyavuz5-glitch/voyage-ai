"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CruiseCard } from "@/components/cruise/CruiseCard";
import { CruiseEmptyState } from "@/components/cruise/CruiseEmptyState";
import { CruiseErrorState } from "@/components/cruise/CruiseErrorState";
import { CruiseGridSkeleton } from "@/components/cruise/CruiseCardSkeleton";
import { useCruises } from "@/hooks/useCruises";
import { useCruiseStore } from "@/store/useCruiseStore";

export function CruiseResults() {
  const filters = useCruiseStore((state) => state.filters);
  const clearFilters = useCruiseStore((state) => state.clearFilters);
  const { data: cruises, isLoading, isError, refetch } = useCruises(filters);

  return (
    <div id="cruise-results" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {isLoading ? "Searching cruises…" : `${cruises?.length ?? 0} Cruises Found`}
        </h2>
      </div>

      {isLoading && <CruiseGridSkeleton />}

      {!isLoading && isError && <CruiseErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && cruises && cruises.length === 0 && (
        <CruiseEmptyState onClearFilters={clearFilters} />
      )}

      {!isLoading && !isError && cruises && cruises.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {cruises.map((cruise) => (
              <CruiseCard key={cruise.id} cruise={cruise} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
