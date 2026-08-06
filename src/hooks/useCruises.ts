import { useQuery } from "@tanstack/react-query";
import { getCruiseById, getCruises, getPorts } from "@/services/cruiseService";
import type { CruiseFilters } from "@/types/cruise";

/**
 * Cruise list, refetched whenever filters change. Once `cruiseService`
 * talks to a real API, `filters` will simply be serialized into the query
 * string — the hook's public shape stays identical.
 */
export function useCruises(filters?: Partial<CruiseFilters>) {
  return useQuery({
    queryKey: ["cruises", filters ?? null],
    queryFn: () => getCruises(filters),
  });
}

export function useCruise(id: string | null) {
  return useQuery({
    queryKey: ["cruise", id],
    queryFn: () => (id ? getCruiseById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function usePorts() {
  return useQuery({
    queryKey: ["ports"],
    queryFn: getPorts,
    staleTime: Infinity, // ports are effectively static reference data
  });
}
