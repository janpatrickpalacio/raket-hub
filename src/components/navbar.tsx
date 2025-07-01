import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import GawaLinkIcon from './gawa-link-icon';

export default function Navbar() {
  return (
    <nav className='sticky top-0 z-50 flex w-full items-center justify-center bg-white/70 px-4 py-3 text-black/80 backdrop-blur-md lg:px-0'>
      <NavbarDesktop />
      <NavbarMobile />
    </nav>
  );
}

function NavbarDesktop() {
  return (
    <div className='container hidden items-center justify-between lg:flex'>
      <GawaLinkIcon />
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
  );
}

function NavbarMobile() {
  return (
    <div className='container flex items-center justify-between lg:hidden'>
      <GawaLinkIcon />
      <Drawer direction='left'>
        <DrawerTrigger>
          <Menu />
        </DrawerTrigger>
        <DrawerContent className='px-1'>
          <DrawerHeader>
            <DrawerTitle>
              <Link href='/' className='text-xl font-bold'>
                <span>Gawa</span>
                <span className='text-blue-500'>Link</span>
              </Link>
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex flex-col gap-1'>
            <Link
              href='#'
              className='rounded-md px-4 py-2 font-semibold text-neutral-600 transition-colors active:bg-blue-100 active:text-blue-600'
            >
              Find Services
            </Link>
            <Link
              href='#'
              className='rounded-md px-4 py-2 font-semibold text-neutral-600 transition-colors active:bg-blue-100 active:text-blue-600'
            >
              How it Works
            </Link>
            <Link
              href='#'
              className='rounded-md px-4 py-2 font-semibold text-neutral-600 transition-colors active:bg-blue-100 active:text-blue-600'
            >
              Become a Raketero
            </Link>
          </div>
          <DrawerFooter>
            <div className='flex w-full items-center justify-center gap-2 text-center'>
              <Link href='#' className='w-full text-sm'>
                Login
              </Link>
              <Link
                href='#'
                className='w-full rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600'
              >
                Sign Up
              </Link>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
