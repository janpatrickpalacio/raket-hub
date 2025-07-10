'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import useServiceContext from '../contexts/service-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DeliveryTime, useServicesSearchStore } from '../stores/use-services-search-store';
import { setParam } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTopLoader } from 'nextjs-toploader';

export default function FilterSectionMobile() {
  const [open, setOpen] = useState<boolean>(false);
  const { query, appliedFilters, draftFilters, setQuery, setAppliedFilters, setDraftFilters, resetFilters } =
    useServicesSearchStore();
  const { categories, subcategories } = useServiceContext();
  const searchParams = useSearchParams();
  const loader = useTopLoader();
  const router = useRouter();
  const pathname = usePathname();
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
    setAppliedFilters(draftFilters);
    setOpen(false);
    loader.start();
    router.push(`${pathname}?${params.toString()}`);
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

  return (
    <div className='flex items-center gap-2 sm:hidden'>
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder='Search for a service (e.g. Logo Design)'
        className='bg-white text-sm'
      />
      <Drawer open={open} onOpenChange={handleCloseFilter}>
        <DrawerTrigger asChild>
          <Button variant='outline'>
            <Filter size={14} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='pt-2 pb-0'>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Apply filters to refine your results.</DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-4 p-4 [&_label]:text-xs'>
            <div className='flex flex-col gap-1'>
              <Label htmlFor='category'>Category</Label>
              <Select value={draftFilters.category || undefined} onValueChange={handleSelectCategory}>
                <SelectTrigger id='category' className='w-full bg-white'>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  {categories?.map(({ slug, name }) => (
                    <SelectItem key={slug} value={slug}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor='subcategory'>Subcategory</Label>
              <Select
                value={draftFilters.subcategory || undefined}
                onValueChange={handleSelectSubcategory}
                disabled={isSubcategoryDisabled}
              >
                <SelectTrigger id='subcategory' className='w-full bg-white'>
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
            {/* <div className='flex flex-col gap-1'>
            <Label htmlFor='location'>Location</Label>
            <Input id='location' placeholder='Enter a location' className='bg-white text-sm' />
          </div> */}
            <div className='flex flex-col gap-1'>
              <Label htmlFor='price-range'>Price Range (PHP)</Label>
              <div className='flex items-center gap-2'>
                <Input
                  id='price-range'
                  value={draftFilters.priceMin || 0}
                  onChange={e => setDraftFilters({ ...draftFilters, priceMin: Number(e.target.value) })}
                  type='number'
                  placeholder='Min'
                  className='bg-white text-sm'
                />
                <span>-</span>
                <Input
                  value={draftFilters.priceMax || 0}
                  onChange={e => setDraftFilters({ ...draftFilters, priceMax: Number(e.target.value) })}
                  type='number'
                  placeholder='Max'
                  className='bg-white text-sm'
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
            <div className='flex flex-col gap-1'>
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
            <div className='flex items-center gap-2 [&>*]:grow'>
              <Button onClick={handleResetFilters} variant='outline' className='active:bg-neutral-50'>
                Clear All
              </Button>
              <Button onClick={handleApplyFilters} className='bg-blue-500 active:bg-blue-600'>
                Apply
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
