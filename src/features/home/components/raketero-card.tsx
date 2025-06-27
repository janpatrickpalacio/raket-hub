import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface Props {
  firstName: string;
  lastName: string;
  jobTitle: string;
  rating: number;
  reviews: number;
}

export default function RaketeroCard({ firstName, lastName, jobTitle, rating, reviews }: Props) {
  return (
    <Card className='border-none'>
      <CardContent className='flex flex-col items-center gap-2'>
        <div className='flex w-fit items-center justify-center rounded-full bg-blue-200 p-5 text-3xl font-bold'>
          {firstName[0].toUpperCase()}
          {lastName[0].toUpperCase()}
        </div>
        <div className='flex flex-col text-center'>
          <p className='text-lg font-semibold'>
            {firstName} {lastName[0].toUpperCase()}.
          </p>
          <p className='text-blue-700'>{jobTitle}</p>
        </div>
        <div className='flex items-center gap-1.5'>
          <Star className='fill-yellow-400 text-yellow-400' size={16} />
          <span>
            {rating} <span className='text-neutral-500'>({reviews} reviews)</span>
          </span>
        </div>
        <Link
          href='/profile'
          className='mt-4 w-full rounded-full bg-blue-50 py-2 text-center font-semibold text-blue-700'
        >
          View Profile
        </Link>
      </CardContent>
    </Card>
  );
}
