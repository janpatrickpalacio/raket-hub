import DashboardPageWrapper from '@/features/dashboard/components/dashboard-page-wrapper';
import ServiceCard from '@/features/home/components/service-card';
import { createClient } from '@/lib/supabase/server';
import { FolderPlus } from 'lucide-react';
import Link from 'next/link';
import { DashboardRoutes } from '@/routes';
import AuthRedirect from '@/components/auth-redirect';

export default async function DashboardRaketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: services } = await supabase
    .from('services')
    .select('*, raketero:users(*)')
    .eq('raketero_id', user?.id || '')
    .order('created_at', { ascending: false });

  const hasServices = (services?.length ?? 0) > 0;

  return (
    <>
      <AuthRedirect />
      <DashboardPageWrapper
        title='Your Rakets'
        description={`Rakets are the services you've created. You can view and manage them here.`}
      >
        {hasServices ? (
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            <Link
              href={DashboardRoutes.RAKETS_NEW}
              className='flex aspect-video h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8 text-sm text-neutral-500 transition-colors hover:bg-neutral-100'
            >
              <FolderPlus size={40} className='mb-4 text-neutral-400' />
              Create New Raket
            </Link>
            {services?.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className='flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8'>
            <FolderPlus size={40} className='mb-4 text-neutral-400' />
            <p className='text-sm'>No rakets yet!</p>
            <p className='text-sm text-black/50'>Start earning by offering your skills to the community.</p>
            <Link
              href={DashboardRoutes.RAKETS_NEW}
              className='mt-6 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
            >
              Create Your First Raket
            </Link>
          </div>
        )}
      </DashboardPageWrapper>
    </>
  );
}
