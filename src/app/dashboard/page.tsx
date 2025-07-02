import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function DashboardPage() {
  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold'>Dashboard Overview</h1>
      <p className='text-black/70'>Welcome back, Juan! Here&apos;s what&apos;s happening today.</p>
      <div className='mt-8 grid w-full grid-cols-4 gap-6'>
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
    </div>
  );
}
