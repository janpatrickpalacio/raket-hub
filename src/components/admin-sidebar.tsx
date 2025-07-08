'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { ListCheck, LogOut, LucideProps } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import RaketHubIcon from './raket-hub-icon';
import { Separator } from './ui/separator';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { AdminRoutes, PublicRoutes } from '@/routes';

const menuItems = [
  {
    label: 'Approval',
    href: AdminRoutes.APPROVAL,
    icon: ListCheck,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className='mt-4 flex items-center justify-center'>
        <RaketHubIcon className='text-2xl' />
      </SidebarHeader>
      <Separator className='my-4' />
      <SidebarContent>
        <SidebarMenu className='px-4'>
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            return <CustomSidebarItem key={item.href} item={item} isActive={isActive} />;
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <CustomSidebarItem
            item={{
              label: 'Exit Admin Dashboard',
              href: PublicRoutes.HOME,
              icon: LogOut,
            }}
            isActive={false}
          />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function CustomSidebarItem({
  item,
  isActive,
}: {
  item: {
    label: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  };
  isActive: boolean;
}) {
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
    </SidebarMenuItem>
  );
}
