'use client';

import Link from 'next/link';
import { LayoutDashboard, Loader, LogOut, Menu, Settings } from 'lucide-react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import RaketHubIcon from './raket-hub-icon';
import { AuthRoutes, DashboardRoutes, PublicRoutes } from '@/routes';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Skeleton } from './ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import UserAvatar from './user-avatar';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavbarProps {
  user: Database['public']['Tables']['users']['Row'] | null;
  loading: boolean;
  onLogoutClick: () => void;
}

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<Database['public']['Tables']['users']['Row'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(AuthRoutes.LOGIN);
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
    <div className='container hidden grid-cols-3 items-center px-4 lg:grid'>
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
      <div className='justify-self-end'>
        {loading ? (
          <Skeleton className='h-8 w-32 rounded-full' />
        ) : (
          <div className='flex items-center justify-center gap-4'>
            {user ? (
              <Popover>
                <PopoverTrigger>
                  <UserAvatar user={user} className='h-8 w-8 cursor-pointer hover:opacity-80' />
                </PopoverTrigger>
                <PopoverContent align='end' className='max-w-64 p-2'>
                  <div className='flex items-center gap-2'>
                    <UserAvatar user={user} className='h-8 w-8' />
                    <div>
                      <p className='text-sm font-semibold'>
                        {user.first_name} {user.last_name}
                      </p>
                      <p className='text-muted-foreground text-xs'>{user.email}</p>
                    </div>
                  </div>
                  <Separator className='my-2' />
                  <Link
                    href={DashboardRoutes.DASHBOARD}
                    className='flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-black/80 transition-colors hover:bg-neutral-100'
                  >
                    <LayoutDashboard size={16} className='text-black/60' />
                    Dashboard
                  </Link>
                  <Link
                    href={DashboardRoutes.SETTINGS}
                    className='flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-black/80 transition-colors hover:bg-neutral-100'
                  >
                    <Settings size={16} className='text-black/60' />
                    Settings
                  </Link>
                  <button
                    onClick={onLogoutClick}
                    className='flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-black/80 transition-colors hover:bg-neutral-100'
                  >
                    <LogOut size={16} className='text-black/60' />
                    Logout
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Link href={AuthRoutes.LOGIN} className='text-sm hover:text-black'>
                  Login
                </Link>
                <Link
                  href={AuthRoutes.SIGN_UP}
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
                    <Link href={AuthRoutes.LOGIN} className='w-full text-sm'>
                      Login
                    </Link>
                    <Link
                      href={AuthRoutes.SIGN_UP}
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
