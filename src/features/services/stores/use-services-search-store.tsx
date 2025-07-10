import { create } from 'zustand';

interface ServicesStore {
  query: string;
  appliedFilters: FilterValues;
  draftFilters: FilterValues;
  setQuery: (query: string) => void;
  setAppliedFilters: (appliedFilters: FilterValues) => void;
  setDraftFilters: (draftFilters: FilterValues) => void;
  resetFilters: () => void;
  resetStore: () => void;
}

export type DeliveryTime = '1' | '3' | '7' | '-1';

type FilterValues = {
  category?: string;
  subcategory?: string;
  province?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  raketeroLevels?: string;
  deliveryTime?: DeliveryTime;
};

export const useServicesSearchStore = create<ServicesStore>(set => ({
  query: '',
  appliedFilters: {},
  draftFilters: {},
  setQuery: (query: string) => set({ query }),
  setAppliedFilters: (appliedFilters: FilterValues) => set({ appliedFilters }),
  setDraftFilters: (draftFilters: FilterValues) => set({ draftFilters }),
  resetFilters: () => set({ appliedFilters: {}, draftFilters: {} }),
  resetStore: () =>
    set({
      query: '',
      appliedFilters: {},
      draftFilters: {},
    }),
}));
