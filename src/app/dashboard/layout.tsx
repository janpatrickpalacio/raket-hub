import DashboardSidebar from '@/components/dashboard-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { PublicRoutes } from '../../../route';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(PublicRoutes.LOGIN);
  }

  const { data: profile } = await supabase.from('users').select().eq('id', user.id).single();

  if (!profile) {
    notFound();
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={profile} />
      <main className='w-full bg-blue-50/50 px-8 py-4'>
        <SidebarTrigger className='mb-4 -ml-6 cursor-pointer' />
        <div className='max-w-6xl'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
