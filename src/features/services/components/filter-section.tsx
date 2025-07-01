'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/lib/supabase/types';
import { useMemo, useState } from 'react';

interface Props {
  categories: Database['public']['Tables']['categories']['Row'][] | null;
  subcategories: Database['public']['Tables']['subcategories']['Row'][] | null;
}

export default function FilterSection({ categories, subcategories }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
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
    <aside className='sticky top-0 left-0 flex w-full flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Filters</h2>
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
          <div className='flex items-center gap-2 text-black/80'>
            <Checkbox className='bg-white' id='top-rated' />
            <Label htmlFor='top-rated'>Top Rated</Label>
          </div>
          <div className='flex items-center gap-2 text-black/80'>
            <Checkbox className='bg-white' id='level-2' />
            <Label htmlFor='level-2'>Level 2</Label>
          </div>
          <div className='flex items-center gap-2 text-black/80'>
            <Checkbox className='bg-white' id='level-1' />
            <Label htmlFor='level-1'>Level 1</Label>
          </div>
          <div className='flex items-center gap-2 text-black/80'>
            <Checkbox className='bg-white' id='new-raketero' />
            <Label htmlFor='new-raketero'>New Raketero</Label>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Delivery Time</Label>
          <RadioGroup defaultValue='any'>
            <div className='flex items-center gap-2 text-black/80'>
              <RadioGroupItem value='express-24h' id='express-24h' className='bg-white' />
              <Label htmlFor='express-24h'>Express 24H</Label>
            </div>
            <div className='flex items-center gap-2 text-black/80'>
              <RadioGroupItem value='up-to-3-days' id='up-to-3-days' className='bg-white' />
              <Label htmlFor='up-to-3-days'>Up to 3 days</Label>
            </div>
            <div className='flex items-center gap-2 text-black/80'>
              <RadioGroupItem value='up-to-7-days' id='up-to-7-days' className='bg-white' />
              <Label htmlFor='up-to-7-days'>Up to 7 days</Label>
            </div>
            <div className='flex items-center gap-2 text-black/80'>
              <RadioGroupItem value='any' id='any' className='bg-white' />
              <Label htmlFor='any'>Any</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </aside>
  );
}
