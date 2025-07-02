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
  services: ServiceWithRaketero[];
}

export default function ServicesResult({ services }: Props) {
  return (
    <>
      <div className='mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {services?.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
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
    </>
  );
}
