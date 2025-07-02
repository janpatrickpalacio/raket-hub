import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';
import Image from 'next/image';

interface Props {
  service: ServiceWithRaketero;
}

export default function ServiceCard({ service }: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <Card className='relative overflow-hidden border-none shadow-none'>
        <CardContent className='flex min-h-40 w-full items-center justify-center'>
          <Image
            width={1000}
            height={500}
            src={`https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${service?.title}`}
            alt='Service cover image'
            className='absolute top-1/2 left-0 w-full -translate-y-1/2'
            unoptimized
          />
          <div className='absolute top-1/2 left-0 z-0 h-full w-full -translate-y-1/2 bg-black/5' />
          <p className='z-0 px-4 text-xl font-bold text-white text-shadow-lg'>Home Cleaning</p>
        </CardContent>
      </Card>
      <div className='z-0 flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <Avatar className='max-h-6 max-w-6 rounded-none'>
            <AvatarImage
              src={
                service?.raketero.avatar_url ||
                `https://api.dicebear.com/9.x/glass/svg?radius=20&seed=${service?.raketero.username}`
              }
              alt='Avatar'
            />
            <AvatarFallback>
              {service.raketero.first_name[0].toUpperCase()}
              {service.raketero.last_name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className='text-sm font-semibold'>
            {service?.raketero.first_name} {service?.raketero.last_name}
          </p>
        </div>
        <p className='text-lg'>{service?.title}</p>
        <p className='text-lg font-bold'>From &#x20B1;{service?.price.toLocaleString() || '0.00'}</p>
      </div>
    </div>
  );
}
