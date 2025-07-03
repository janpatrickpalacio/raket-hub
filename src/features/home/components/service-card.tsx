'use client';

import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '@/components/user-avatar';
import useServiceContext from '@/features/services/contexts/service-context';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';
import Image from 'next/image';

interface Props {
  service: ServiceWithRaketero;
}

export default function ServiceCard({ service }: Props) {
  const { categories, subcategories } = useServiceContext();
  const subcategory = subcategories.find(subcategory => subcategory.id === service.subcategory_id);
  const category = categories.find(category => category.id === subcategory?.category_id);

  return (
    <div className='flex flex-col gap-2'>
      <Card className='relative max-h-40 min-h-40 overflow-hidden border-none shadow-none'>
        <CardContent className='flex h-full w-full items-center justify-center px-0'>
          {service.cover_image_url ? (
            <>
              <Image
                width={1000}
                height={500}
                src={service.cover_image_url}
                alt='Service cover image'
                className='object-contain'
              />
            </>
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
          )}
        </CardContent>
      </Card>
      <div className='z-0 grid h-full grid-rows-[auto_1fr_auto] gap-1'>
        <div className='flex items-center gap-2'>
          <UserAvatar
            user={{
              avatar_url: service.raketero.avatar_url,
              first_name: service.raketero.first_name,
              last_name: service.raketero.last_name,
            }}
          />
          <p className='text-sm font-semibold'>
            {service?.raketero.first_name} {service?.raketero.last_name}
          </p>
        </div>
        <p>{service?.title}</p>
        <p className='text-lg font-bold'>From &#x20B1;{service?.price.toLocaleString() || '0.00'}</p>
      </div>
    </div>
  );
}
