import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import { createClient } from '@/lib/supabase/server';
import { ServiceProvider } from '@/features/services/contexts/service-context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RaketHub',
  description: 'Find trusted Filipino talent for any project, big or small.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: categories, error: categoriesError } = await supabase.from('categories').select('*');
  const { data: subcategories, error: subcategoriesError } = await supabase.from('subcategories').select('*');

  if (categoriesError || subcategoriesError) {
    throw new Error(categoriesError?.message || subcategoriesError?.message);
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
          <NextTopLoader showSpinner={false} />
          <ServiceProvider value={{ categories, subcategories }}>{children}</ServiceProvider>
          <Toaster position='top-center' />
        </ThemeProvider>
      </body>
    </html>
  );
}
