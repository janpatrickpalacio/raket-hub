'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import useServiceContext from '../contexts/service-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { DeliveryTime, useServicesSearchStore } from '../stores/use-services-search-store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setParam } from '@/lib/utils';
import { useTopLoader } from 'nextjs-toploader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Filter } from 'lucide-react';

export default function FilterSectionDesktop() {
  const [open, setOpen] = useState<boolean>(false);
  const { query, appliedFilters, draftFilters, setQuery, setAppliedFilters, setDraftFilters, resetFilters } =
    useServicesSearchStore();

  const { categories, subcategories } = useServiceContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const loader = useTopLoader();
  const isSubcategoryDisabled = !draftFilters.category || (subcategories?.length ?? 0) === 0;
  const filteredSubcategories = useMemo(
    () =>
      subcategories?.filter(
        subcategory => categories.find(c => c.id === subcategory.category_id)?.slug === draftFilters.category
      ),
    [categories, subcategories, draftFilters.category]
  );

  const handleSelectCategory = (value: string): void => {
    if (value === draftFilters.category) return;
    setDraftFilters({ ...draftFilters, category: value, subcategory: '' });
  };

  const handleSelectSubcategory = (value: string): void => {
    if (value === draftFilters.subcategory) return;
    setDraftFilters({ ...draftFilters, subcategory: value });
  };

  const handleApplyFilters = (): void => {
    const params = new URLSearchParams(searchParams.toString());
    setParam(params, 'category', draftFilters.category);
    setParam(params, 'subcategory', draftFilters.subcategory);
    setParam(params, 'province', draftFilters.province);
    setParam(params, 'city', draftFilters.city);
    setParam(params, 'min', draftFilters.priceMin ? draftFilters.priceMin.toString() : undefined);
    setParam(params, 'max', draftFilters.priceMax ? draftFilters.priceMax.toString() : undefined);
    setParam(params, 'levels', draftFilters.raketeroLevels);
    setParam(params, 'days', Number(draftFilters.deliveryTime) > 0 ? draftFilters.deliveryTime : undefined);
    loader.start();
    router.push(`${pathname}?${params.toString()}`);
    setAppliedFilters(draftFilters);
    setOpen(false);
  };

  const handleResetFilters = (): void => {
    resetFilters();
    setOpen(false);
    loader.start();
    router.push(pathname);
  };

  const handleCloseFilter = (open: boolean): void => {
    setOpen(open);
    if (!open) {
      setDraftFilters(appliedFilters);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='mt-4 hidden items-center gap-2 sm:flex'>
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder='Search for a service (e.g. Logo Design)'
        className='rounded-full bg-white py-5 text-sm'
      />
      <Dialog open={open} onOpenChange={handleCloseFilter}>
        <DialogTrigger className='flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-2.5 text-sm transition-colors hover:bg-neutral-100'>
          <Filter size={16} /> Filters
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Filters</DialogTitle>
            <DialogDescription className='-mt-2'>
              Select the filters that you want to apply to your search.
            </DialogDescription>
          </DialogHeader>
          <div className='sticky top-0 left-0 hidden w-full flex-col gap-4 sm:flex'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-3'>
                <Label>Category</Label>
                <Select value={draftFilters.category || undefined} onValueChange={handleSelectCategory}>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {categories?.map(({ name, slug }) => (
                      <SelectItem key={slug} value={slug}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-3'>
                <Label>Subcategory</Label>
                <Select
                  value={draftFilters.subcategory || undefined}
                  onValueChange={handleSelectSubcategory}
                  disabled={isSubcategoryDisabled}
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue
                      placeholder={draftFilters.category ? 'Select a subcategory' : 'Select a category first'}
                    />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {filteredSubcategories?.map(({ slug, name }) => (
                      <SelectItem key={slug} value={slug}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-3'>
                <Label>Province</Label>
                {/* <Input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder='Enter a location'
            className='bg-white'
          /> */}
              </div>
              <div className='flex flex-col gap-3'>
                <Label>Price Range (PHP)</Label>
                <div className='flex items-center gap-2'>
                  <Input
                    value={draftFilters.priceMin || 0}
                    type='number'
                    onChange={e => setDraftFilters({ ...draftFilters, priceMin: Number(e.target.value) })}
                    placeholder='Min'
                    className='bg-white'
                  />
                  <span>-</span>
                  <Input
                    value={draftFilters.priceMax || 0}
                    type='number'
                    onChange={e => setDraftFilters({ ...draftFilters, priceMax: Number(e.target.value) })}
                    placeholder='Max'
                    className='bg-white'
                  />
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                <Label>Raketero Level</Label>
                <ToggleGroup
                  type='multiple'
                  value={draftFilters.raketeroLevels?.split(',') ?? []}
                  onValueChange={(values: string[]) =>
                    setDraftFilters({ ...draftFilters, raketeroLevels: values.join(',') })
                  }
                  className='w-full gap-2 rounded-none'
                >
                  <ToggleGroupItem
                    value='Top-Rated'
                    className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
                  >
                    Top Rated
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value='Rising'
                    className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
                  >
                    Rising
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value='New'
                    className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
                  >
                    New Raketero
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className='flex flex-col gap-3'>
                <Label>Delivery Time</Label>
                <ToggleGroup
                  value={draftFilters.deliveryTime || '-1'}
                  onValueChange={value => setDraftFilters({ ...draftFilters, deliveryTime: value as DeliveryTime })}
                  type='single'
                  className='grid w-full grid-cols-4 gap-2'
                >
                  <ToggleGroupItem
                    value='1'
                    className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
                  >
                    Express 24H
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value='3'
                    className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
                  >
                    Up to 3 days
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value='7'
                    className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
                  >
                    Up to 7 days
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value='-1'
                    className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
                  >
                    Any
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className='flex w-full gap-4'>
                <Button onClick={handleResetFilters} variant='outline' className='grow cursor-pointer'>
                  Clear Filters
                </Button>
                <Button onClick={handleApplyFilters} className='grow cursor-pointer bg-blue-600 hover:bg-blue-700'>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
