'use client';

import RaketHubIcon from '@/components/raket-hub-icon';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AuthRoutes, DashboardRoutes } from '@/routes';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import SignUpForm from '@/features/signup/components/signup-form';

export default function SignUpPageContent() {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkCurrentSession = async (): Promise<void> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace(DashboardRoutes.DASHBOARD);
      } else {
        setLoading(false);
      }
    };

    checkCurrentSession();
  }, [router]);

  return (
    <main className='container mx-auto flex min-h-[100dvh] flex-col items-center justify-center gap-8'>
      <RaketHubIcon className='text-3xl' />
      {loading ? (
        <Loader size={40} className='animate-spin' />
      ) : (
        <>
          <Card className='w-full max-w-md items-center gap-0 border-x-0 border-b-0 border-neutral-100 px-3 py-8 shadow-md'>
            <CardTitle className='text-2xl'>Create your account</CardTitle>
            <CardDescription className='mt-2'>
              Already have an account?{' '}
              <Link href={AuthRoutes.LOGIN} className='text-blue-600'>
                Log in
              </Link>
            </CardDescription>
            <CardContent className='mt-8'>
              <SignUpForm />
              <p className='mt-4 text-center text-xs text-black/50'>
                By creating an account, you agree to our{' '}
                <Link href='#' className='text-black'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href='#' className='text-black'>
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
