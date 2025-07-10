'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo } from 'react';
import useServiceContext from '../contexts/service-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { DeliveryTime, useServicesSearchStore } from '../stores/use-services-search-store';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setParam } from '@/lib/utils';
import { useTopLoader } from 'nextjs-toploader';

interface Props {
  setOpen: (value: boolean) => void;
}

export default function FilterSectionDesktop({ setOpen }: Props) {
  const {
    category,
    subcategory,
    province,
    city,
    priceMin,
    priceMax,
    raketeroLevels,
    deliveryTime,
    setCategory,
    setSubcategory,
    setPriceMin,
    setPriceMax,
    setRaketeroLevels,
    setDeliveryTime,
  } = useServicesSearchStore();
  const { categories, subcategories } = useServiceContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const loader = useTopLoader();
  const isSubcategoryDisabled = !category || (subcategories?.length ?? 0) === 0;
  const filteredSubcategories = useMemo(
    () =>
      subcategories?.filter(subcategory => categories.find(c => c.id === subcategory.category_id)?.slug === category),
    [categories, subcategories, category]
  );

  const handleSelectCategory = (value: string): void => {
    if (value === category) return;
    setCategory(value);
  };

  const handleSelectSubcategory = (value: string): void => {
    if (value === subcategory) return;
    setSubcategory(value);
  };

  const handleApplyFilters = (): void => {
    const params = new URLSearchParams(searchParams.toString());
    setParam(params, 'category', category);
    setParam(params, 'subcategory', subcategory);
    setParam(params, 'province', province);
    setParam(params, 'city', city);
    setParam(params, 'min', priceMin ? priceMin.toString() : undefined);
    setParam(params, 'max', priceMax ? priceMax.toString() : undefined);
    setParam(params, 'levels', raketeroLevels);
    setParam(params, 'days', Number(deliveryTime) > 0 ? deliveryTime : undefined);
    loader.start();
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className='sticky top-0 left-0 hidden w-full flex-col gap-4 lg:flex'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <Label>Category</Label>
          <Select value={category} onValueChange={handleSelectCategory}>
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
          <Select value={subcategory} onValueChange={handleSelectSubcategory} disabled={isSubcategoryDisabled}>
            <SelectTrigger className='w-full bg-white'>
              <SelectValue placeholder={category ? 'Select a subcategory' : 'Select a category first'} />
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
              value={priceMin}
              type='number'
              onChange={e => setPriceMin(Number(e.target.value))}
              placeholder='Min'
              className='bg-white'
            />
            <span>-</span>
            <Input
              value={priceMax}
              type='number'
              onChange={e => setPriceMax(Number(e.target.value))}
              placeholder='Max'
              className='bg-white'
            />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Raketero Level</Label>
          <ToggleGroup
            type='multiple'
            value={raketeroLevels?.split(',') ?? []}
            onValueChange={(values: string[]) => setRaketeroLevels(values.join(',') || undefined)}
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
          <RadioGroup
            defaultValue='any'
            value={Number(deliveryTime) > 0 ? deliveryTime : '-1'}
            onValueChange={(value: string) => setDeliveryTime(value as DeliveryTime)}
            className='flex items-center gap-4'
          >
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='1' id='24-hours' />
              <Label htmlFor='24-hours'>24 hours</Label>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='3' id='3-days' />
              <Label htmlFor='3-days'>Up to 3 days</Label>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='7' id='7-days' />
              <Label htmlFor='7-days'>Up to 7 days</Label>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='-1' id='any' />
              <Label htmlFor='any'>Any</Label>
            </div>
          </RadioGroup>
        </div>
        <div className='flex w-full gap-4'>
          <Button variant='outline' className='grow cursor-pointer'>
            Clear Filters
          </Button>
          <Button onClick={handleApplyFilters} className='grow cursor-pointer bg-blue-600 hover:bg-blue-700'>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
