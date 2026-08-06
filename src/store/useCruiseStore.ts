import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_FILTERS,
  DEFAULT_SEARCH_PARAMS,
  type Cruise,
  type CruiseFilters,
  type CruisePort,
  type CruiseSearchParams,
} from "@/types/cruise";

interface CruiseStore {
  selectedPort: CruisePort | null;
  setSelectedPort: (port: CruisePort | null) => void;

  filters: CruiseFilters;
  setFilters: (filters: Partial<CruiseFilters>) => void;
  clearFilters: () => void;

  searchParams: CruiseSearchParams;
  setSearchParams: (params: Partial<CruiseSearchParams>) => void;

  selectedCruise: Cruise | null;
  setSelectedCruise: (cruise: Cruise | null) => void;

  favorites: string[];
  toggleFavorite: (cruiseId: string) => void;
  isFavorite: (cruiseId: string) => boolean;

  /** Filters a marker's "View Cruises" action funnels into: sets both the map selection and the port filter. */
  viewCruisesForPort: (port: CruisePort) => void;
}

export const useCruiseStore = create<CruiseStore>()(
  persist(
    (set, get) => ({
      selectedPort: null,
      setSelectedPort: (port) => set({ selectedPort: port }),

      filters: DEFAULT_FILTERS,
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      clearFilters: () => set({ filters: DEFAULT_FILTERS, selectedPort: null }),

      searchParams: DEFAULT_SEARCH_PARAMS,
      setSearchParams: (params) =>
        set((state) => ({ searchParams: { ...state.searchParams, ...params } })),

      selectedCruise: null,
      setSelectedCruise: (cruise) => set({ selectedCruise: cruise }),

      favorites: [],
      toggleFavorite: (cruiseId) =>
        set((state) => ({
          favorites: state.favorites.includes(cruiseId)
            ? state.favorites.filter((id) => id !== cruiseId)
            : [...state.favorites, cruiseId],
        })),
      isFavorite: (cruiseId) => get().favorites.includes(cruiseId),

      viewCruisesForPort: (port) =>
        set((state) => ({
          selectedPort: port,
          filters: { ...state.filters, departurePort: port.name },
        })),
    }),
    {
      name: "cruise-store",
      // Only favorites need to survive a reload; filters/selection are session-scoped.
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
