import { Database } from '@/lib/supabase/types';
import { create } from 'zustand';

type PricingType = Database['public']['Enums']['pricing_type_enum'];

interface ImageFile {
  file: File;
  blobUrl: string;
}

interface RaketFormState {
  title: string;
  description: string;
  subcategoryId: number;
  pricingType: PricingType;
  price: number;
  coverImageFile: ImageFile | null;
  galleryImageFiles: ImageFile[];
  deliveryDays: number;
}

interface RaketFormActions {
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  updateSubcategoryId: (subcategoryId: number) => void;
  updatePricingType: (pricingType: PricingType) => void;
  updatePrice: (price: number) => void;
  updateCoverImageFile: (coverImageFile: ImageFile | null) => void;
  updateGalleryImageFiles: (galleryImageFiles: ImageFile[]) => void;
  updateDeliveryDays: (deliveryDays: number) => void;
  reset: () => void;
}

type RaketFormStore = RaketFormState & RaketFormActions;

export const useRaketFormStore = create<RaketFormStore>(set => ({
  title: '',
  description: '',
  subcategoryId: 0,
  pricingType: 'Fixed',
  price: 0,
  coverImageFile: null,
  galleryImageFiles: [],
  deliveryDays: 0,
  updateTitle: (title: string) => set({ title }),
  updateDescription: (description: string) => set({ description }),
  updateSubcategoryId: (subcategoryId: number) => set({ subcategoryId }),
  updatePricingType: (pricingType: PricingType) => set({ pricingType }),
  updatePrice: (price: number) => set({ price }),
  updateCoverImageFile: (coverImageFile: ImageFile | null) => set({ coverImageFile }),
  updateGalleryImageFiles: (galleryImageFiles: ImageFile[]) => set({ galleryImageFiles }),
  updateDeliveryDays: (deliveryDays: number) => set({ deliveryDays }),
  reset: () =>
    set({
      title: '',
      description: '',
      subcategoryId: 0,
      pricingType: 'Fixed',
      price: 0,
      deliveryDays: 0,
      coverImageFile: null,
      galleryImageFiles: [],
    }),
}));
