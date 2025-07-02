import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignUpPageContent from './page-content';

export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return <SignUpPageContent />;
}
