import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useServiceContext from '@/features/services/contexts/service-context';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export function RaketOverviewStep() {
  const { categories, subcategories } = useServiceContext();

  const { register, watch, setValue, control } = useFormContext();
  const selectedCategory = watch('category_id');

  const filteredSubcategories = useMemo(
    () => subcategories?.filter(subcategory => subcategory.category_id === selectedCategory) || [],
    [subcategories, selectedCategory]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Raket Overview</CardTitle>
        <Separator className='my-4' />
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='title'>
              Raket Title <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Input
              {...register('title', { required: true })}
              placeholder='e.g. I will design a minimalist logo for your business'
            />
            <p className='text-xs'>This will be the main title clients see. Make it catchy and clear.</p>
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='category'>
              Category <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Controller
              name='category_id'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ''}
                  onValueChange={value => {
                    field.onChange(Number(value));
                    setValue('subcategory_id', undefined);
                  }}
                >
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
              )}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='subcategory'>
              Subcategory <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Controller
              name='subcategory_id'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ''}
                  onValueChange={value => {
                    field.onChange(Number(value));
                  }}
                  disabled={selectedCategory === undefined}
                >
                  <SelectTrigger id='subcategory' className='w-full bg-white'>
                    <SelectValue placeholder={selectedCategory ? 'Select a subcategory' : 'Select a category first'} />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {filteredSubcategories?.map(({ id, name }) => (
                      <SelectItem key={id} value={id.toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
