import RaketHubIcon from '@/components/raket-hub-icon';
import { Card, CardContent } from '@/components/ui/card';
import SubmitRequirementsForm from '@/features/orders/submit-requirements/components/submit-requirements-form';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';
import { createClient } from '@/lib/supabase/server';
import { AuthRoutes } from '@/routes';
import { Files } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{ order_id: string }>;
  searchParams: Promise<{ email: string }>;
}

export default async function OrderSuccessPage({ params, searchParams }: Props) {
  const supabase = await createClient();
  const { order_id } = await params;
  const { email } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(AuthRoutes.LOGIN);
  }

  if (user.email !== email) {
    notFound();
  }

  // Check if order exists
  const { data: order } = await supabase
    .from('orders')
    .select('*, service:services(*, raketero:users(first_name, last_name, avatar_url))')
    .eq('id', order_id)
    .single();

  if (!order) {
    notFound();
  }

  const service = order.service;

  return (
    <div className='flex min-h-[100dvh] flex-col'>
      <nav className='w-full shadow-sm'>
        <div className='container mx-auto px-2 py-4'>
          <RaketHubIcon />
        </div>
      </nav>
      <main className='flex grow flex-col items-center justify-center gap-8 bg-slate-100 py-20'>
        <Card className='w-full max-w-3xl'>
          <CardContent className='flex flex-col items-center justify-center gap-4 px-8 py-4'>
            <div className='rounded-full bg-blue-200 p-4'>
              <Files size={40} className='text-blue-700' />
            </div>
            <p className='text-center text-3xl font-bold'>Payment Successful!</p>
            <p className='text-center text-neutral-600'>
              Just one last step. Please provide the necessary details for your order with{' '}
              <span className='font-semibold'>
                {service.raketero.first_name} {service.raketero.last_name}
              </span>
              .
            </p>
            {/* <div className='w-full rounded-lg border bg-slate-50 p-4'>
              <p className='text-sm text-neutral-500'>You are submitting requirements for:</p>
              <p className='font-semibold'>I will design a modern, minimalist logo</p>
            </div> */}
          </CardContent>
        </Card>
        <SubmitRequirementsForm orderId={order.id} service={service as ServiceWithRaketero} />
      </main>
    </div>
  );
}
