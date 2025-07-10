'use client';

import FilterSectionDesktop from '@/features/services/components/filter-section-desktop';
import FilterSectionMobile from '@/features/services/components/filter-section-mobile';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTopLoader } from 'nextjs-toploader';
import { DeliveryTime, useServicesSearchStore } from '../stores/use-services-search-store';
import { useEffect } from 'react';

export default function ServicesSearchAndFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loader = useTopLoader();
  const { query, setQuery, resetStore, setAppliedFilters, setDraftFilters } = useServicesSearchStore();

  const handleSearch = (): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    setQuery(query || '');
    loader.start();
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const currentFilters = {
      category: searchParams.get('category') ?? '',
      subcategory: searchParams.get('subcategory') ?? '',
      province: searchParams.get('province') ?? '',
      city: searchParams.get('city') ?? '',
      priceMin: Number(searchParams.get('min')) ?? undefined,
      priceMax: Number(searchParams.get('max')) ?? undefined,
      raketeroLevels: searchParams.get('levels') ?? undefined,
      deliveryTime: (searchParams.get('days') as DeliveryTime) ?? undefined,
    };

    setQuery(searchParams.get('q') ?? '');
    setAppliedFilters(currentFilters);
    setDraftFilters(currentFilters);
  }, [setQuery, setAppliedFilters, setDraftFilters, searchParams]);

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  return (
    <div onKeyDown={e => e.key === 'Enter' && handleSearch()}>
      <FilterSectionDesktop />
      <FilterSectionMobile />
    </div>
  );
}
