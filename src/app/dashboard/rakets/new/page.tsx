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
import DashboardPageWrapper from '@/features/dashboard/components/dashboard-page-wrapper';
import { FormEvent, useEffect } from 'react';
import { AuthRoutes, DashboardRoutes } from '@/routes';
import AuthRedirect from '@/components/auth-redirect';
import { useRaketFormStore } from '@/features/dashboard/rakets/stores/useRaketFormStore';
import { generateUUID } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { DescriptionAndGalleryStep } from '@/features/dashboard/rakets/new/components/description-and-gallery-step';
import { PricingStep } from '@/features/dashboard/rakets/new/components/pricing-step';
import { RaketOverviewStep } from '@/features/dashboard/rakets/new/components/raket-overview-step';

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
