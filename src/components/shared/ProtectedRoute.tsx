'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>(
    'loading'
  );

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace('/login');
      setStatus('unauth');
    } else {
      setStatus('auth');
    }
  }, [router]);

  if (status === 'loading') return null;
  if (status === 'unauth') return null;

  return <>{children}</>;
}
