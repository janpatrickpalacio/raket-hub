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
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { DescriptionAndGalleryStep } from '@/features/dashboard/rakets/new/components/description-and-gallery-step';
import { PricingStep } from '@/features/dashboard/rakets/new/components/pricing-step';
import { RaketOverviewStep } from '@/features/dashboard/rakets/new/components/raket-overview-step';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import slugify from 'slugify';
import RaketHubIcon from '@/components/raket-hub-icon';
import Link from 'next/link';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { generateUUID } from '@/lib/utils';

export default function DashboardRaketsNewPage() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm();

  const publishRaket = async (fieldValues: FieldValues): Promise<void> => {
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
      } = fieldValues;
      const newRaketId = generateUUID();
      const titleToSlug = slugify(fieldValues.title, { lower: true });
      const { data: slugExists } = await supabase.from('services').select().eq('slug', titleToSlug).single();
      const slug = slugExists ? `${titleToSlug}-${newRaketId}` : titleToSlug;

      // Insert a new service first before uploading images
      const { data: newService, error } = await supabase
        .from('services')
        .insert({
          id: newRaketId,
          slug,
          raketero_id: user.id,
          title,
          description,
          subcategory_id,
          pricing_type,
          cover_image_url: 'placeholder',
          price,
          delivery_days,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) {
        toast.error(`Error: ${error.message}`);
        setSubmitting(false);
        return;
      }

      // Upload images to services bucket with the path <service_id>/<uuid>
      const storage = supabase.storage.from('services');

      const { data: coverImageFileUrl, error: coverImageFileError } = await storage.upload(
        `${newService.id}/${generateUUID()}`,
        cover_image_file
      );

      if (coverImageFileError) {
        toast.error(`Error: ${coverImageFileError.message}`);
        setSubmitting(false);
        return;
      }

      const galleryImageFileUrls = await Promise.all(
        gallery_image_files.map(async (file: File) => {
          const { data, error } = await storage.upload(`${newService.id}/${generateUUID()}`, file);

          if (error) {
            return '';
          } else {
            return data.fullPath;
          }
        })
      );

      // Then update the created service with the image urls
      const { error: serviceUpdateError } = await supabase
        .from('services')
        .update({
          cover_image_url: coverImageFileUrl?.fullPath,
          gallery_image_urls: galleryImageFileUrls,
        })
        .eq('id', newService.id);

      if (serviceUpdateError) {
        toast.error(`Error: ${serviceUpdateError.message}`);
        setSubmitting(false);
        return;
      }

      toast.success(
        'Raket successfully submitted! Our team will review your submission and get back to you within 24 hours.',
        { icon: '🎉' }
      );
      router.replace(DashboardRoutes.RAKETS);
    } catch {
      toast.error('Error publishing raket. Please try again.');
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
      <main className='mx-auto w-full max-w-5xl'>
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
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(publishRaket)} className='flex flex-col gap-8'>
                <RaketOverviewStep />
                <PricingStep />
                <DescriptionAndGalleryStep />
                <div className='flex w-full items-center justify-end gap-4'>
                  <Button type='button' variant='outline' className='cursor-pointer' disabled>
                    Save as Draft
                  </Button>
                  <Button className='cursor-pointer bg-blue-600 hover:bg-blue-700' disabled={submitting}>
                    {submitting ? (
                      <span className='flex items-center gap-2'>
                        <Loader className='animate-spin' /> Publishing...
                      </span>
                    ) : (
                      'Publish Raket'
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
