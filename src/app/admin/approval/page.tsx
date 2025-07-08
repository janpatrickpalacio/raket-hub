import { createClient } from '@/lib/supabase/server';
import AdminApprovalPageContent from './page-content';

export default async function AdminApprovalPage() {
  const supabase = await createClient();

  const { data: inactiveServices, error } = await supabase
    .from('services')
    .select('*, raketero:users(id, first_name, last_name, avatar_url, username)')
    .eq('status', 'pending');

  if (error) {
    throw new Error(error.message);
  }

  return <AdminApprovalPageContent inactiveServices={inactiveServices} />;
}
