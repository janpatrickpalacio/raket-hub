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
import { FormEvent, useEffect, useState } from 'react';
import { AuthRoutes, DashboardRoutes } from '@/routes';
import AuthRedirect from '@/components/auth-redirect';
import { useRaketFormStore } from '@/features/dashboard/rakets/stores/useRaketFormStore';
import { generateUUID } from '@/lib/utils';
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

export default function DashboardRaketsNewPage() {
  const [submitting, setSubmitting] = useState<boolean>(false);
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
    setSubmitting(true);
    const supabase = createClient();
    const newRaketId = generateUUID();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect to login if user is not logged in
    if (!user) {
      router.push(AuthRoutes.LOGIN);
      return;
    }

    if (!title || !description || !subcategoryId || !pricingType || !price || !deliveryDays || !coverImageFile) {
      return;
    }

    const titleToSlug = slugify(title, { lower: true });
    const { data: slugExists } = await supabase.from('services').select('slug').eq('slug', titleToSlug).single();
    const slug = slugExists ? `${titleToSlug}-${newRaketId}` : titleToSlug;

    // Insert a new service first before uploading images
    const { data: newService, error } = await supabase
      .from('services')
      .insert({
        id: newRaketId,
        slug,
        raketero_id: user.id,
        title: title,
        description,
        subcategory_id: subcategoryId,
        pricing_type: pricingType,
        cover_image_url: 'placeholder',
        price: Number(price),
        delivery_days: deliveryDays,
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
      coverImageFile.file
    );

    if (coverImageFileError) {
      toast.error(`Error: ${coverImageFileError.message}`);
      setSubmitting(false);
      return;
    }

    const galleryImageFileUrls = await Promise.all(
      galleryImageFiles.map(async imageFile => {
        const { data, error } = await storage.upload(`${newService.id}/${generateUUID()}`, imageFile.file);

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
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
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
          </DashboardPageWrapper>
        </div>
      </main>
    </div>
  );
}
