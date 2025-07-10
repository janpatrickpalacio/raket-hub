'use client';

import { Input } from '@/components/ui/input';
import { PublicRoutes } from '@/routes';
import { useRouter } from 'next/navigation';
import { useTopLoader } from 'nextjs-toploader';
import { useRef } from 'react';

export default function LandingSearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const loader = useTopLoader();

  const handleSearch = (): void => {
    loader.start();
    router.push(`${PublicRoutes.SERVICES}?q=${inputRef.current?.value}`);
  };

  return (
    <div
      onKeyDown={e => e.key === 'Enter' && handleSearch()}
      className='mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row'
    >
      <Input
        ref={inputRef}
        className='w-full rounded-full bg-white px-4 py-6 text-sm text-black sm:max-w-[480px]'
        placeholder='What service do you need? (e.g. Logo Design)'
      />
      <button
        onClick={handleSearch}
        className='w-full cursor-pointer rounded-full bg-yellow-300 px-8 py-3 font-semibold text-black transition-colors hover:bg-yellow-400 sm:w-auto'
      >
        Search
      </button>
    </div>
  );
}
