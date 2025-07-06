'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserAvatar from '@/components/user-avatar';
import useServiceContext from '@/features/services/contexts/service-context';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';
import { PublicRoutes } from '@/routes';
import clsx from 'clsx';
import { Clock, Edit, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  service: ServiceWithRaketero;
}

export default function ServiceViewPageContent({ service }: Props) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(service.cover_image_url || '/');
  const { categories, subcategories } = useServiceContext();
  const subcategory = subcategories.find(subcategory => subcategory.id === service.subcategory_id);
  const category = categories.find(category => category.id === subcategory?.category_id);
  const allServiceImages = [service.cover_image_url, ...(service.gallery_image_urls ?? [])];

  return (
    <main className='relative container mx-auto my-12 min-h-[90dvh] max-w-7xl px-4'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`${PublicRoutes.SERVICES}?category=${category?.slug}`}>
              {category?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`${PublicRoutes.SERVICES}?category=${category?.slug}&subcategory=${subcategory?.slug}`}
            >
              {subcategory?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='mt-4 grid grid-cols-3 gap-8'>
        <section className='col-span-2 flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <Image
              src={currentImageUrl || `https://api.dicebear.com/9.x/glass/svg?radius=0&seed=${service?.title}`}
              alt={service.title}
              width={1920}
              height={500}
              quality={20}
              className='col-span-full aspect-video w-full rounded-lg bg-gray-200 object-contain shadow-md'
            />
            <div className='w-full overflow-x-auto'>
              <div className='flex gap-4 pb-2' style={{ width: 'max-content' }}>
                {allServiceImages
                  .filter(imageUrl => imageUrl !== null)
                  .map((imageUrl, index) => (
                    <Image
                      key={index}
                      src={imageUrl}
                      alt={service.title}
                      width={1920}
                      height={500}
                      quality={20}
                      onClick={() => setCurrentImageUrl(imageUrl || '')}
                      className={clsx(
                        'aspect-video w-[200px] rounded-lg object-contain transition-all duration-100 hover:cursor-pointer hover:border-4 hover:border-blue-400',
                        currentImageUrl === imageUrl && 'border-4 border-blue-400'
                      )}
                    />
                  ))}
              </div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>About This Raket</CardTitle>
              <CardContent className='mt-4 p-0'>
                <p>{service.description}</p>
              </CardContent>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>Reviews ({service.raketero.total_reviews})</CardTitle>
              <CardContent className='mt-4 p-0'>
                {(service.raketero.total_reviews ?? 0) === 0 ? (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-start gap-4'>
                      <UserAvatar user={service.raketero} className='h-12 w-12' />
                      <div className='flex flex-col gap-1'>
                        <p className='flex items-center gap-4 font-semibold'>
                          {service.raketero.first_name} {service.raketero.last_name}{' '}
                          <span className='flex items-center gap-1 text-sm'>
                            <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                            5.0
                          </span>
                        </p>
                        <p>
                          I had a great experience working with Juan. He is very professional and delivered high-quality
                          work. I will definitely work with him again.
                        </p>
                        <p className='mt-2 text-xs text-neutral-500'>4 days ago</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No reviews yet</p>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </section>
        <section className='sticky top-24 left-0 h-full'>
          <Card className='gap-3 border-neutral-100 bg-white'>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <UserAvatar user={service.raketero} className='h-12 w-12' />
                <div className='flex flex-col gap-0'>
                  <p className='flex items-center gap-4 font-semibold'>
                    {service.raketero.first_name} {service.raketero.last_name}
                  </p>
                  <p className='flex items-center gap-1 text-xs font-semibold'>
                    <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                    {service.raketero.average_rating.toFixed(1)}
                    <span className='font-normal text-neutral-500'>({service.raketero.total_reviews})</span>
                  </p>
                </div>
              </div>
              <Separator className='my-4' />
              <div className='flex items-center justify-between'>
                <p>Price</p>
                <p className='text-xl font-bold'>&#8369;{service.price.toLocaleString()}</p>
              </div>
              <div className='mt-3 flex flex-col gap-2'>
                <p className='flex items-center gap-2 text-xs text-black/70'>
                  <Clock className='h-4 w-4 text-green-600' /> {service.delivery_days}-Day Delivery
                </p>
                {service.number_of_revisions !== null && (
                  <p className='flex items-center gap-2 text-xs text-black/70'>
                    <Edit className='h-4 w-4 text-green-600' />{' '}
                    {service.number_of_revisions > 0 ? service.number_of_revisions : 'Unlimited'} Revisions Included
                  </p>
                )}
              </div>
              <div className='mt-4 flex flex-col gap-2'>
                <Button className='w-full cursor-pointer bg-blue-600 py-6 text-base font-bold hover:bg-blue-700'>
                  Order Now (&#8369;{service.price.toLocaleString()})
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
