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
import { ImagePlus, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthRoutes, DashboardRoutes } from '../../../../../route';
import AuthRedirect from '@/components/auth-redirect';
import { useRaketFormStore } from '@/features/dashboard/rakets/stores/useRaketFormStore';
import { useDropzone } from 'react-dropzone';
import { generateUUID } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardRaketsNewPage() {
  const router = useRouter();

  const {
    title,
    description,
    subcategoryId,
    pricingType,
    price,
    coverImageFile,
    galleryImageFiles,
    deliveryDays,
    reset: resetStore,
  } = useRaketFormStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const supabase = createClient();
    const uuid = generateUUID();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(AuthRoutes.LOGIN);
      return;
    }

    if (!title || !description || !subcategoryId || !pricingType || !price || !deliveryDays || !coverImageFile) {
      return;
    }

    // upload images first in bucket
    const storage = supabase.storage.from('services');

    const { data: coverImageFileUrl, error: coverImageFileError } = await storage.upload(
      `${user?.id}/${uuid}/${generateUUID()}`,
      coverImageFile.file
    );

    if (coverImageFileError) {
      throw new Error('Error:', coverImageFileError);
    }

    const galleryImageFileUrls = await Promise.all(
      galleryImageFiles.map(async imageFile => {
        const { data, error } = await storage.upload(`${user?.id}/${uuid}/${generateUUID()}`, imageFile.file);

        if (error) {
          return '';
        } else {
          return data.fullPath;
        }
      })
    );

    const { error } = await supabase.from('services').insert({
      id: uuid,
      raketero_id: user.id,
      title: title,
      description,
      subcategory_id: subcategoryId,
      pricing_type: pricingType,
      price: Number(price),
      cover_image_url: coverImageFileUrl?.fullPath,
      gallery_image_urls: galleryImageFileUrls,
      delivery_days: deliveryDays,
      is_active: true,
    });

    if (error) {
      throw new Error('Error:', error);
    }

    router.replace(DashboardRoutes.RAKETS);
  };

  useEffect(() => {
    return () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(coverImageFile?.blobUrl || '');
      galleryImageFiles.forEach(file => URL.revokeObjectURL(file.blobUrl));

      resetStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <RaketOverviewStep />
            <PricingStep />
            <DescriptionAndGalleryStep />
            <div className='flex w-full items-center justify-end gap-4'>
              <Button type='button' variant='outline' className='cursor-pointer' disabled>
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

function PricingStep() {
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

const MAX_IMAGE_FILES = 5;
const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024;

function DescriptionAndGalleryStep() {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const { coverImageFile, galleryImageFiles, updateDescription, updateCoverImageFile, updateGalleryImageFiles } =
    useRaketFormStore();

  const onCoverImageDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const blobUrl = URL.createObjectURL(file);
    updateCoverImageFile({ file, blobUrl });
  }, []);

  const onGalleryImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filteredAcceptedFiles = Array.from(acceptedFiles).filter(
        file => !galleryImageFiles.find(f => f.file.name === file.name)
      );
      updateGalleryImageFiles([
        ...galleryImageFiles,
        ...filteredAcceptedFiles.map(file => ({ file, blobUrl: URL.createObjectURL(file) })),
      ]);
    },
    [galleryImageFiles]
  );

  const {
    getRootProps: getCoverImageRootProps,
    getInputProps: getCoverImageInputProps,
    isDragActive: isCoverImageDragActive,
  } = useDropzone({
    onDrop: onCoverImageDrop,
    maxSize: MAX_IMAGE_SIZE_IN_BYTES,
    maxFiles: 1,
    accept: {
      'image/*': [],
    },
  });

  const {
    getRootProps: getGalleryImagesRootProps,
    getInputProps: getGalleryImagesInputProps,
    isDragActive: isGalleryImagesDragActive,
  } = useDropzone({
    onDrop: onGalleryImagesDrop,
    maxSize: MAX_IMAGE_SIZE_IN_BYTES,
    maxFiles: MAX_IMAGE_FILES,
    accept: {
      'image/*': [],
    },
  });

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const file = files[0];
    const blobUrl = URL.createObjectURL(file);
    updateCoverImageFile({ file, blobUrl });
  };

  const handleGalleryImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const filteredAcceptedFiles = Array.from(files)
      .filter(file => !galleryImageFiles.find(f => f.file.name === file.name))
      .map(file => ({ file, blobUrl: URL.createObjectURL(file) }));

    const newFiles = [...galleryImageFiles, ...filteredAcceptedFiles].slice(0, MAX_IMAGE_FILES);

    updateGalleryImageFiles(newFiles);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Description &amp; Gallery</CardTitle>
        <Separator className='my-4' />
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='description'>
              Description <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Textarea
              id='description'
              placeholder='Tell clients everything they need to know about your service...'
              onChange={event => updateDescription(event.target.value)}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='description'>
              Cover Image URL <span className='-ml-1 text-red-600'>*</span>
            </Label>
            {coverImageFile ? (
              <div className='w-full'>
                <div className='relative w-1/2'>
                  <img src={coverImageFile.blobUrl} className='aspect-video w-full rounded-lg object-cover' />
                  <button
                    type='button'
                    className='absolute top-0 right-0 m-2 cursor-pointer rounded-full bg-black p-1 text-white'
                    onClick={() => updateCoverImageFile(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div {...getCoverImageRootProps()}>
                <input {...getCoverImageInputProps()} onChange={handleCoverImageChange} ref={coverImageInputRef} />
                <div className='flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8'>
                  <ImagePlus size={40} className='mb-4 text-neutral-400' />
                  <p className='text-sm'>
                    {isCoverImageDragActive ? (
                      <>Drop the file here..</>
                    ) : (
                      <>
                        <button
                          type='button'
                          onClick={() => coverImageInputRef?.current?.click()}
                          className='cursor-pointer text-blue-600 hover:text-blue-700'
                        >
                          Upload a file
                        </button>{' '}
                        or drag and drop
                      </>
                    )}
                  </p>
                  <p className='text-xs text-black/50'>PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
            <input {...getCoverImageInputProps()} ref={coverImageInputRef} onChange={handleCoverImageChange} />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='gallery'>Image Gallery</Label>
            {galleryImageFiles.length > 0 ? (
              <div className='grid grid-cols-3 gap-4'>
                {galleryImageFiles.map(file => (
                  <div key={file.blobUrl} className='relative overflow-hidden rounded-sm border-2'>
                    <img src={file.blobUrl} className='aspect-video w-full object-contain' />
                    <button
                      type='button'
                      className='absolute top-0 right-0 m-2 cursor-pointer rounded-full bg-black p-1 text-white hover:bg-neutral-800'
                      onClick={() => updateGalleryImageFiles(galleryImageFiles.filter(f => f.blobUrl !== file.blobUrl))}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                {galleryImageFiles.length < MAX_IMAGE_FILES && (
                  <button
                    {...getGalleryImagesRootProps()}
                    type='button'
                    className='flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white hover:bg-neutral-50'
                    onClick={() => galleryImageInputRef?.current?.click()}
                  >
                    <input
                      {...getGalleryImagesInputProps()}
                      onChange={handleGalleryImagesChange}
                      ref={galleryImageInputRef}
                    />
                    <ImagePlus size={40} className='text-neutral-400' />
                    {isGalleryImagesDragActive && <p className='text-sm text-black/50'>Drop the files here..</p>}
                  </button>
                )}
              </div>
            ) : (
              <div {...getGalleryImagesRootProps()}>
                <input
                  {...getGalleryImagesInputProps()}
                  onChange={handleGalleryImagesChange}
                  ref={galleryImageInputRef}
                />
                <div className='flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8'>
                  <ImagePlus size={40} className='mb-4 text-neutral-400' />
                  <p className='text-sm'>
                    {isGalleryImagesDragActive ? (
                      <>Drop the files here..</>
                    ) : (
                      <>
                        <button
                          type='button'
                          onClick={() => galleryImageInputRef?.current?.click()}
                          className='cursor-pointer text-blue-600 hover:text-blue-700'
                        >
                          Upload files
                        </button>{' '}
                        or drag and drop
                      </>
                    )}
                  </p>
                  <p className='text-xs text-black/50'>PNG, JPG, GIF up to 1MB</p>
                </div>
              </div>
            )}
            <input {...getGalleryImagesInputProps()} ref={galleryImageInputRef} onChange={handleGalleryImagesChange} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
