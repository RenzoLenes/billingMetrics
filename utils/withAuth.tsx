// utils/withAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export const withAuth = (Component: React.ComponentType) => {
  return function ProtectedRoute() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/auth/login');
        }
        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <div>Cargando...</div>; // O un spinner
    }

    return <Component />;
  };
  
};