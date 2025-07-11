'use client';

import { AppRouterInstance, NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useTopLoader } from 'nextjs-toploader';

export default function useCustomRouter(): AppRouterInstance {
  const router = useRouter();
  const loader = useTopLoader();

  const push = (href: string, options?: NavigateOptions) => {
    loader.start();
    router.push(href, options);
  };

  const replace = (href: string, options?: NavigateOptions) => {
    loader.start();
    router.replace(href, options);
  };

  return {
    ...router,
    push,
    replace,
  };
}
