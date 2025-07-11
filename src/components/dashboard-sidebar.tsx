'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  BriefcaseBusiness,
  ChevronUp,
  ClipboardList,
  Home,
  LogOut,
  LucideProps,
  MessageCircleMore,
  Settings,
  Wallet,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import RaketHubIcon from './raket-hub-icon';
import { Separator } from './ui/separator';
import { FormEvent, ForwardRefExoticComponent, RefAttributes } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { AuthRoutes, DashboardRoutes } from '@/routes';
import UserAvatar from './user-avatar';

interface Props {
  user: Database['public']['Tables']['users']['Row'];
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'My Orders',
    href: '/dashboard/orders',
    icon: ClipboardList,
  },
  {
    label: 'My Rakets',
    href: '/dashboard/rakets',
    icon: BriefcaseBusiness,
    subMenuItems: [
      {
        label: 'Create New Raket',
        href: DashboardRoutes.RAKETS_NEW,
      },
    ],
  },
  {
    label: 'Messages',
    href: '/dashboard/messages',
    icon: MessageCircleMore,
  },
  {
    label: 'Wallet',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
];

export default function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push(AuthRoutes.LOGIN);
  };

  return (
    <Sidebar>
      <SidebarHeader className='mt-4 flex items-center justify-center'>
        <RaketHubIcon className='text-2xl' />
      </SidebarHeader>
      <Separator className='my-4' />
      <SidebarContent>
        <SidebarMenu className='px-4'>
          {menuItems.map(item => (
            <CustomSidebarItem key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className='cursor-pointer'>
                  <UserAvatar user={user} />
                  {user?.first_name} {user?.last_name}
                  <ChevronUp className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' className='w-52'>
                <DropdownMenuItem asChild>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'cursor-pointer text-black/70 transition-colors duration-100 hover:bg-blue-600 hover:text-white',
                      pathname === DashboardRoutes.SETTINGS && 'bg-blue-600 text-white'
                    )}
                  >
                    <Link href={DashboardRoutes.SETTINGS} className='justify-start rounded-md'>
                      <Settings size={20} />
                      Settings
                    </Link>
                  </SidebarMenuButton>
                </DropdownMenuItem>
                <form onSubmit={handleLogout}>
                  <DropdownMenuItem asChild>
                    <button
                      type='submit'
                      className='flex w-full cursor-pointer items-center gap-2 !text-red-400 transition-colors'
                    >
                      <LogOut className='text-red-300' />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function CustomSidebarItem({
  item,
}: {
  item: {
    label: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    subMenuItems?: {
      label: string;
      href: string;
    }[];
  };
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const showSubMenuItems = pathname.includes(item.href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          'px-4 py-4.5 text-black/70 transition-colors duration-100 hover:bg-blue-600 hover:text-white',
          isActive && 'bg-blue-600 text-white'
        )}
      >
        <Link href={item.href} className='justify-start rounded-md'>
          <item.icon size={20} />
          {item.label}
        </Link>
      </SidebarMenuButton>
      {showSubMenuItems && item.subMenuItems && (
        <SidebarMenu className='mt-1 px-4'>
          {item.subMenuItems.map(subItem => (
            <SidebarMenuSubItem key={subItem.href}>
              <SidebarMenuButton
                asChild
                className={cn(
                  'px-4 py-4.5 text-black/70 transition-colors duration-100 hover:bg-transparent hover:text-blue-600',
                  pathname === subItem.href && 'text-blue-500'
                )}
              >
                <Link href={subItem.href} className='justify-start rounded-md text-sm'>
                  {subItem.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenu>
      )}
    </SidebarMenuItem>
  );
}
