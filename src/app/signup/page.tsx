import RaketHubIcon from '@/components/raket-hub-icon';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PublicRoutes } from '../../../route';
import SignUpForm from '@/features/signup/components/signup-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <main className='container mx-auto flex min-h-[100dvh] flex-col items-center justify-center gap-8'>
      <RaketHubIcon className='text-3xl' />
      <Card className='w-full max-w-md items-center gap-0 border-x-0 border-b-0 border-neutral-100 px-3 py-8 shadow-md'>
        <CardTitle className='text-2xl'>Create your account</CardTitle>
        <CardDescription className='mt-2'>
          Already have an account?{' '}
          <Link href={PublicRoutes.LOGIN} className='text-blue-600'>
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
    </main>
  );
}
