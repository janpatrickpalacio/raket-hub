import RaketHubIcon from '@/components/raket-hub-icon';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PublicRoutes } from '../../../route';
import LoginForm from '@/features/login/login-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
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
    </main>
  );
}
