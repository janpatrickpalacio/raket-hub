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
import { DashboardRoutes } from '@/routes';
import AuthRedirect from '@/components/auth-redirect';

import { DescriptionAndGalleryStep } from '@/features/dashboard/rakets/new/components/description-and-gallery-step';
import { PricingStep } from '@/features/dashboard/rakets/new/components/pricing-step';
import { RaketOverviewStep } from '@/features/dashboard/rakets/new/components/raket-overview-step';
import { Loader } from 'lucide-react';
import RaketHubIcon from '@/components/raket-hub-icon';
import Link from 'next/link';
import { Database } from '@/lib/supabase/types';
import useServiceContext from '@/features/services/contexts/service-context';
import { FormProvider, useForm } from 'react-hook-form';

interface Props {
  service: Database['public']['Tables']['services']['Row'];
}

export default function RaketEditPageContent({ service }: Props) {
  const [submitting] = useState<boolean>(false);
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
      cover_image_file: null,
      gallery_image_files: [],
    },
  });

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
                <BreadcrumbPage>Edit Raket</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <DashboardPageWrapper title='Edit Raket' description='Edit the details of your raket here.'>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(data => console.log(data))} className='flex flex-col gap-8'>
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
