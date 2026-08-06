/**
 * Domain types for the Cruise Search module.
 *
 * These types describe the shape of data as the UI consumes it. They are
 * intentionally decoupled from any specific data source — today they are
 * satisfied by `/data/mockCruises.ts`, later by a real cruise API response
 * mapped onto this same shape inside `/services/cruiseService.ts`.
 */

export const CRUISE_LINES = [
  "Royal Caribbean",
  "MSC Cruises",
  "Carnival",
  "Norwegian Cruise Line",
  "Princess Cruises",
  "Celebrity Cruises",
] as const;

export type CruiseLine = (typeof CRUISE_LINES)[number];

export const DESTINATIONS = [
  "Caribbean",
  "Mediterranean",
  "Northern Europe",
  "Alaska",
  "Southeast Asia",
  "Bermuda",
  "Australia & South Pacific",
  "Mexican Riviera",
  "Hawaii",
] as const;

export type Destination = (typeof DESTINATIONS)[number];

/** [longitude, latitude] — Mapbox GL order. */
export type Coordinates = [number, number];

export interface ItineraryStop {
  day: number;
  /** Port/city name, or "Cruising at Sea" for sea days. */
  port: string;
  arrival: string | null;
  departure: string | null;
  isSeaDay: boolean;
}

export interface Cruise {
  id: string;
  cruiseName: string;
  cruiseLine: CruiseLine;
  shipName: string;
  departurePort: string;
  departureCoordinates: Coordinates;
  destination: Destination;
  /** ISO date string (YYYY-MM-DD) of embarkation. */
  departureDate: string;
  /** Nights aboard. */
  duration: number;
  /** Starting price per guest, in USD. */
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  bookingUrl: string;
  amenities: string[];
  itinerary: ItineraryStop[];
}

export interface CruisePort {
  id: string;
  name: string;
  country: string;
  coordinates: Coordinates;
  /** Derived count of cruises departing from this port in the mock dataset. */
  cruiseCount: number;
}

export const DURATION_BUCKETS = [
  { id: "any", label: "Any Duration", min: 0, max: Infinity },
  { id: "1-5", label: "1–5 Nights", min: 1, max: 5 },
  { id: "6-9", label: "6–9 Nights", min: 6, max: 9 },
  { id: "10-14", label: "10–14 Nights", min: 10, max: 14 },
  { id: "15+", label: "15+ Nights", min: 15, max: Infinity },
] as const;

export type DurationBucketId = (typeof DURATION_BUCKETS)[number]["id"];

export const RATING_OPTIONS = [
  { id: "any", label: "Any Rating", min: 0 },
  { id: "3.5", label: "3.5+ Stars", min: 3.5 },
  { id: "4", label: "4+ Stars", min: 4 },
  { id: "4.5", label: "4.5+ Stars", min: 4.5 },
] as const;

export type RatingOptionId = (typeof RATING_OPTIONS)[number]["id"];

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 3000];

export interface CruiseFilters {
  departurePort: string | null;
  destination: Destination | null;
  cruiseLine: CruiseLine | null;
  priceRange: [number, number];
  duration: DurationBucketId;
  ship: string | null;
  rating: RatingOptionId;
}

export const DEFAULT_FILTERS: CruiseFilters = {
  departurePort: null,
  destination: null,
  cruiseLine: null,
  priceRange: DEFAULT_PRICE_RANGE,
  duration: "any",
  ship: null,
  rating: "any",
};

export interface CruiseSearchParams {
  departurePort: string | null;
  destination: Destination | null;
  departureDate: string | null;
  duration: DurationBucketId;
  guests: number;
}

export const DEFAULT_SEARCH_PARAMS: CruiseSearchParams = {
  departurePort: null,
  destination: null,
  departureDate: null,
  duration: "any",
  guests: 2,
};
