'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = getSession();
  const redirected = useRef(false);

  useEffect(() => {
    if (!session && !redirected.current) {
      redirected.current = true;
      router.replace('/login');
    }
  }, [router, session]);

  // No session — render nothing and let the redirect happen
  if (!session) return null;

  return <>{children}</>;
}
