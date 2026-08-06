import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CruiseEmptyStateProps {
  onClearFilters: () => void;
}

export function CruiseEmptyState({ onClearFilters }: CruiseEmptyStateProps) {
  return (
    <div className="glass-card flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
        <SearchX className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">No cruises match your search</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try widening your price range, choosing a different port, or clearing filters to see
          more sailings.
        </p>
      </div>
      <Button variant="outline" className="rounded-full" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
