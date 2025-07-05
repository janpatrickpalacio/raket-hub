import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useRaketFormStore } from '@/features/dashboard/rakets/stores/useRaketFormStore';
import { useState } from 'react';

export function PricingStep() {
  const [selectedPricingType, setSelectedPricingType] = useState<string>('Fixed');
  const { updatePricingType, updateDeliveryDays, updatePrice } = useRaketFormStore();

  const handleSelectPricingType = (value: 'Fixed' | 'Hourly' | 'Per Quote'): void => {
    if (value === selectedPricingType) return;

    setSelectedPricingType(value);
    updatePricingType(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Pricing</CardTitle>
        <Separator className='my-4' />
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='pricing-type'>
              Pricing Type <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Select value={selectedPricingType} onValueChange={handleSelectPricingType} required>
              <SelectTrigger id='pricing-type' className='w-full bg-white'>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent className='w-full'>
                <SelectItem value='Fixed'>Fixed Price</SelectItem>
                {/* <SelectItem value='Hourly' disabled>
                  Per Hour (Coming Soon!)
                </SelectItem>
                <SelectItem value='Per Quote' disabled>
                  Per Quote (Coming Soon!)
                </SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='price'>
              Price (PHP) <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Input
              id='price'
              type='number'
              placeholder='0.00'
              onChange={e => updatePrice(Number(e.target.value))}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='delivery-time'>
              Delivery Time (in days) <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Input
              id='delivery-time'
              type='number'
              placeholder='7'
              onChange={e => updateDeliveryDays(Number(e.target.value))}
              required
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
