import ServicesHeroSection from '@/features/services/components/services-hero-section';
import ServicesResult from '@/features/services/components/services-result';
import ServicesSearchAndFilter from '@/features/services/components/services-search-and-filter';
import { createClient } from '@/lib/supabase/server';

interface Props {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    q?: string;
  }>;
}

const MAX_DISPLAY_PER_PAGE = 12;

export default async function ServicesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { category: categoryParam, subcategory: subcategoryParam, q: queryParam } = await searchParams;

  let servicesQuery = supabase
    .from('services')
    .select(
      `
      *,
      raketero:users(id, first_name, last_name, avatar_url, username, average_rating, total_reviews)
    `
    )
    .eq('status', 'approved')
    .range(0, MAX_DISPLAY_PER_PAGE);

  let servicesCountQuery = supabase.from('services').select('*', { count: 'exact' }).eq('status', 'approved');

  if (subcategoryParam) {
    const { data: subcategory } = await supabase
      .from('subcategories')
      .select('id')
      .eq('slug', subcategoryParam)
      .single();

    servicesQuery = servicesQuery.eq('subcategory_id', subcategory?.id ?? -1);
    servicesCountQuery = servicesCountQuery.eq('subcategory_id', subcategory?.id ?? -1);
  } else if (categoryParam) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryParam || '')
      .single();

    const { data: subcategories } = await supabase
      .from('subcategories')
      .select('id')
      .eq('category_id', category?.id ?? -1);

    servicesQuery = servicesQuery.in('subcategory_id', subcategories?.map(subcategory => subcategory.id) || []);
    servicesCountQuery = servicesCountQuery.in(
      'subcategory_id',
      subcategories?.map(subcategory => subcategory.id) || []
    );
  }

  if (queryParam) {
    servicesQuery = servicesQuery.textSearch('fts', queryParam, { type: 'websearch' });
    servicesCountQuery = servicesCountQuery.textSearch('fts', queryParam, { type: 'websearch' });
  }

  const { data: services, error: servicesError } = await servicesQuery;
  const { count: servicesCount, error: servicesCountError } = await servicesCountQuery;

  if (servicesError || servicesCountError) {
    throw new Error(servicesError?.message || servicesCountError?.message);
  }

  return (
    <div className='px-4'>
      <main className='relative container mx-auto grid min-h-[80dvh] gap-8 py-10'>
        <section className='flex w-full flex-col gap-2'>
          <ServicesHeroSection />
          <ServicesSearchAndFilter />
          <p className='mt-4 -mb-3 text-neutral-500'>
            Showing {services?.length || 0} of {servicesCount || 0} results
          </p>
          <ServicesResult services={services} />
        </section>
      </main>
    </div>
  );
}
