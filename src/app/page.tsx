import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Monitor } from 'lucide-react';

export default function Home() {
  return (
    <main className='mx-auto'>
      <section className='flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-300 to-blue-500 py-28 text-white'>
        <h1 className='text-6xl font-bold'>Gawa na &apos;yan!</h1>
        <p>Find trusted Filipino talent for any project, big or small.</p>
        <div className='mt-8 flex items-center gap-4'>
          <Input className='max-w-96' />
          <Button>Search</Button>
        </div>
      </section>
      <section>
        <div className='container mx-auto flex flex-col items-center justify-center gap-2 py-28'>
          <h2 className='text-4xl font-bold'>Explore by Category</h2>
          <p>Find the right professional for your needs.</p>
          <div className='mt-8 grid w-full grid-cols-4 gap-4'>
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
            <ExploreCard
              icon={<Monitor size={32} />}
              title='Digital Services'
              description='Design, Writing, VA, & More'
            />
          </div>
        </div>
      </section>
      <section className='flex justify-center bg-neutral-50'>
        <div className='container flex flex-col gap-8 py-20'>
          <h2 className='text-3xl font-bold'>Local Gigs in Angeles</h2>
          <div className='grid grid-cols-4 gap-4'>
            <GigCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <GigCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <GigCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
            <GigCard title='Condo Cleaning for 2-Bedrooms' price={1200} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ExploreCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className='border-none bg-neutral-50 shadow-none'>
      <CardContent className='flex flex-col items-center'>
        <div className='w-fit rounded-full bg-blue-200 p-4 text-blue-700'>{icon}</div>
        <h3 className='mt-4 text-lg font-medium'>{title}</h3>
        <p className='text-sm text-neutral-500'>{description}</p>
      </CardContent>
    </Card>
  );
}

function GigCard({ title, price }: { title: string; price: number }) {
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
