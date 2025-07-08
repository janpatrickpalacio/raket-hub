import { createClient } from '@/lib/supabase/server';
import BecomeARaketeroPageContent from './page-content';

export default async function BecomeARaketeroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <BecomeARaketeroPageContent user={user} />;
}
