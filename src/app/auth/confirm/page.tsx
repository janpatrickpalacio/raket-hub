'use client';

import Alert from '@/components/alert';
import { createClient } from '@/lib/supabase/client';
import { EmailOtpType } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthConfirm() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as EmailOtpType;
  const token_hash = searchParams.get('token_hash') || '';
  const next = searchParams.get('next');

  useEffect(() => {
    const handleHashFragment = async () => {
      {
        try {
          const supabase = createClient();
          const { error: verifyError } = await supabase.auth.verifyOtp({
            type,
            token_hash,
          });

          if (verifyError) {
            // redirect user to specified redirect URL or root of app\
            setError(verifyError.message);
            return;
          }

          setSuccess(true);
          setTimeout(() => {
            router.replace(next || '/');
          }, 3000);
        } catch (error) {
          setError((error as Error).message);
        }
      }
    };

    handleHashFragment();
  }, [router, next, token_hash, type]);

  return (
    <div className='mx-auto flex min-h-[100dvh] items-center justify-center'>
      {success ? (
        <Alert title='Verification Successful!' variant='success' />
      ) : error ? (
        <Alert title={error} variant='destructive' />
      ) : (
        <div className='rounded-sm border px-4 py-3'>
          <p className='flex items-center gap-2'>
            <Loader2 className='animate-spin' size={20} />
            Verifying your account
          </p>
        </div>
      )}
    </div>
  );
}
