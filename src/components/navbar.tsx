import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='sticky top-0 z-50 flex w-full items-center justify-center bg-white/70 py-3 text-black/80 backdrop-blur-md'>
      <div className='container flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold'>
          <span>Gawa</span>
          <span className='text-blue-500'>Link</span>
        </Link>
        <div className='flex items-center justify-center gap-4'>
          <Link href='#' className='rounded-lg px-4 py-2 text-sm transition-colors hover:bg-neutral-100'>
            Find Services
          </Link>
          <Link href='#' className='rounded-lg px-4 py-2 text-sm transition-colors hover:bg-neutral-100'>
            How it Works
          </Link>
          <Link href='#' className='rounded-lg px-4 py-2 text-sm transition-colors hover:bg-neutral-100'>
            Become a Raketero
          </Link>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <Link href='#' className='text-sm'>
            Login
          </Link>
          <Link
            href='#'
            className='rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600'
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
