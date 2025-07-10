'use client';

import Alert from '@/components/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { DashboardRoutes } from '@/routes';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace(searchParams.get('redirect') || DashboardRoutes.DASHBOARD);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      {error && <Alert title='Error' description={error} variant='destructive' />}
      <Input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email address' />
      <Input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
      <Button className='bg-blue-600' disabled={loading}>
        {loading ? <Loader className='animate-spin' /> : 'Log in'}
      </Button>
      <div className='flex items-center gap-0 py-2 [&>*]:w-full'>
        <div className='border-b' />
        <p className='text-center text-sm text-black/50 select-none'>Or continue with</p>
        <div className='border-b' />
      </div>
      <Button className='border bg-white text-black'>
        <Image src='/icon_google_g.svg' alt='Google' width={24} height={24} /> Google
      </Button>
    </form>
  );
}
