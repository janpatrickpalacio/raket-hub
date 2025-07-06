import { createClient } from '@/lib/supabase/server';
import ServiceViewPageContent from './page-content';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ServiceViewPage({ params }: Props) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select(
      `
      *,
      raketero:users(id, first_name, last_name, avatar_url, username, average_rating, total_reviews)
    `
    )
    .eq('slug', slug)
    .single();

  if (serviceError) {
    throw new Error(serviceError?.message);
  }

  return <ServiceViewPageContent service={service} />;
}
