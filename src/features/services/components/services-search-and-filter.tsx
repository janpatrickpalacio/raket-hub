'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FilterSectionDesktop from '@/features/services/components/filter-section-desktop';
import FilterSectionMobile from '@/features/services/components/filter-section-mobile';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTopLoader } from 'nextjs-toploader';
import { DeliveryTime, useServicesSearchStore } from '../stores/use-services-search-store';
import { useEffect, useState } from 'react';

export default function ServicesSearchAndFilter() {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loader = useTopLoader();
  const { query, setQuery, resetStore, setInitialValues } = useServicesSearchStore();

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
    setInitialValues({
      query: searchParams.get('q') ?? '',
      category: searchParams.get('category') ?? '',
      subcategory: searchParams.get('subcategory') ?? '',
      province: searchParams.get('province') ?? '',
      city: searchParams.get('city') ?? '',
      priceMin: Number(searchParams.get('min')) ?? undefined,
      priceMax: Number(searchParams.get('max')) ?? undefined,
      raketeroLevels: searchParams.get('levels') ?? undefined,
      deliveryTime: (searchParams.get('days') as DeliveryTime) ?? undefined,
    });
  }, [setInitialValues, searchParams]);

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  return (
    <div onKeyDown={e => e.key === 'Enter' && handleSearch()}>
      <div className='mt-4 hidden items-center gap-2 lg:flex'>
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search for a service (e.g. Logo Design)'
          className='rounded-full bg-white py-5 text-sm'
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className='flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-2.5 text-sm transition-colors hover:bg-neutral-100'>
            <Filter size={16} /> Filters
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-2xl'>Filters</DialogTitle>
            </DialogHeader>
            <FilterSectionDesktop setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className='flex items-center gap-2 lg:hidden'>
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search for a service (e.g. Logo Design)'
          className='bg-white text-sm'
        />
        <FilterSectionMobile />
      </div>
    </div>
  );
}
