import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ServiceCard from '@/features/home/components/service-card';
import FilterSection from '@/features/services/components/filter-section';
import { createClient } from '@/lib/supabase/server';

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: categories, error: categoriesError } = await supabase.from('categories').select('*');
  const { data: subcategories, error: subcategoriesError } = await supabase.from('subcategories').select('*');

  if (categoriesError || subcategoriesError) {
    throw new Error(categoriesError?.message || subcategoriesError?.message);
  }

  return (
    <div className='bg-neutral-50'>
      <main className='relative container mx-auto grid min-h-[80dvh] grid-cols-5 gap-8 py-10'>
        <FilterSection categories={categories} subcategories={subcategories} />
        <section className='col-span-4 flex flex-col gap-2'>
          <h1 className='text-3xl font-bold'>Local Services in Angeles</h1>
          <p className='text-black/50'>Showing 1-12 of 86 results</p>
          <div className='mt-4 grid grid-cols-3 gap-6'>
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
