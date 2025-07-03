'use client';

import useRequireAuth from '@/hooks/use-require-auth';

export default function AuthRedirect() {
  useRequireAuth();
  return null;
}
