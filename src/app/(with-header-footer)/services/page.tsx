import ServicesHeroSection from '@/features/services/components/services-hero-section';
import ServicesResult from '@/features/services/components/services-result';
import ServicesSearchAndFilter from '@/features/services/components/services-search-and-filter';
import getServiceQueries, { SearchParams } from '@/lib/services/services-queries';

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const { services, servicesCount, servicesError, servicesCountError } = await getServiceQueries(searchParams);

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
