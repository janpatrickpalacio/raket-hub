import React from 'react';

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='bg-slate-50'>{children}</div>;
}
