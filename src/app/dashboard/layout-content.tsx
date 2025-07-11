'use client';

import DashboardSidebar from '@/components/dashboard-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Database } from '@/lib/supabase/types';
import { DashboardRoutes } from '@/routes';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  user: Database['public']['Tables']['users']['Row'];
}

export default function DashboardLayoutContent({ children, user }: Props) {
  const pathname = usePathname();
  const routesWithoutLayout = [DashboardRoutes.RAKETS_NEW, DashboardRoutes.RAKETS_EDIT];

  if (routesWithoutLayout.some(route => pathname.includes(route))) {
    return children;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <main className='w-full bg-slate-50 px-8 py-4'>
        <SidebarTrigger className='mb-4 -ml-6 cursor-pointer' />
        <div className='max-w-6xl'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
