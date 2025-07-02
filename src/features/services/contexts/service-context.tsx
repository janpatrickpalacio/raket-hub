'use client';

import { createContext, useContext } from 'react';
import { Database } from '@/lib/supabase/types';

export interface ServiceContextProps {
  categories: Database['public']['Tables']['categories']['Row'][];
  subcategories: Database['public']['Tables']['subcategories']['Row'][];
}

export const ServiceContext = createContext<ServiceContextProps>({ categories: [], subcategories: [] });

export function ServiceProvider({ value, children }: { value: ServiceContextProps; children: React.ReactNode }) {
  const { categories, subcategories } = value;
  return <ServiceContext.Provider value={{ categories, subcategories }}>{children}</ServiceContext.Provider>;
}

export default function useServiceContext() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServiceContext must be used within a ServiceProvider');
  }
  return context;
}
