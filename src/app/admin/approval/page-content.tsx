'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/user-avatar';
import useServiceContext from '@/features/services/contexts/service-context';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRef, useState } from 'react';

type Service = Database['public']['Tables']['services']['Row'];
type Raketero = Pick<
  Database['public']['Tables']['users']['Row'],
  'id' | 'avatar_url' | 'first_name' | 'last_name' | 'username'
>;

interface ServiceWithRaketero extends Service {
  raketero: Raketero;
}

interface Props {
  inactiveServices: ServiceWithRaketero[];
}

export default function AdminApprovalPageContent({ inactiveServices }: Props) {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Raket Approval Queue</h1>
      <p className='text-neutral-500'>Review and approve new services submitted by Raketeros.</p>
      <Table className='mt-8 border'>
        <TableHeader className='bg-neutral-100'>
          <TableRow>
            <TableHead className='text-xs tracking-wide text-neutral-600 uppercase'>Raket Title</TableHead>
            <TableHead className='text-xs tracking-wide text-neutral-600 uppercase'>Raketero</TableHead>
            <TableHead className='text-xs tracking-wide text-neutral-600 uppercase'>Submitted On</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inactiveServices && inactiveServices.length > 0 ? (
            inactiveServices.map(service => <ServiceRow key={service.id} service={service} />)
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='text-center'>
                No pending rakets
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ServiceRow({ service }: { service: ServiceWithRaketero }) {
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createClient();
  const { categories, subcategories } = useServiceContext();
  const subcategory = subcategories.find(subcategory => subcategory.id === service.subcategory_id);
  const category = categories.find(category => category.id === subcategory?.category_id);
  const imageUrls = [service.cover_image_url, ...(service.gallery_image_urls || [])];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleApprove = async () => {
    setLoading(true);
    const { error } = await supabase.from('services').update({ status: 'approved' }).eq('id', service.id);

    if (error) {
      throw new Error(error.message);
    }

    setLoading(false);
    window.location.reload();
  };

  const handleReject = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('services')
      .update({ status: 'rejected', rejection_reason: textareaRef.current?.value || null })
      .eq('id', service.id);

    if (error) {
      throw new Error(error.message);
    }

    setLoading(false);
    window.location.reload();
  };

  return (
    <TableRow>
      <TableCell className='font-medium'>{service.title}</TableCell>
      <TableCell className='flex items-center gap-2'>
        <UserAvatar user={service.raketero} />
        <p>
          {service.raketero.first_name} {service.raketero.last_name.charAt(0).toUpperCase()}. (@
          {service.raketero.username})
        </p>
      </TableCell>
      <TableCell>{format(service.created_at, 'MMMM dd, yyyy')}</TableCell>
      <TableCell className='text-right'>
        <Dialog>
          <DialogTrigger className='cursor-pointer'>Review</DialogTrigger>
          <DialogContent className='!max-w-5xl'>
            <DialogTitle className='text-xl font-bold'>Review Raket</DialogTitle>
            <p className='-mb-3 font-semibold'>Raket Details</p>
            <div className='flex flex-col gap-2 border p-2'>
              <p className='text-sm font-semibold'>
                Title: <span className='font-normal'>{service.title}</span>
              </p>
              <p className='text-sm font-semibold'>
                Category:{' '}
                <span className='font-normal'>
                  {category?.name} {'>'} {subcategory?.name}
                </span>
              </p>
              <p className='text-sm font-semibold'>
                Price:{' '}
                <span className='font-normal'>
                  &#x20B1;{service.price.toLocaleString()} ({service.pricing_type})
                </span>
              </p>
              <p className='flex flex-col text-sm font-semibold'>
                Description: <span className='font-normal'>{service.description}</span>
              </p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='font-semibold'>Images</p>
              <div className='flex w-full items-center gap-2 overflow-x-auto pb-2'>
                {imageUrls.map(url => (
                  <Image
                    key={url}
                    src={url as string}
                    alt={service.title}
                    width={500}
                    height={200}
                    quality={20}
                    className='aspect-video max-w-1/3 border object-contain'
                  />
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-sm text-neutral-500'>Reason for Rejection (Optional)</p>
              <Textarea ref={textareaRef} className='resize-none' />
            </div>
            <DialogFooter>
              <Button
                onClick={handleReject}
                className='cursor-pointer bg-red-500 font-semibold transition-colors hover:bg-red-600'
                disabled={loading}
              >
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                className='cursor-pointer bg-green-700 font-semibold transition-colors hover:bg-green-800'
                disabled={loading}
              >
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
