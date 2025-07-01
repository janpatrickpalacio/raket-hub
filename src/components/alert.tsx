import { cn } from '@/lib/utils';
import { AlertCircle, CircleCheck } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  iconSize?: number;
}

export default function Alert({ title, description, variant = 'default', iconSize = 14 }: Props) {
  const variants = {
    default: {
      bg: 'bg-gray-100',
      titleColor: 'text-gray-700',
      descriptionColor: 'text-gray-700/80',
      border: 'border-gray-200',
      icon: <AlertCircle size={iconSize} />,
    },
    destructive: {
      bg: 'bg-red-100',
      titleColor: 'text-red-500',
      descriptionColor: 'text-red-500/70',
      border: 'border-red-200',
      icon: <AlertCircle size={iconSize} />,
    },
    success: {
      bg: 'bg-green-100',
      titleColor: 'text-green-700',
      descriptionColor: 'text-green-700/80',
      border: 'border-green-200',
      icon: <CircleCheck size={iconSize} />,
    },
  };

  return (
    <div className={cn('rounded-lg border p-3', variants[variant].bg, variants[variant].border)}>
      {title && (
        <p className={cn('flex items-center gap-1.5 text-sm', variants[variant].titleColor)}>
          {variants[variant].icon} {title}
        </p>
      )}
      {description && <p className={cn('text-xs', variants[variant].descriptionColor)}>{description}</p>}
    </div>
  );
}
