import clsx from 'clsx';
import { BaseComponent } from '../../types';

interface Props extends BaseComponent {
  title: string;
  description?: string;
  children?: React.ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function HeroSection({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
}: Props) {
  return (
    <section
      className={clsx(
        'flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-700 from-10% to-blue-300 px-4 py-28 text-center text-white',
        className
      )}
    >
      <h1 className={clsx('text-3xl font-bold whitespace-pre-line sm:text-6xl', titleClassName)}>{title}</h1>
      {description && <p className={clsx('max-w-3xl text-white/80 sm:text-lg', descriptionClassName)}>{description}</p>}
      {children}
    </section>
  );
}
