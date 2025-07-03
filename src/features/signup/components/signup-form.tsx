'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Loader } from 'lucide-react';
import Alert from '@/components/alert';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function SignUpForm() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<{ [key: string]: string }>({ general: '', email: '', username: '' });
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError({ general: '', email: '', username: '' });
    setSubmitting(true);

    const { data: usernameExists } = await supabase.from('users').select('*').eq('username', username).single();
    if (usernameExists) {
      setError({ ...error, email: '', username: 'Username already exists' });
      setSubmitting(false);
      return;
    }

    const { data: emailExists } = await supabase.from('users').select('*').eq('email', email).single();
    if (emailExists) {
      setError({ ...error, username: '', email: 'Email already exists' });
      setSubmitting(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username: username,
        },
      },
    });

    if (signUpError) {
      setError({ ...error, general: signUpError.message });
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  };

  return (
    <>
      {error.general && <Alert title='Error' description={error.general} variant='destructive' />}
      {success && (
        <Alert title='Verification' description='Please check your email to verify your account' variant='success' />
      )}
      <form onSubmit={handleSubmit} className='mt-4 grid grid-cols-2 gap-5'>
        <Input placeholder='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
        <Input placeholder='Last Name' value={lastName} onChange={e => setLastName(e.target.value)} />

        <div className='col-span-2 flex flex-col gap-1'>
          <Input
            placeholder='Username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={cn(error.username && 'border-red-300 bg-red-50')}
          />
          {error.username && <p className='text-xs text-red-500'>{error.username}</p>}
        </div>

        <div className='col-span-2 flex flex-col gap-1'>
          <Input
            type='email'
            placeholder='Email address'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={cn(error.email && 'border-red-300 bg-red-50')}
          />
          {error.email && <p className='text-xs text-red-500'>{error.email}</p>}
        </div>

        <Input
          type='password'
          placeholder='Password'
          className='col-span-2'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button className='col-span-2 cursor-pointer bg-blue-500 hover:bg-blue-600' disabled={submitting}>
          {submitting ? <Loader className='animate-spin' /> : 'Create Account'}
        </Button>
        <div className='col-span-2 flex items-center gap-0 py-2 [&>*]:w-full'>
          <div className='border-b' />
          <p className='text-center text-sm text-black/50 select-none'>Or continue with</p>
          <div className='border-b' />
        </div>
        <Button className='col-span-2 cursor-pointer border bg-white text-black' disabled={submitting}>
          <Image src='/icon_google_g.svg' alt='Google' width={24} height={24} /> Google
        </Button>
      </form>
    </>
  );
}
