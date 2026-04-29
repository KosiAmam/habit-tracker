'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(getSession() ? '/dashboard' : '/login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
