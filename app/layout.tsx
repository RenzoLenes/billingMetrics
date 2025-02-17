// app/layout.tsx
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Sidebar } from '@/components/sidebar';
import { FilterProvider } from '@/contexts/filter-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (!session && pathname !== '/auth/login') {
        router.replace('/auth/login');
      }
      
      if (session && pathname === '/auth/login') {
        router.replace('/dashboard');
      }

      if(session && pathname === '/') {
        router.replace('/dashboard');
      }
    };

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription?.unsubscribe();
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <FilterProvider>
            <div className="flex h-screen">
              {isAuthenticated && <Sidebar />}
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </FilterProvider>
        </Providers>
      </body>
    </html>
  );
}