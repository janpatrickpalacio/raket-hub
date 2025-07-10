'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FilterSectionDesktop from '@/features/services/components/filter-section-desktop';
import FilterSectionMobile from '@/features/services/components/filter-section-mobile';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useTopLoader } from 'nextjs-toploader';

export default function ServicesSearchAndFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loader = useTopLoader();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');

  const handleSearch = (): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    loader.start();
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div onKeyDown={e => e.key === 'Enter' && handleSearch()}>
      <div className='mt-4 hidden items-center gap-2 lg:flex'>
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search for a service (e.g. Logo Design)'
          className='rounded-full bg-white py-5 text-sm'
        />
        <Dialog>
          <DialogTrigger className='flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-2.5 text-sm transition-colors hover:bg-neutral-100'>
            <Filter size={16} /> Filters
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-2xl'>Filters</DialogTitle>
            </DialogHeader>
            <FilterSectionDesktop />
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
