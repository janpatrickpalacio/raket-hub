import HeroSection from '@/components/hero-section';
import { Input } from '@/components/ui/input';
import { ExploreCard } from '@/features/home/components/explore-card';
import RaketeroCard from '@/features/home/components/raketero-card';
import ServiceCard from '@/features/home/components/service-card';
import StepCard from '@/features/home/components/step-card';
import { Monitor } from 'lucide-react';
import Link from 'next/link';
import { PublicRoutes } from '../../../route';

export default function Home() {
  return (
    <main className='mx-auto [&>section]:px-4'>
      <HeroSection
        title={`The best Filipino freelancers\nall in one place.`}
        description='Find trusted Filipino talent for any project, big or small'
      >
        <div className='mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row'>
          <Input
            className='w-full rounded-full bg-white px-4 py-6 text-sm text-black sm:max-w-[480px]'
            placeholder='What service do you need? (e.g. Logo Design)'
          />
          <Link
            href={`${PublicRoutes.SERVICES}?q=`}
            className='w-full cursor-pointer rounded-full bg-yellow-300 px-8 py-3 font-semibold text-black transition-colors hover:bg-yellow-400 sm:w-auto'
          >
            Search
          </Link>
        </div>
      </HeroSection>
      <section>
        <div className='container mx-auto flex flex-col items-center justify-center gap-2 py-28'>
          <h2 className='text-center text-2xl font-bold sm:text-left sm:text-4xl'>Explore by Category</h2>
          <p className='text-center opacity-80 sm:text-left sm:text-lg'>Find the right professional for your needs.</p>
          <div className='mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
          </div>
        </div>
      </section>
      <section className='flex justify-center bg-neutral-50'>
        <div className='container flex flex-col gap-8 py-20'>
          <h2 className='text-center text-2xl font-bold sm:text-left sm:text-3xl'>Local Gigs in Angeles</h2>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
          </div>
        </div>
      </section>
      <section className='flex justify-center'>
        <div className='container flex flex-col items-center justify-center gap-2 py-20'>
          <h2 className='text-center text-2xl font-bold sm:text-left sm:text-3xl'>Getting Things Done is Easy</h2>
          <p className='text-center sm:text-left'>In just a few simple steps.</p>
          <div className='mt-16 grid place-items-start gap-20 sm:grid-cols-3'>
            <StepCard
              title='Search & Find'
              description='Describe the service you need and browse through profiles of talented local Raketeros.'
              stepIcon={1}
            />
            <StepCard
              title='Book & Pay Securely'
              description='Chat with your chosen pro, agree on the price, and pay securely with GCash, Maya, or card. We hold the payment until the job is done.'
              stepIcon={2}
            />
            <StepCard
              title='Get it Done & Rate'
              description='Collaborate with your Raketero, approve the final work, and leave a review to help our community grow.'
              stepIcon={3}
            />
          </div>
        </div>
      </section>
      <section className='flex justify-center bg-neutral-50'>
        <div className='container flex flex-col items-center justify-center gap-2 py-20'>
          <h2 className='text-2xl font-bold sm:text-3xl'>Meet Our Top Raketeros</h2>
          <div className='mt-12 grid w-full gap-8 lg:grid-cols-3'>
            <RaketeroCard firstName='John' lastName='Doe' jobTitle='UX Designer' rating={4.9} reviews={20} />
            <RaketeroCard firstName='John' lastName='Doe' jobTitle='UX Designer' rating={4.9} reviews={20} />
            <RaketeroCard firstName='John' lastName='Doe' jobTitle='UX Designer' rating={4.9} reviews={20} />
          </div>
        </div>
      </section>
      <section className='flex justify-center bg-gradient-to-r from-yellow-200 to-orange-500'>
        <div className='container flex flex-col items-center py-20 text-white'>
          <h2 className='text-2xl font-bold sm:text-3xl'>Ready to Get Started?</h2>
          <p className='mt-2 max-w-[512px] text-center text-sm text-white/80 sm:text-base'>
            Join our community of clients and talented Raketeros today. Your next project is just a few clicks away.
          </p>
          <div className='mt-8 flex w-full flex-col items-center gap-4 text-center sm:w-auto sm:flex-row sm:text-left'>
            <Link
              href='#'
              className='w-full rounded-full bg-white px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:bg-white/80 sm:w-auto sm:text-lg'
            >
              Find a Service
            </Link>
            <Link
              href='#'
              className='w-full rounded-full bg-yellow-300 px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:bg-yellow-400 sm:w-auto sm:text-lg'
            >
              Become a Raketero
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
