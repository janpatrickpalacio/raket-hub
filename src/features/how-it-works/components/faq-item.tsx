interface Props {
  question: string;
  answer: string;
}

export default function FaqItem({ question, answer }: Props) {
  return (
    <div className='flex max-w-3xl flex-col gap-2'>
      <h3 className='text-xl font-semibold'>{question}</h3>
      <p>{answer}</p>
    </div>
  );
}
