'use client';

import AuthRedirect from '@/components/auth-redirect';
import DashboardPageWrapper from '@/features/dashboard/components/dashboard-page-wrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { RaketsTableRow } from '@/lib/supabase/custom-types';
import { DashboardRoutes } from '@/routes';
import { useState } from 'react';
import useCustomRouter from '@/hooks/use-custom-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatNumber } from '@/lib/utils';
import CustomBadge from '@/components/custom-badge';
import { Ban } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Props {
  services: RaketsTableRow[] | null;
}

type Status = 'all' | 'approved' | 'pending' | 'rejected';

export default function RaketsPageContent({ services }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>('all');
  const router = useCustomRouter();

  const onTabChanged = (tab: string): void => {
    setStatus(tab as Status);
    router.push(tab === 'all' ? DashboardRoutes.RAKETS : `${DashboardRoutes.RAKETS}?status=${tab}`);
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'destructive' | undefined => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'destructive';
    }
    return undefined;
  };

  return (
    <>
      <AuthRedirect />
      <DashboardPageWrapper
        title='Your Rakets'
        description={`Rakets are the services you've created. You can view and manage them here.`}
      >
        <Tabs onValueChange={onTabChanged} value={status}>
          <TabsList className='gap-1 [&>*]:cursor-pointer [&>*]:hover:bg-white'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='approved'>Approved</TabsTrigger>
            <TabsTrigger value='pending'>Pending</TabsTrigger>
            <TabsTrigger value='rejected'>Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        <Card className='mt-4 px-4 py-2'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='text-xs tracking-wide text-neutral-600 uppercase'>Raket</TableHead>
                  <TableHead className='text-xs tracking-wide text-neutral-600 uppercase'>Price</TableHead>
                  <TableHead className='text-xs tracking-wide text-neutral-600 uppercase'>Orders</TableHead>
                  <TableHead className='text-xs tracking-wide text-neutral-600 uppercase'>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services && services.length > 0 ? (
                  services.map(service => (
                    <TableRow key={service.id} className='hover:bg-transparent'>
                      <TableCell className='flex w-[32ch] max-w-[40ch] flex-col'>
                        <p className='truncate font-semibold'>{service.title}</p>
                        <p className='text-xs text-black/60'>{format(service.created_at, 'MMMM dd, yyyy')}</p>
                      </TableCell>
                      <TableCell>
                        <p>&#x20B1; {formatNumber(service.price)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{service.orders[0].count}</p>
                      </TableCell>
                      <TableCell>
                        <CustomBadge
                          variant={getStatusVariant(service.status)}
                          className='rounded-full font-semibold capitalize'
                        >
                          {service.status}
                        </CustomBadge>
                      </TableCell>
                      <TableCell className='text-right'>
                        {service.status === 'rejected' ? (
                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger className='cursor-pointer font-semibold text-blue-500 hover:text-blue-600 hover:underline'>
                              View Reason &amp; Edit
                            </DialogTrigger>
                            <DialogContent className='overflow-hidden p-0'>
                              <div className='p-4'>
                                <DialogHeader>
                                  <DialogTitle className='flex items-center gap-4'>
                                    <span className='rounded-full bg-red-100 p-3 text-red-500'>
                                      <Ban size={24} />
                                    </span>
                                    Raket Rejected
                                  </DialogTitle>
                                </DialogHeader>
                                <Separator className='my-4' />
                                <p className='text-sm text-neutral-600'>
                                  An administrator has reviewed your Raket and it requires changes before it can be
                                  approved. Please see the reason below:
                                </p>
                                <div className='mt-2 rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-900'>
                                  <p>{service.rejection_reason}</p>
                                </div>
                              </div>
                              <DialogFooter className='bg-neutral-50 p-4'>
                                <Link
                                  href={`${DashboardRoutes.RAKETS_EDIT}/${service.id}`}
                                  className='cursor-pointer rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                                >
                                  Okay I&apos;ll fix it
                                </Link>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Link
                            href={`${DashboardRoutes.RAKETS}/edit/${service.id}`}
                            className='cursor-pointer font-semibold text-blue-500 hover:text-blue-600 hover:underline'
                          >
                            Edit
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center'>
                      No rakets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* {hasServices ? (
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            <Link
              href={DashboardRoutes.RAKETS_NEW}
              className='flex aspect-video h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8 text-sm text-neutral-500 transition-colors hover:bg-neutral-100'
            >
              <FolderPlus size={40} className='mb-4 text-neutral-400' />
              Create New Raket
            </Link>
            {services?.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className='flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8'>
            <FolderPlus size={40} className='mb-4 text-neutral-400' />
            <p className='text-sm'>No rakets yet!</p>
            <p className='text-sm text-black/50'>Start earning by offering your skills to the community.</p>
            <Link
              href={DashboardRoutes.RAKETS_NEW}
              className='mt-6 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
            >
              Create Your First Raket
            </Link>
          </div>
        )} */}
      </DashboardPageWrapper>
    </>
  );
}
