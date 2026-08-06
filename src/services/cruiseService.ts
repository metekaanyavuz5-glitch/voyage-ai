import { mockCruises } from "@/data/mockCruises";
import { mockPorts } from "@/data/mockPorts";
import {
  DURATION_BUCKETS,
  RATING_OPTIONS,
  type Cruise,
  type CruiseFilters,
  type CruisePort,
} from "@/types/cruise";

/**
 * API layer for the Cruise Search module.
 *
 * Every exported function here is the seam where mock data gets swapped for
 * a real backend. Each function already returns a `Promise`, matches the
 * shape a real endpoint would return, and is where React Query hooks
 * (`/hooks/useCruises.ts`) get their data — so no caller above this file
 * needs to change when the TODOs below are resolved.
 */

const MOCK_LATENCY_MS = 400;

function simulateNetworkLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
}

export function matchesDurationBucket(nights: number, bucketId: CruiseFilters["duration"]): boolean {
  const bucket = DURATION_BUCKETS.find((b) => b.id === bucketId);
  if (!bucket) return true;
  return nights >= bucket.min && nights <= bucket.max;
}

export function matchesRating(rating: number, ratingId: CruiseFilters["rating"]): boolean {
  const option = RATING_OPTIONS.find((r) => r.id === ratingId);
  if (!option) return true;
  return rating >= option.min;
}

/** Pure filter predicate — exported so it can be unit tested independently of the async layer. */
export function applyCruiseFilters(cruises: Cruise[], filters: Partial<CruiseFilters>): Cruise[] {
  return cruises.filter((cruise) => {
    if (filters.departurePort && cruise.departurePort !== filters.departurePort) return false;
    if (filters.destination && cruise.destination !== filters.destination) return false;
    if (filters.cruiseLine && cruise.cruiseLine !== filters.cruiseLine) return false;
    if (filters.ship && cruise.shipName !== filters.ship) return false;
    if (filters.priceRange && (cruise.price < filters.priceRange[0] || cruise.price > filters.priceRange[1])) {
      return false;
    }
    if (filters.duration && !matchesDurationBucket(cruise.duration, filters.duration)) return false;
    if (filters.rating && !matchesRating(cruise.rating, filters.rating)) return false;
    return true;
  });
}

/**
 * Fetch cruises, optionally filtered.
 *
 * TODO(api): replace the body with:
 *   const params = new URLSearchParams(serializeFilters(filters));
 *   const res = await fetch(`/api/cruises?${params}`);
 *   if (!res.ok) throw new Error("Failed to load cruises");
 *   return res.json() as Promise<Cruise[]>;
 */
export async function getCruises(filters?: Partial<CruiseFilters>): Promise<Cruise[]> {
  await simulateNetworkLatency();
  return filters ? applyCruiseFilters(mockCruises, filters) : mockCruises;
}

/**
 * Fetch a single cruise by id.
 *
 * TODO(api): replace with `fetch(`/api/cruises/${id}`)`.
 */
export async function getCruiseById(id: string): Promise<Cruise | null> {
  await simulateNetworkLatency();
  return mockCruises.find((cruise) => cruise.id === id) ?? null;
}

/**
 * Fetch departure ports for the map.
 *
 * TODO(api): replace with `fetch('/api/ports')`.
 */
export async function getPorts(): Promise<CruisePort[]> {
  await simulateNetworkLatency();
  return mockPorts;
}

export async function getPortById(id: string): Promise<CruisePort | null> {
  await simulateNetworkLatency();
  return mockPorts.find((port) => port.id === id) ?? null;
}
