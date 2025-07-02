import React from 'react';

interface Props {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function DashboardPageWrapper({ children, title, description }: Props) {
  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold'>{title}</h1>
      {description && <p className='mb-8 text-black/70'>{description}</p>}
      {children}
    </div>
  );
}
