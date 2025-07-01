import RaketHubIcon from '@/components/raket-hub-icon';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PublicRoutes } from '../../../route';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function SignUpPage() {
  return (
    <main className='container mx-auto flex min-h-[100dvh] flex-col items-center justify-center gap-8'>
      <RaketHubIcon className='text-3xl' />
      <Card className='w-full max-w-md items-center gap-0 border-x-0 border-b-0 border-neutral-100 px-3 py-8 shadow-md'>
        <CardTitle className='text-2xl'>Create your account</CardTitle>
        <CardDescription className='mt-2'>
          Already have an account?{' '}
          <Link href={PublicRoutes.LOGIN} className='text-blue-600'>
            Log in
          </Link>
        </CardDescription>
        <CardContent className='mt-8'>
          <form className='grid grid-cols-2 gap-5'>
            <Input placeholder='First Name' />
            <Input placeholder='Last Name' />
            <Input type='email' placeholder='Email address' className='col-span-2' />
            <Input type='password' placeholder='Password' className='col-span-2' />
            <Button className='col-span-2 bg-blue-600'>Create Account</Button>
            <div className='col-span-2 flex items-center gap-0 py-2 [&>*]:w-full'>
              <div className='border-b' />
              <p className='text-center text-sm text-black/50 select-none'>Or continue with</p>
              <div className='border-b' />
            </div>
            <Button className='col-span-2 border bg-white text-black'>
              <Image src='/icon_google_g.svg' alt='Google' width={24} height={24} /> Google
            </Button>
          </form>
          <p className='mt-4 text-center text-xs text-black/50'>
            By creating an account, you agree to our{' '}
            <Link href='#' className='text-black'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='#' className='text-black'>
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
