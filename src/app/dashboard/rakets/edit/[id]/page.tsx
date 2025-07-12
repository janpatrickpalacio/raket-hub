import { createClient } from '@/lib/supabase/server';
import RaketEditPageContent from './page-content';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DashboardRaketsEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase.from('services').select('*').eq('id', id).single();

  if (!service) {
    notFound();
  }

  return <RaketEditPageContent service={service} />;
}
