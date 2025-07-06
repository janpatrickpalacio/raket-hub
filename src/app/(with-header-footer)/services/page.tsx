import { Input } from '@/components/ui/input';
import FilterSectionDesktop from '@/features/services/components/filter-section-desktop';
import FilterSectionMobile from '@/features/services/components/filter-section-mobile';
import ServicesResult from '@/features/services/components/services-result';
import { createClient } from '@/lib/supabase/server';

const MAX_DISPLAY_PER_PAGE = 12;

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select(
      `
      *,
      raketero:users(id, first_name, last_name, avatar_url, username, average_rating, total_reviews)
    `
    )
    .range(0, MAX_DISPLAY_PER_PAGE);
  const { count: servicesCount, error: servicesCountError } = await supabase
    .from('services')
    .select('*', { count: 'exact' });

  if (servicesError || servicesCountError) {
    throw new Error(servicesError?.message || servicesCountError?.message);
  }

  return (
    <div className='px-4'>
      <main className='relative container mx-auto grid min-h-[80dvh] grid-cols-5 gap-8 py-10'>
        <FilterSectionDesktop />
        <section className='col-span-full flex flex-col gap-2 lg:col-span-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-lg font-bold sm:text-3xl'>All Services</h1>
              <p className='text-sm text-black/50'>Showing 1-12 of {servicesCount ?? 0} results</p>
            </div>
          </div>
          <div className='flex items-center gap-2 lg:hidden'>
            <Input placeholder='Search..' className='bg-white text-sm' />
            <FilterSectionMobile />
          </div>
          <ServicesResult services={services} />
        </section>
      </main>
    </div>
  );
}
