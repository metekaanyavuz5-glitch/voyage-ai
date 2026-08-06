import { Skeleton } from "@/components/ui/skeleton";

export function CruiseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3.5 w-2/5" />
        <div className="flex flex-col gap-2 pt-1">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <div className="mt-2 flex items-end justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CruiseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CruiseCardSkeleton key={index} />
      ))}
    </div>
  );
}
