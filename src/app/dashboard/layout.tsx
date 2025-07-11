import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { AuthRoutes } from '@/routes';
import DashboardLayoutContent from './layout-content';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(AuthRoutes.LOGIN);
  }

  const { data: profile } = await supabase.from('users').select().eq('id', user.id).single();

  if (!profile) {
    notFound();
  }

  return <DashboardLayoutContent user={profile}>{children}</DashboardLayoutContent>;
}
