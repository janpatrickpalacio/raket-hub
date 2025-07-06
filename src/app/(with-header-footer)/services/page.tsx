import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import FilterSectionDesktop from '@/features/services/components/filter-section-desktop';
import FilterSectionMobile from '@/features/services/components/filter-section-mobile';
import ServicesHeroSection from '@/features/services/components/services-hero-section';
import ServicesResult from '@/features/services/components/services-result';
import { createClient } from '@/lib/supabase/server';
import { Filter } from 'lucide-react';

interface Props {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
  }>;
}

const MAX_DISPLAY_PER_PAGE = 12;

export default async function ServicesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { category: categoryParam, subcategory: subcategoryParam } = await searchParams;

  let servicesQuery = supabase
    .from('services')
    .select(
      `
      *,
      raketero:users(id, first_name, last_name, avatar_url, username, average_rating, total_reviews)
    `
    )
    .range(0, MAX_DISPLAY_PER_PAGE);

  if (subcategoryParam) {
    const { data: subcategory } = await supabase
      .from('subcategories')
      .select('id')
      .eq('slug', subcategoryParam)
      .single();

    servicesQuery = servicesQuery.eq('subcategory_id', subcategory?.id ?? -1);
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
  }

  const { data: services, error: servicesError } = await servicesQuery;

  const { count: servicesCount, error: servicesCountError } = await supabase
    .from('services')
    .select('*', { count: 'exact' });

  if (servicesError || servicesCountError) {
    throw new Error(servicesError?.message || servicesCountError?.message);
  }

  return (
    <div className='px-4'>
      <main className='relative container mx-auto grid min-h-[80dvh] gap-8 py-10'>
        <section className='flex w-full flex-col gap-2'>
          <ServicesHeroSection />
          <div className='mt-4 hidden items-center gap-2 lg:flex'>
            <Input
              placeholder='Search for a service (e.g. Logo Design)'
              className='rounded-full bg-white py-5 text-sm'
            />
            <Dialog>
              <DialogTrigger className='flex h-full cursor-pointer items-center gap-2 rounded-full border bg-white px-3 text-sm transition-colors hover:bg-neutral-100'>
                <Filter size={16} /> Filters
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className='text-2xl'>Filters</DialogTitle>
                </DialogHeader>
                <FilterSectionDesktop />
              </DialogContent>
            </Dialog>
          </div>
          <div className='flex items-center gap-2 lg:hidden'>
            <Input placeholder='Search for a service (e.g. Logo Design)' className='bg-white text-sm' />
            <FilterSectionMobile />
          </div>
          <p className='mt-4 -mb-3 text-neutral-500'>
            Showing {services?.length || 0} of {servicesCount || 0} results
          </p>
          <ServicesResult services={services} />
        </section>
      </main>
    </div>
  );
}
