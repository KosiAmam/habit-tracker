'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import SplashScreen from '@/components/shared/SplashScreen';

export default function RootPage() {
  const router = useRouter();

  const session = getSession();

  useEffect(() => {
    router.replace(session ? '/dashboard' : '/login');
  }, []);

  return <SplashScreen />;
}