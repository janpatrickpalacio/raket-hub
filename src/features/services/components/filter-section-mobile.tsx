'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import useServiceContext from '../contexts/service-context';

export default function FilterSectionMobile() {
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
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <Filter size={14} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='pt-2 pb-0'>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <div className='flex flex-col gap-4 p-4 [&_label]:text-xs'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='category'>Category</Label>
            <Select onValueChange={handleSelectCategory}>
              <SelectTrigger id='category' className='w-full bg-white'>
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
          <div className='flex flex-col gap-1'>
            <Label htmlFor='subcategory'>Subcategory</Label>
            <Select disabled={isSubcategoryDisabled}>
              <SelectTrigger id='subcategory' className='w-full bg-white'>
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
          <div className='flex flex-col gap-1'>
            <Label htmlFor='location'>Location</Label>
            <Input id='location' placeholder='Enter a location' className='bg-white text-sm' />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='price-range'>Price Range (PHP)</Label>
            <div className='flex items-center gap-2'>
              <Input id='price-range' type='number' placeholder='Min' className='bg-white text-sm' />
              <span>-</span>
              <Input type='number' placeholder='Max' className='bg-white text-sm' />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <Label>Raketero Level</Label>
            <div className='flex items-center gap-2'>
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
          </div>
          <div className='flex flex-col gap-1'>
            <Label>Delivery Time</Label>
            <RadioGroup defaultValue='any' className='flex'>
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
          <div className='flex items-center gap-2 [&>*]:grow'>
            <Button variant='outline' className='active:bg-neutral-50'>
              Clear All
            </Button>
            <Button className='bg-blue-500 active:bg-blue-600'>Apply</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <div className='sticky top-0 left-0 hidden w-full flex-col gap-4 lg:flex'>
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
    </div>
  );
}
