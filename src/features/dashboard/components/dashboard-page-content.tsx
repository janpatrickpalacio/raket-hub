'use client';

import { User } from '@supabase/supabase-js';
import DashboardPageWrapper from './dashboard-page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import useRequireAuth from '@/hooks/use-require-auth';

interface Props {
  user: User | null;
}

export default function DashboardPageContent({ user }: Props) {
  useRequireAuth();

  return (
    <DashboardPageWrapper
      title='Dashboard'
      description={`Welcome back, ${user?.user_metadata?.first_name}! Here's what's happening today.`}
    >
      <div className='grid w-full grid-cols-4 gap-6'>
        <Card className='justify-center shadow-md'>
          <CardContent>
            <p className='text-sm text-black/70'>Active Orders</p>
            <span className='text-3xl font-semibold'>2</span>
          </CardContent>
        </Card>
        <Card className='justify-center shadow-md'>
          <CardContent>
            <p className='text-sm text-black/70'>Pending Reviews</p>
            <span className='text-3xl font-semibold'>1</span>
          </CardContent>
        </Card>
        <Card className='justify-center shadow-md'>
          <CardContent>
            <p className='text-sm text-black/70'>Total Spent</p>
            <span className='text-3xl font-semibold'>&#x20B1;1,000</span>
          </CardContent>
        </Card>
        <Card className='justify-center shadow-md'>
          <CardContent>
            <p className='text-sm text-black/70'>Wallet Balance</p>
            <span className='text-3xl font-semibold text-green-600'>&#x20B1;850</span>
          </CardContent>
        </Card>
        <Card className='col-span-full shadow-md'>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='-mt-2'>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className='flex flex-col'>
                    <p className='font-semibold'>Website Redesign</p>
                    <p className='text-black/60'>June 25, 2023</p>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge>Pending</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='flex flex-col'>
                    <p className='font-semibold'>Website Redesign</p>
                    <p className='text-black/60'>June 25, 2023</p>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge>Pending</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='flex flex-col'>
                    <p className='font-semibold'>Website Redesign</p>
                    <p className='text-black/60'>June 25, 2023</p>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge>Pending</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardPageWrapper>
  );
}
