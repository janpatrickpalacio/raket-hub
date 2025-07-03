'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import DashboardPageWrapper from '@/features/dashboard/components/dashboard-page-wrapper';
import useServiceContext from '@/features/services/contexts/service-context';
import { ImagePlus } from 'lucide-react';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { DashboardRoutes } from '../../../../../route';
import AuthRedirect from '@/components/auth-redirect';

export default function DashboardRaketsNewPage() {
  return (
    <>
      <AuthRedirect />
      <div className='flex flex-col gap-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={DashboardRoutes.DASHBOARD}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={DashboardRoutes.RAKETS}>Rakets</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create New Raket</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <DashboardPageWrapper
          title='Create Your Raket'
          description='Fill out the details below to get your service listed on the marketplace.'
        >
          <form className='flex flex-col gap-8'>
            <RaketOverviewStep />
            <PricingStep />
            <DescriptionAndGalleryStep />
            <div className='flex w-full items-center justify-end gap-4'>
              <Button variant='outline' className='cursor-pointer'>
                Save as Draft
              </Button>
              <Button className='cursor-pointer bg-blue-600 hover:bg-blue-700'>Publish Raket</Button>
            </div>
          </form>
        </DashboardPageWrapper>
      </div>
    </>
  );
}

function RaketOverviewStep() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Raket Overview</CardTitle>
        <Separator className='my-4' />
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='title'>Raket Title</Label>
            <Input id='title' placeholder='e.g. I will design a minimalist logo for your business' />
            <p className='text-xs'>This will be the main title clients see. Make it catchy and clear.</p>
          </div>
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
            <Select
              value={selectedSubcategoryId}
              onValueChange={handleSelectSubcategory}
              disabled={isSubcategoryDisabled}
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

function PricingStep() {
  const [selectedPricingType, setSelectedPricingType] = useState<string>('Fixed');

  const handleSelectPricingType = (value: string): void => {
    if (value === selectedPricingType) return;

    setSelectedPricingType(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Pricing</CardTitle>
        <Separator className='my-4' />
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='pricing-type'>Pricing Type</Label>
            <Select value={selectedPricingType} onValueChange={handleSelectPricingType}>
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
            <Label htmlFor='price'>Price (PHP)</Label>
            <Input id='price' type='number' placeholder='0.00' />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='delivery-time'>Delivery Time (in days)</Label>
            <Input id='delivery-time' type='number' placeholder='7' />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function DescriptionAndGalleryStep() {
  const [, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Description &amp; Gallery</CardTitle>
        <Separator className='my-4' />
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='description'>Description</Label>
            <Textarea id='description' placeholder='Tell clients everything they need to know about your service...' />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='gallery'>Image Gallery</Label>
            <div className='flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8'>
              <ImagePlus size={40} className='mb-4 text-neutral-400' />
              <p className='text-sm'>
                <button
                  onClick={() => fileInputRef?.current?.click()}
                  className='cursor-pointer text-blue-600 hover:text-blue-700'
                >
                  Upload a file
                </button>{' '}
                or drag and drop
              </p>
              <p className='text-xs text-black/50'>PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/*'
          style={{ display: 'none' }}
        />
      </CardHeader>
    </Card>
  );
}
