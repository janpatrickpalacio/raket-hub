'use client';

import HeroSection from '@/components/hero-section';
import StepCard from '@/components/step-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthRoutes, DashboardRoutes } from '@/routes';
import { User } from '@supabase/supabase-js';
import { MessageSquare, PhilippinePeso, Upload } from 'lucide-react';
import Link from 'next/link';

interface Props {
  user: User | null;
}

export default function BecomeARaketeroPageContent({ user }: Props) {
  return (
    <main className='min-h-[100dvh]'>
      <HeroSection
        title='Turn Your Skill into Your Success Story.'
        description='Join a community of talented Filipino freelancers and professionals. Start earning on your own terms with RaketHub.'
      >
        <Link
          href={user ? DashboardRoutes.RAKETS_NEW : AuthRoutes.SIGN_UP}
          className='mt-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-12 py-4 text-lg font-bold text-black transition-transform hover:scale-105'
        >
          Start Your Raket
        </Link>
      </HeroSection>
      <div className='[&>section]:odd:bg-white [&>section]:even:bg-neutral-50'>
        <section className='flex justify-center'>
          <div className='container flex flex-col items-center justify-center gap-2 py-20'>
            <h2 className='text-center text-2xl font-bold sm:text-left sm:text-4xl'>Your Journey as a Raketero</h2>
            <p className='text-center sm:text-left'>Getting started is as easy as 1-2-3.</p>
            <div className='mt-16 grid place-items-start gap-20 sm:grid-cols-3'>
              <StepCard
                title='1. Create Your Raket'
                description='Describe the service you offer, upload images of your work, and set your price. Your profile is your storefront—make it shine!'
                stepIcon={<Upload size={40} />}
              />
              <StepCard
                title='2. Connect with Clients'
                description='Get notified when you get an order. Use our built-in tools to chat with clients, manage projects, and deliver great work.'
                stepIcon={<MessageSquare size={40} className='-scale-x-100' />}
              />
              <StepCard
                title='3. Get Paid Securely'
                description='Once the job is complete, your payment is transferred directly to you. No more chasing payments, thanks to our secure escrow system.'
                stepIcon={<PhilippinePeso size={40} />}
              />
            </div>
          </div>
        </section>
        <section className='flex justify-center'>
          <div className='container flex flex-col items-center justify-center gap-2 py-20'>
            <h2 className='text-center text-2xl font-bold sm:text-left sm:text-4xl'>
              Why You&apos;ll Love Being a Raketero
            </h2>
            <div className='mt-16 grid w-full place-items-start gap-12 sm:grid-cols-3'>
              <Card className='h-full w-full border-none shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-xl font-bold'>Work Your Way</CardTitle>
                  <CardDescription className='text-base'>
                    You&apos;re in control. Set your own schedule, work from anywhere, and choose the projects that
                    you&apos;re passionate about.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className='h-full w-full border-none shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-xl font-bold'>Low 15% Commission</CardTitle>
                  <CardDescription className='text-base'>
                    Keep more of what you earn. Our competitive 15% platform fee means your hard work pays off more.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className='h-full w-full border-none shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-xl font-bold'>A Community of Support</CardTitle>
                  <CardDescription className='text-base'>
                    Join a growing network of Filipino talent. Get access to resources, support, and opportunities to
                    grow your skills.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section className='flex justify-center !bg-blue-600'>
          <div className='container flex flex-col items-center py-20 text-white'>
            <h2 className='text-2xl font-bold sm:text-3xl'>Ready to Start Your Journey?</h2>
            <p className='mt-2 max-w-[512px] text-center text-sm text-white/80 sm:text-base'>
              {user
                ? 'Get started now and share your skills with the world.'
                : 'Sign up today and share your skills with the world.'}
            </p>
            <Link
              href={user ? DashboardRoutes.RAKETS_NEW : AuthRoutes.SIGN_UP}
              className='mt-6 w-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:bg-yellow-400 sm:w-auto sm:text-lg'
            >
              Let&apos;s Go!
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
