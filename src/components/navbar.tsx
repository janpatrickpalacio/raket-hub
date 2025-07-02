'use client';

import Link from 'next/link';
import { Loader, Menu } from 'lucide-react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import RaketHubIcon from './raket-hub-icon';
import { PublicRoutes } from '../../route';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Database } from '@/lib/supabase/types';
import { Skeleton } from './ui/skeleton';

interface NavbarProps {
  user: Database['public']['Tables']['users']['Row'] | null;
  loading: boolean;
  onLogoutClick: () => void;
}

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<Database['public']['Tables']['users']['Row'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  useEffect(() => {
    const checkCurrentSession = async (): Promise<void> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase.from('users').select().eq('id', user.id).single();

      if (!profile) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      if (user) {
        setCurrentUser(profile);
      }
      setLoading(false);
    };

    checkCurrentSession();
  }, [supabase]);

  return (
    <nav className='sticky top-0 z-50 flex w-full items-center justify-center bg-white/70 px-4 py-3 text-black/80 shadow-sm backdrop-blur-md lg:px-0'>
      <NavbarDesktop user={currentUser} loading={loading} onLogoutClick={handleLogout} />
      <NavbarMobile user={currentUser} loading={loading} onLogoutClick={handleLogout} />
    </nav>
  );
}

function NavbarDesktop({ user, loading, onLogoutClick }: NavbarProps) {
  return (
    <div className='container hidden grid-cols-3 items-center justify-between lg:grid'>
      <RaketHubIcon />
      <div className='flex items-center justify-center gap-4'>
        <Link
          href={PublicRoutes.SERVICES}
          className='rounded-lg px-4 py-2 text-sm transition-colors hover:bg-neutral-100'
        >
          Find Services
        </Link>
        <Link
          href={PublicRoutes.HOW_IT_WORKS}
          className='rounded-lg px-4 py-2 text-sm transition-colors hover:bg-neutral-100'
        >
          How it Works
        </Link>
        <Link href='#' className='rounded-lg px-4 py-2 text-sm transition-colors hover:bg-neutral-100'>
          Become a Raketero
        </Link>
      </div>
      <div className='place-self-end'>
        {loading ? (
          <Skeleton className='h-8 w-32 rounded-full' />
        ) : (
          <div className='flex items-center justify-center gap-4'>
            {user ? (
              <Button onClick={onLogoutClick} variant='ghost' className='cursor-pointer'>
                Logout
              </Button>
            ) : (
              <>
                <Link href={PublicRoutes.LOGIN} className='text-sm hover:text-black'>
                  Login
                </Link>
                <Link
                  href={PublicRoutes.SIGN_UP}
                  className='rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NavbarMobile({ user, loading, onLogoutClick }: NavbarProps) {
  return (
    <div className='container flex items-center justify-between lg:hidden'>
      <RaketHubIcon />
      <Drawer direction='left'>
        <DrawerTrigger>
          <Menu />
        </DrawerTrigger>
        <DrawerContent className='px-1'>
          <DrawerHeader>
            <DrawerTitle>
              <RaketHubIcon />
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex flex-col gap-1'>
            <Link
              href={PublicRoutes.SERVICES}
              className='rounded-md px-4 py-2 font-semibold text-neutral-600 transition-colors active:bg-blue-100 active:text-blue-600'
            >
              Find Services
            </Link>
            <Link
              href={PublicRoutes.HOW_IT_WORKS}
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
            {loading ? (
              <Loader className='animate-spin' />
            ) : (
              <>
                {user ? (
                  <Button onClick={onLogoutClick} variant='ghost' className='cursor-pointer'>
                    Logout
                  </Button>
                ) : (
                  <div className='flex w-full items-center justify-center gap-2 text-center'>
                    <Link href={PublicRoutes.LOGIN} className='w-full text-sm'>
                      Login
                    </Link>
                    <Link
                      href={PublicRoutes.SIGN_UP}
                      className='w-full rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600'
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
