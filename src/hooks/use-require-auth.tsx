'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthRoutes } from '@/routes';

export default function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkCurrentSession = async (): Promise<void> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(AuthRoutes.LOGIN);
      }
    };

    checkCurrentSession();
  }, [router]);
}
