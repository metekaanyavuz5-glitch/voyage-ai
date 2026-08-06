import { mockCruises, PORT_COORDINATES, PORT_COUNTRIES } from "@/data/mockCruises";
import type { CruisePort } from "@/types/cruise";

/**
 * Departure ports shown as markers on the cruise map. Cruise counts are
 * derived from `mockCruises` so the map and the results list can never
 * disagree. Once a real API is connected, this can either keep deriving
 * counts client-side or read a `cruiseCount` field straight off the response.
 */
export const mockPorts: CruisePort[] = Object.entries(PORT_COORDINATES).map(
  ([name, coordinates], index) => ({
    id: `port-${index}`,
    name,
    country: PORT_COUNTRIES[name],
    coordinates,
    cruiseCount: mockCruises.filter((cruise) => cruise.departurePort === name).length,
  }),
);
