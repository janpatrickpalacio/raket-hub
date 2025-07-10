'use client';

import RaketHubIcon from '@/components/raket-hub-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { PublicRoutes } from '@/routes';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTopLoader } from 'nextjs-toploader';
import { toast } from 'sonner';

export default function OrderFailedPage() {
  const searchParams = useSearchParams();
  const loader = useTopLoader();
  const serviceId = searchParams.get('service_id') || '';

  const handleTryAgain = async (): Promise<void> => {
    try {
      loader.start();

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select()
        .eq('id', serviceId)
        .single();

      if (serviceError) {
        loader.done();
        toast.error(serviceError.message);
        return;
      }

      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: service.id,
          customer_email: user?.email,
          amount: service.price,
          description: `Payment for ${service.title}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        loader.done();
        toast.error(data.error);
        return;
      }

      // If successful, redirect the user to the Xendit payment page
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      alert('Error creating payment: ' + message);
    }
  };

  return (
    <div className='flex min-h-[100dvh] flex-col'>
      <nav className='w-full shadow-sm'>
        <div className='container mx-auto px-2 py-4'>
          <RaketHubIcon />
        </div>
      </nav>
      <main className='flex grow items-center justify-center bg-slate-100'>
        <Card className='w-full max-w-lg'>
          <CardContent className='flex flex-col items-center justify-center gap-4'>
            <div className='rounded-full bg-red-100 p-4'>
              <X size={40} className='text-red-700' />
            </div>
            <p className='text-center text-3xl font-bold'>Payment Failed</p>
            <p className='-mt-2 max-w-md text-center text-neutral-600'>
              Unfortunately, your payment could not be processed. Don&apos;t worry, you have not been charged. Please
              try again or use a different payment method.
            </p>
            <Button
              onClick={handleTryAgain}
              className='mt-4 w-full cursor-pointer rounded-sm bg-blue-600 !py-6 text-center text-base font-semibold text-white transition-colors hover:bg-blue-700'
            >
              Try Again
            </Button>
            <Link href={PublicRoutes.SERVICES} className='text-sm text-blue-500 hover:underline'>
              Back to Services
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
