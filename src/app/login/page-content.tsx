'use client';

import RaketHubIcon from '@/components/raket-hub-icon';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { DashboardRoutes, PublicRoutes } from '../../../route';
import LoginForm from '@/features/login/login-form';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function LoginPageContent() {
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
            <CardTitle className='text-2xl'>Log in to your account</CardTitle>
            <CardDescription className='mt-2'>
              Don&apos;t have an account?{' '}
              <Link href={PublicRoutes.SIGN_UP} className='text-blue-600'>
                Sign up
              </Link>
            </CardDescription>
            <CardContent className='mt-8 w-full'>
              <LoginForm />
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
