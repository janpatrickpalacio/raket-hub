'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useState } from 'react';
import useServiceContext from '../contexts/service-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';

export default function FilterSectionDesktop() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const { categories, subcategories } = useServiceContext();
  const isSubcategoryDisabled = !selectedCategoryId || (subcategories?.length ?? 0) === 0;
  const filteredSubcategories = useMemo(
    () => subcategories?.filter(subcategory => subcategory.category_id === Number(selectedCategoryId)),
    [subcategories, selectedCategoryId]
  );

  const handleSelectCategory = (value: string): void => {
    if (value === selectedCategoryId) return;

    setSelectedCategoryId(value);
  };

  return (
    <div className='sticky top-0 left-0 hidden w-full flex-col gap-4 lg:flex'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <Label>Category</Label>
          <Select onValueChange={handleSelectCategory}>
            <SelectTrigger className='w-full bg-white'>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent className='w-full'>
              {categories?.map(({ id, name }) => (
                <SelectItem key={id} value={id.toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Subcategory</Label>
          <Select disabled={isSubcategoryDisabled}>
            <SelectTrigger className='w-full bg-white'>
              <SelectValue placeholder={selectedCategoryId ? 'Select a subcategory' : 'Select a category first'} />
            </SelectTrigger>
            <SelectContent className='w-full'>
              {filteredSubcategories?.map(({ id, name }) => (
                <SelectItem key={id} value={id.toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Location</Label>
          <Input placeholder='Enter a location' className='bg-white' />
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Price Range (PHP)</Label>
          <div className='flex items-center gap-2'>
            <Input placeholder='Min' className='bg-white' />
            <span>-</span>
            <Input placeholder='Max' className='bg-white' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Raketero Level</Label>
          <ToggleGroup type='multiple' className='w-full gap-2 rounded-none'>
            <ToggleGroupItem
              value='top-rated'
              className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
            >
              Top Rated
            </ToggleGroupItem>
            <ToggleGroupItem
              value='level-2'
              className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
            >
              Level 2
            </ToggleGroupItem>
            <ToggleGroupItem
              value='level-1'
              className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
            >
              Level 1
            </ToggleGroupItem>
            <ToggleGroupItem
              value='new-raketero'
              className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
            >
              New Raketero
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Delivery Time</Label>
          <ToggleGroup type='multiple' className='w-full gap-2 rounded-none'>
            <ToggleGroupItem
              value='express-24h'
              className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
            >
              Express 24H
            </ToggleGroupItem>
            <ToggleGroupItem
              value='up-to-3-days'
              className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
            >
              Up to 3 days
            </ToggleGroupItem>
            <ToggleGroupItem
              value='up-to-7-days'
              className='cursor-pointer !rounded-lg border bg-white px-4 hover:bg-slate-200 hover:!text-black/50 data-[state=on]:bg-slate-200'
            >
              Up to 7 days
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className='flex w-full gap-4'>
          <Button variant='outline' className='grow cursor-pointer'>
            Clear Filters
          </Button>
          <Button className='grow cursor-pointer bg-blue-600 hover:bg-blue-700'>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}
