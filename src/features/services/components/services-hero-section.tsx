'use client';

import HeroSection from '@/components/hero-section';
import useServiceContext from '../contexts/service-context';
import { useSearchParams } from 'next/navigation';

export default function ServicesHeroSection() {
  const { categories, subcategories } = useServiceContext();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const subcategorySlug = searchParams.get('subcategory');
  const category = categories.find(category => category.slug === categorySlug);
  const subcategory = subcategories.find(subcategory => subcategory.slug === subcategorySlug);

  const title = subcategory?.name || category?.name || 'All Services';

  return (
    <HeroSection
      title={title}
      description='Browse through thousands of services offered by talented Filipino freelancers.'
      className='rounded-xl !py-20'
      titleClassName='text-2xl sm:!text-5xl'
    />
  );
}
