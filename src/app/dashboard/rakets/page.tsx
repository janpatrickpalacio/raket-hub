import { createClient } from '@/lib/supabase/server';
import RaketsPageContent from './page-content';
import { Database } from '@/lib/supabase/types';

interface Props {
  searchParams: Promise<{ status: string }>;
}

export default async function DashboardRaketsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let servicesQuery = supabase
    .from('services')
    .select('*, raketero:users(*), orders(count)')
    .eq('raketero_id', user?.id || '')
    .order('created_at', { ascending: false });

  if (status) {
    servicesQuery = servicesQuery.eq('status', status as Database['public']['Enums']['service_status_enum']);
  }

  const { data: services } = await servicesQuery;

  return <RaketsPageContent services={services} />;
}
