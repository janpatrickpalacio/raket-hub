import { create } from 'zustand';

interface ServicesStore {
  query: string;
  category: string;
  subcategory: string;
  province: string;
  city: string;
  priceMin?: number;
  priceMax?: number;
  raketeroLevels?: string;
  deliveryTime?: DeliveryTime;
  setQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSubcategory: (subcategory: string) => void;
  setProvince: (province: string) => void;
  setCity: (city: string) => void;
  setPriceMin: (priceMin?: number) => void;
  setPriceMax: (priceMax?: number) => void;
  setRaketeroLevels: (raketeroLevels?: string) => void;
  setDeliveryTime: (deliveryTime?: DeliveryTime) => void;
  setInitialValues: (initialValues: SearchValues) => void;
  resetStore: () => void;
}

export type DeliveryTime = '1' | '3' | '7' | '-1';

type SearchValues = Pick<
  ServicesStore,
  | 'query'
  | 'category'
  | 'subcategory'
  | 'province'
  | 'city'
  | 'priceMin'
  | 'priceMax'
  | 'raketeroLevels'
  | 'deliveryTime'
>;

export const useServicesSearchStore = create<ServicesStore>(set => ({
  query: '',
  category: '',
  subcategory: '',
  province: '',
  city: '',
  setQuery: (query: string) => set({ query }),
  setCategory: (category: string) => set({ category }),
  setSubcategory: (subcategory: string) => set({ subcategory }),
  setProvince: (province: string) => set({ province }),
  setCity: (city: string) => set({ city }),
  setPriceMin: (priceMin?: number) => set({ priceMin }),
  setPriceMax: (priceMax?: number) => set({ priceMax }),
  setRaketeroLevels: (raketeroLevels?: string) => set({ raketeroLevels }),
  setDeliveryTime: (deliveryTime?: DeliveryTime) => set({ deliveryTime }),
  setInitialValues: (initialValues: SearchValues) => set(initialValues),
  resetStore: () =>
    set({
      query: '',
      category: '',
      subcategory: '',
      province: '',
      city: '',
      priceMin: undefined,
      priceMax: undefined,
      raketeroLevels: undefined,
      deliveryTime: undefined,
    }),
}));
