import { cn } from '@/lib/utils';
import { BaseComponent } from '../../types';
import { Badge } from './ui/badge';

interface Props extends BaseComponent {
  children: React.ReactNode;
  variant?: 'warning' | 'success' | 'destructive';
}

export default function CustomBadge({ children, variant, className }: Props) {
  const variants = {
    warning: 'bg-yellow-100 text-yellow-700',
    success: 'bg-green-100 text-green-700',
    destructive: 'bg-red-100 text-red-700',
  };

  return <Badge className={cn(className, variant && variants[variant])}>{children}</Badge>;
}
