import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CruiseErrorStateProps {
  onRetry: () => void;
}

export function CruiseErrorState({ onRetry }: CruiseErrorStateProps) {
  return (
    <div className="glass-card flex flex-col items-center gap-4 rounded-3xl border border-destructive/30 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">Couldn&apos;t load cruises</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Something went wrong while fetching cruise results. Please try again.
        </p>
      </div>
      <Button className="rounded-full" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}
