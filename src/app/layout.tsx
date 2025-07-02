import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RaketHub',
  description: 'Find trusted Filipino talent for any project, big or small.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
          <NextTopLoader showSpinner={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
