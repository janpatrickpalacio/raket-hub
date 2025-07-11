import { Database } from '@/lib/supabase/types';
import { create } from 'zustand';

type PricingType = Database['public']['Enums']['pricing_type_enum'];

interface ImageFile {
  file: File;
  blobUrl: string;
}

interface RaketFormState {
  formValues: FormValues;
}

interface FormValues {
  title: string;
  description: string;
  categoryId: number | null;
  subcategoryId: number | null;
  pricingType: PricingType;
  price: number;
  coverImageFile: ImageFile | null;
  galleryImageFiles: ImageFile[];
  deliveryDays: number;
}

interface RaketFormActions {
  setFormValues: (formValues: FormValues) => void;
  // updateTitle: (title: string) => void;
  // updateDescription: (description: string) => void;
  // updateSubcategoryId: (subcategoryId: number) => void;
  // updatePricingType: (pricingType: PricingType) => void;
  // updatePrice: (price: number) => void;
  // updateCoverImageFile: (coverImageFile: ImageFile | null) => void;
  // updateGalleryImageFiles: (galleryImageFiles: ImageFile[]) => void;
  // updateDeliveryDays: (deliveryDays: number) => void;
  reset: () => void;
}

type RaketFormStore = RaketFormState & RaketFormActions;

export const useRaketFormStore = create<RaketFormStore>(set => ({
  formValues: {
    title: '',
    description: '',
    categoryId: null,
    subcategoryId: null,
    pricingType: 'Fixed',
    price: 0,
    deliveryDays: 0,
    coverImageFile: null,
    galleryImageFiles: [],
  },
  setFormValues: (formValues: FormValues) => set({ formValues }),
  reset: () =>
    set({
      formValues: {
        title: '',
        description: '',
        categoryId: null,
        subcategoryId: null,
        pricingType: 'Fixed',
        price: 0,
        deliveryDays: 0,
        coverImageFile: null,
        galleryImageFiles: [],
      },
    }),
}));
