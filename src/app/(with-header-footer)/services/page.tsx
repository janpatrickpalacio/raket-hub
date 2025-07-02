import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ServiceCard from '@/features/home/components/service-card';
import FilterSectionDesktop from '@/features/services/components/filter-section-desktop';
import FilterSectionMobile from '@/features/services/components/filter-section-mobile';
import { createClient } from '@/lib/supabase/server';

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: categories, error: categoriesError } = await supabase.from('categories').select('*');
  const { data: subcategories, error: subcategoriesError } = await supabase.from('subcategories').select('*');

  if (categoriesError || subcategoriesError) {
    throw new Error(categoriesError?.message || subcategoriesError?.message);
  }

  return (
    <div className='bg-neutral-50 px-4'>
      <main className='relative container mx-auto grid min-h-[80dvh] grid-cols-5 gap-8 py-10'>
        <FilterSectionDesktop categories={categories} subcategories={subcategories} />
        <section className='col-span-full flex flex-col gap-2 lg:col-span-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-lg font-bold sm:text-3xl'>Local Services in Angeles</h1>
              <p className='text-sm text-black/50'>Showing 1-12 of 86 results</p>
            </div>
          </div>
          <div className='flex items-center gap-2 lg:hidden'>
            <Input placeholder='Search..' className='bg-white text-sm' />
            <FilterSectionMobile categories={categories} subcategories={subcategories} />
          </div>
          <div className='mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
          </div>
          <Pagination className='mt-8'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </main>
    </div>
  );
}
