import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_FILTERS,
  DEFAULT_SEARCH_PARAMS,
  type Cruise,
  type CruiseFilters,
  type CruiseSearchParams,
} from "@/types/cruise";

interface CruiseStore {
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
}

export const useCruiseStore = create<CruiseStore>()(
  persist(
    (set, get) => ({
      filters: DEFAULT_FILTERS,
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      clearFilters: () => set({ filters: DEFAULT_FILTERS }),

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
    }),
    {
      name: "cruise-store",
      // Only favorites need to survive a reload; filters/selection are session-scoped.
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
