'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ServiceCard from '@/features/home/components/service-card';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';

interface Props {
  services: ServiceWithRaketero[] | null;
}

export default function ServicesResult({ services }: Props) {
  return (
    <>
      {services && services.length > 0 ? (
        <div className='mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {services?.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <p className='mt-4 flex min-h-[50dvh] items-center justify-center text-center text-neutral-500'>
          No services found
        </p>
      )}
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
    </>
  );
}
