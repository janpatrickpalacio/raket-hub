'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '@/components/user-avatar';
import useServiceContext from '@/features/services/contexts/service-context';
import { createClient } from '@/lib/supabase/client';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';
import { DashboardRoutes, PublicRoutes } from '@/routes';
import { Loader, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  service: ServiceWithRaketero;
}

export default function ServiceCard({ service }: Props) {
  const router = useRouter();
  const { categories, subcategories } = useServiceContext();
  const subcategory = subcategories.find(subcategory => subcategory.id === service.subcategory_id);

  const handleSubcategoryClick = (): void => {
    const category = categories.find(category => category.id === subcategory?.category_id);
    router.push(`${PublicRoutes.SERVICES}?category=${category?.slug}&subcategory=${subcategory?.slug}`);
  };

  return (
    <div className='h-auto'>
      <Card className='h-full overflow-hidden border-none py-0'>
        <CardContent className='relative flex h-full flex-col px-0'>
          <OwnerActions serviceSlug={service.slug} />
          <Link href={`${PublicRoutes.SERVICES}/${service.slug}`}>
            <Image
              width={1000}
              height={200}
              quality={20}
              src={service.cover_image_url || `https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${service?.title}`}
              alt='Service cover image'
              className='aspect-video w-full object-cover'
            />
          </Link>

          <div className='mt-2 flex h-full flex-col gap-2 px-4 pt-1 pb-3'>
            <div className='grid gap-0 bg-white'>
              <Badge
                className='line-clamp-1 cursor-pointer bg-slate-500 transition-colors hover:bg-slate-600'
                onClick={handleSubcategoryClick}
              >
                {subcategory?.name}
              </Badge>
              <div className='my-2 flex items-center gap-2'>
                <UserAvatar
                  user={{
                    id: service.raketero.id,
                    avatar_url: service.raketero.avatar_url,
                    first_name: service.raketero.first_name,
                    last_name: service.raketero.last_name,
                  }}
                  className='h-8 w-8'
                />
                <div className='flex flex-col'>
                  <p className='text-sm font-semibold'>
                    {service?.raketero.first_name} {service?.raketero.last_name}
                  </p>
                  <p className='flex items-center gap-1 rounded-full text-xs'>
                    <Star className='fill-yellow-400 text-yellow-400' size={12} />
                    <span className='font-semibold'>
                      {Number(service.raketero.average_rating).toFixed(1)} ({service.raketero.total_reviews})
                    </span>
                  </p>
                </div>
              </div>
              <p className='line-clamp-2 min-h-[2.4em]'>{service?.title}</p>
            </div>
            <p className='mt-auto font-bold'>From &#x20B1;{service?.price.toLocaleString() || '0.00'}</p>
          </div>

          {/* {service.cover_image_url ? (
            <></>
          ) : (
            <>
               <Image
                width={1000}
                height={500}
                src={`https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${service?.title}`}
                alt='Service cover image'
                className='absolute top-1/2 left-0 w-full -translate-y-1/2'
                unoptimized
              />
              <div className='absolute top-0 left-0 z-0 h-full w-full bg-black/5' />
              <div className='z-0 flex flex-col items-center gap-2 px-4 text-center'>
                <p className='font-bold text-white text-shadow-lg'>{category?.name}</p>
                <p className='text-xs font-semibold text-white text-shadow-lg'>{subcategory?.name}</p>
              </div> 
            </>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}

function OwnerActions({ serviceSlug }: { serviceSlug: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const showOwnerActions = pathname === DashboardRoutes.RAKETS;

  if (!showOwnerActions) return null;

  const handleConfirmDelete = async (): Promise<void> => {
    setDeleting(true);

    const supabase = createClient();

    // Delete service from services table first
    const { error } = await supabase.from('services').delete().eq('slug', serviceSlug);

    if (error) {
      toast.error('Error deleting service');
      setDeleting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Then delete service images from storage
    const folderPath = `${user?.user_metadata.username}/${serviceSlug}`;
    const { data: images } = await supabase.storage.from('services').list(folderPath);

    if ((images?.length ?? 0) > 0) {
      const imagePaths = images?.map(image => `${folderPath}/${image.name}`) || [];
      if (imagePaths.length > 0) {
        await supabase.storage.from('services').remove(imagePaths);
      }
    }

    setDeleting(false);
    setOpen(false);
    toast.success('Service deleted successfully');
    router.refresh();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger
        onClick={() => setOpen(true)}
        className='absolute top-2 right-2 cursor-pointer rounded-sm bg-red-500 p-2 text-white transition-colors hover:bg-red-600'
      >
        <Trash2 size={16} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)} className='cursor-pointer' disabled={deleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} className='cursor-pointer bg-red-500' disabled={deleting}>
            {deleting ? (
              <span className='flex items-center gap-2'>
                <Loader className='animate-spin' /> Deleting..
              </span>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
