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
import { useState } from 'react';
import { AuthRoutes, DashboardRoutes } from '@/routes';
import AuthRedirect from '@/components/auth-redirect';

import { DescriptionAndGalleryStep } from '@/features/dashboard/rakets/new/components/description-and-gallery-step';
import { PricingStep } from '@/features/dashboard/rakets/new/components/pricing-step';
import { RaketOverviewStep } from '@/features/dashboard/rakets/new/components/raket-overview-step';
import { Loader } from 'lucide-react';
import RaketHubIcon from '@/components/raket-hub-icon';
import Link from 'next/link';
import { Database } from '@/lib/supabase/types';
import useServiceContext from '@/features/services/contexts/service-context';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import useCustomRouter from '@/hooks/use-custom-router';
import { generateUUID } from '@/lib/utils';

interface Props {
  service: Database['public']['Tables']['services']['Row'];
}

export default function RaketEditPageContent({ service }: Props) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useCustomRouter();

  const { subcategories } = useServiceContext();
  const form = useForm({
    defaultValues: {
      title: service.title,
      description: service.description,
      category_id: subcategories.find(subcategory => subcategory.id === service.subcategory_id)?.category_id,
      subcategory_id: service.subcategory_id,
      pricing_type: service.pricing_type,
      price: service.price,
      delivery_days: service.delivery_days,
      gallery_image_urls: service.gallery_image_urls,
    },
  });

  const updateRaket = async (fieldValues: FieldValues): Promise<void> => {
    try {
      setSubmitting(true);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(AuthRoutes.LOGIN);
        return;
      }

      const {
        title,
        description,
        subcategory_id,
        pricing_type,
        price,
        delivery_days,
        cover_image_file,
        gallery_image_files,
        removed_existing_gallery_image_urls,
      } = fieldValues;

      // 1. Update images from bucket if there's any changes
      const storage = supabase.storage.from('services');
      let coverImageUrl = service.cover_image_url || '';
      let galleryImageUrls = service.gallery_image_urls || [];

      if (cover_image_file) {
        const { error: removeImageError } = await storage.remove([
          service.cover_image_url?.replace('services/', '') || '',
        ]);

        if (removeImageError) {
          toast.error('Error updating raket');
          setSubmitting(false);
          return;
        }

        const randomFileName = generateUUID();
        const { error: uploadImageError } = await storage.upload(`${service.id}/${randomFileName}`, cover_image_file, {
          metadata: {
            originalFileName: cover_image_file.name,
          },
        });

        if (uploadImageError) {
          toast.error('Error updating raket');
          setSubmitting(false);
          return;
        }

        coverImageUrl = `services/${service.id}/${randomFileName}`;
      }

      if (removed_existing_gallery_image_urls && removed_existing_gallery_image_urls.length > 0) {
        const { error: removeImageError } = await storage.remove(
          removed_existing_gallery_image_urls?.map((url: string) => url.replace('services/', '')) || []
        );

        if (removeImageError) {
          toast.error('Error updating raket');
          setSubmitting(false);
          return;
        }

        galleryImageUrls = galleryImageUrls.filter((url: string) => !removed_existing_gallery_image_urls.includes(url));
      }

      if (gallery_image_files) {
        const newlyAddedGalleryImageUrls = await Promise.all(
          gallery_image_files.map(async (file: File) => {
            const { data, error } = await storage.upload(`${service.id}/${generateUUID()}`, file, {
              metadata: {
                originalFileName: file.name,
              },
            });

            if (error) {
              return '';
            } else {
              return data.fullPath;
            }
          })
        );

        galleryImageUrls = [...galleryImageUrls, ...newlyAddedGalleryImageUrls];
      }

      const { error } = await supabase
        .from('services')
        .update({
          title,
          description,
          subcategory_id,
          pricing_type,
          price,
          delivery_days,
          cover_image_url: coverImageUrl,
          gallery_image_urls: galleryImageUrls,
          status: service.status === 'rejected' ? 'pending' : service.status,
          rejection_reason: null,
        })
        .eq('id', service.id);

      if (error) {
        toast('Error updating raket');
        setSubmitting(false);
        return;
      }

      router.push(DashboardRoutes.RAKETS);
    } catch {
      toast('Error updating raket');
      setSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-[100dvh] flex-col gap-8'>
      <nav className='bg-white p-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <RaketHubIcon />
          <Link href={DashboardRoutes.DASHBOARD} className='text-sm text-neutral-500 hover:text-neutral-600'>
            Back to Dashboard
          </Link>
        </div>
      </nav>
      <main className='mx-auto w-full max-w-5xl pb-12'>
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
                <BreadcrumbPage>Edit Raket</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <DashboardPageWrapper title='Edit Raket' description='Edit the details of your raket here.'>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(updateRaket)} className='flex flex-col gap-8'>
                <RaketOverviewStep />
                <PricingStep />
                <DescriptionAndGalleryStep service={service} />
                <div className='flex w-full items-center justify-end gap-4'>
                  {/* <Button type='button' variant='outline' className='cursor-pointer' disabled>
                    Save as Draft
                  </Button> */}
                  <Button className='cursor-pointer bg-blue-600 hover:bg-blue-700' disabled={submitting}>
                    {submitting ? (
                      <span className='flex items-center gap-2'>
                        <Loader className='animate-spin' /> Updating...
                      </span>
                    ) : (
                      'Update Raket'
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </DashboardPageWrapper>
        </div>
      </main>
    </div>
  );
}
