'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedProps {
  children: ReactNode;
}

export default function BlogAdminProtectedRoute({ children }: ProtectedProps) {
  const { user, loading, isAdmin, isBlogger } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (!isAdmin && !isBlogger))) {
      router.replace('/');
    }
  }, [user, loading, isAdmin, isBlogger, router]);

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isBlogger)) {
    return null;
  }

  return <>{children}</>;
}
