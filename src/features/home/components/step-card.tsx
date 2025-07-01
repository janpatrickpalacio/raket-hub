import { cn } from '@/lib/utils';

interface Props {
  title: string;
  description: string;
  stepIcon: React.ReactNode | number;
  variant?: 'blue' | 'yellow';
}

export default function StepCard({ title, description, stepIcon, variant = 'blue' }: Props) {
  const variants = {
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className='flex flex-col items-center justify-center gap-2 text-center'>
      <div
        className={cn(
          'flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold',
          variants[variant]
        )}
      >
        {stepIcon}
      </div>
      <h3 className='mt-4 text-2xl font-semibold'>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
