import { Card, CardContent } from '@/components/ui/card';

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ExploreCard({ icon, title, description }: Props) {
  return (
    <Card className='border-none bg-neutral-50 shadow-none'>
      <CardContent className='flex flex-col items-center text-center'>
        <div className='w-fit rounded-full bg-blue-200 p-4 text-blue-700'>{icon}</div>
        <h3 className='mt-4 text-lg font-medium'>{title}</h3>
        <p className='text-sm text-neutral-500'>{description}</p>
      </CardContent>
    </Card>
  );
}
