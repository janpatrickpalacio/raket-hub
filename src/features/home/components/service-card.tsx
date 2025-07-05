'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '@/components/user-avatar';
import useServiceContext from '@/features/services/contexts/service-context';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Props {
  service: ServiceWithRaketero;
}

export default function ServiceCard({ service }: Props) {
  const { subcategories } = useServiceContext();
  const subcategory = subcategories.find(subcategory => subcategory.id === service.subcategory_id);

  return (
    <div className='h-auto'>
      <Card className='h-full overflow-hidden border-none py-0'>
        <CardContent className='flex h-full flex-col px-0'>
          <Image
            width={1000}
            height={200}
            quality={20}
            src={service.cover_image_url || `https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${service?.title}`}
            alt='Service cover image'
            className='aspect-video w-full object-cover'
          />
          <div className='mt-2 flex h-full flex-col gap-2 px-4 pt-1 pb-3'>
            <div className='grid gap-0 bg-white'>
              <Badge className='line-clamp-1 bg-blue-400'>{subcategory?.name}</Badge>
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
              <p>{service?.title}</p>
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
