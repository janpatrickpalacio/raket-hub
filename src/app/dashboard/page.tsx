import DashboardPageContent from '@/features/dashboard/components/dashboard-page-content';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DashboardPageContent user={user} />;
}
