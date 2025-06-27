import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  title: string;
  price: number;
}

export default function ServiceCard({ title, price }: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <Card className='relative border-none shadow-none'>
        <CardContent className='flex min-h-40 w-full items-center justify-center'>
          <p className='z-0'>Home Cleaning</p>
        </CardContent>
      </Card>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <Avatar className='max-h-6 max-w-6 rounded-none'>
            <AvatarImage src='https://api.dicebear.com/9.x/glass/svg?radius=20' alt='Avatar' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className='text-sm font-semibold'>Jan Patrick Palacio</p>
        </div>
        <p className='text-lg'>{title}</p>
        <p className='text-lg font-bold'>From &#x20B1;{price.toLocaleString()}</p>
      </div>
    </div>
  );
}
