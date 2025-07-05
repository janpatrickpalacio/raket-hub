import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useRaketFormStore } from '@/features/dashboard/rakets/stores/useRaketFormStore';
import useServiceContext from '@/features/services/contexts/service-context';
import { useMemo, useState } from 'react';

export function RaketOverviewStep() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
  const { updateSubcategoryId, updateTitle } = useRaketFormStore();
  const { categories, subcategories } = useServiceContext();
  const isSubcategoryDisabled = !selectedCategoryId || (subcategories?.length ?? 0) === 0;
  const filteredSubcategories = useMemo(
    () => subcategories?.filter(subcategory => subcategory.category_id === Number(selectedCategoryId)),
    [subcategories, selectedCategoryId]
  );

  const handleSelectCategory = (value: string): void => {
    if (value === selectedCategoryId) return;

    setSelectedCategoryId(value);
    setSelectedSubcategoryId('');
  };

  const handleSelectSubcategory = (value: string): void => {
    if (value === selectedSubcategoryId) return;

    setSelectedSubcategoryId(value);
    updateSubcategoryId(Number(value));
  };

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
              id='title'
              onChange={e => updateTitle(e.target.value)}
              placeholder='e.g. I will design a minimalist logo for your business'
            />
            <p className='text-xs'>This will be the main title clients see. Make it catchy and clear.</p>
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='category'>
              Category <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Select onValueChange={handleSelectCategory} required>
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
            <Label htmlFor='subcategory'>
              Subcategory <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Select
              value={selectedSubcategoryId}
              onValueChange={handleSelectSubcategory}
              disabled={isSubcategoryDisabled}
              required
            >
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
        </div>
      </CardHeader>
    </Card>
  );
}
