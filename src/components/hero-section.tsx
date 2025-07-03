import React from 'react';

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function HeroSection({ title, description, children }: Props) {
  return (
    <section className='flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-700 from-10% to-blue-300 py-28 text-center text-white'>
      <h1 className='text-3xl font-bold whitespace-pre-line sm:text-6xl'>{title}</h1>
      <p className='max-w-3xl text-white/80 sm:text-lg'>{description}</p>
      {children}
    </section>
  );
}
