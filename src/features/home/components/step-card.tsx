interface Props {
  title: string;
  description: string;
  step: number;
}

export default function StepCard({ title, description, step }: Props) {
  return (
    <div className='flex flex-col items-center justify-center gap-2 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-200 p-2 text-2xl font-semibold text-blue-700'>
        {step}
      </div>
      <h3 className='mt-4 text-xl font-semibold'>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
