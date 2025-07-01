import Link from 'next/link';
import RaketHubIcon from './raket-hub-icon';

export default function Footer() {
  return (
    <footer className='flex justify-center bg-gray-800'>
      <div className='container flex flex-col items-center gap-12 py-8 text-white/50'>
        <div className='grid gap-12 sm:grid-cols-4 sm:justify-items-center sm:gap-4'>
          <div className='flex flex-col gap-4'>
            <RaketHubIcon className='text-2xl text-white' />
            <p>The Philippines' community marketplace for skills and services.</p>
          </div>
          <div className='flex flex-col gap-3'>
            <p className='text-sm font-semibold text-white/80'>CATEGORIES</p>
            <ul className='flex flex-col gap-3'>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Digital Services
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Local Services
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Events & Catering
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Lessons & Tutoring
                </Link>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-3'>
            <p className='text-sm font-semibold text-white/80'>CATEGORIES</p>
            <ul className='flex flex-col gap-3'>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Digital Services
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Local Services
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Events & Catering
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Lessons & Tutoring
                </Link>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-3'>
            <p className='text-sm font-semibold text-white/80'>CATEGORIES</p>
            <ul className='flex flex-col gap-3'>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Digital Services
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Local Services
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Events & Catering
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:opacity-80'>
                  Lessons & Tutoring
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='w-full border-b border-b-white/20' />
        <p className='text-center'>© 2025 RaketHub Philippines. All rights reserved.</p>
      </div>
    </footer>
  );
}
