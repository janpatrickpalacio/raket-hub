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

  return (
    <div className='grid h-auto grid-rows-[auto_1fr_auto] gap-1'>
      <Card className='relative overflow-hidden border-none py-0 shadow-sm'>
        <CardContent className='items-center justify-center px-0'>
          <Image
            width={1000}
            height={200}
            quality={20}
            src={service.cover_image_url || `https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${service?.title}`}
            alt='Service cover image'
            className='aspect-video h-full w-full object-cover'
          />
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
      <div className='z-0 mt-2 grid h-fit grid-rows-[auto_auto_auto] gap-0'>
        <div className='flex items-center gap-2'>
          <UserAvatar
            user={{
              id: service.raketero.id,
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
      </div>
      <p className='mt-1 font-bold'>From &#x20B1;{service?.price.toLocaleString() || '0.00'}</p>
    </div>
  );
}
