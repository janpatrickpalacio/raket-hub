import RaketHubIcon from '@/components/raket-hub-icon';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PublicRoutes } from '../../../route';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className='container mx-auto flex min-h-[100dvh] flex-col items-center justify-center gap-8'>
      <RaketHubIcon className='text-3xl' />
      <Card className='w-full max-w-md items-center gap-0 border-x-0 border-b-0 border-neutral-100 px-3 py-8 shadow-md'>
        <CardTitle className='text-2xl'>Log in to your account</CardTitle>
        <CardDescription className='mt-2'>
          Don&apos;t have an account?{' '}
          <Link href={PublicRoutes.SIGN_UP} className='text-blue-600'>
            Sign up
          </Link>
        </CardDescription>
        <CardContent className='mt-8 w-full'>
          <form className='grid gap-5'>
            <Input type='email' placeholder='Email address' />
            <Input type='password' placeholder='Password' />
            <Button className='bg-blue-600'>Log in</Button>
            <div className='flex items-center gap-0 py-2 [&>*]:w-full'>
              <div className='border-b' />
              <p className='text-center text-sm text-black/50 select-none'>Or continue with</p>
              <div className='border-b' />
            </div>
            <Button className='border bg-white text-black'>
              <Image src='/icon_google_g.svg' alt='Google' width={24} height={24} /> Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
