import Link from 'next/link';
import { BaseComponent } from '../../types';
import { cn } from '@/lib/utils';

type Props = BaseComponent;

export default function RaketHubIcon({ className }: Props) {
  return (
    <Link href='/' className={cn('text-xl font-bold', className)}>
      <span>Raket</span>
      <span className='text-blue-500'>Hub</span>
    </Link>
  );
}
