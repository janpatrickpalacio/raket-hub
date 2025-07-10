import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { cn, userAvatarFallback } from '@/lib/utils';
import { Database } from '@/lib/supabase/types';
import { BaseComponent } from '../../types';

interface Props extends BaseComponent {
  user: Partial<Database['public']['Tables']['users']['Row']>;
}

export default function UserAvatar({ user, className }: Props) {
  return (
    <Avatar className={cn('h-6 w-6 border bg-blue-100', className)}>
      <AvatarImage
        src={user?.avatar_url || userAvatarFallback({ seed: `${user.first_name} ${user.last_name}` })}
        alt='Avatar'
      />
    </Avatar>
  );
}
