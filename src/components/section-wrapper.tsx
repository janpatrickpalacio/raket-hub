import { BaseComponent } from '../../types';

interface Props extends BaseComponent {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function SectionWrapper({ children, title, description, className }: Props) {
  return (
    <section className={className}>
      <div className='container mx-auto flex flex-col items-center justify-center gap-2 px-4 py-20 sm:py-28'>
        <h2 className='text-center text-2xl font-bold sm:text-left sm:text-4xl'>{title}</h2>
        {description && <p className='mb-20 text-center opacity-80 sm:text-left sm:text-lg'>{description}</p>}
        {children}
      </div>
    </section>
  );
}
