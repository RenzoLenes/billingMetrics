// app/layout.tsx
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Sidebar } from '@/components/sidebar';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { FilterProvider } from '@/contexts/filter-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const inter = Inter({ subsets: ['latin'] });

function AppContent({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isAuthPage = pathname?.startsWith('/auth');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const content = (
    <FilterProvider>
      <div className="flex h-screen overflow-hidden">
        {session && !isAuthPage && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </FilterProvider>
  );

  // On mobile, wrap with MobileSidebar for authenticated users
  if (session && !isAuthPage && isMobile) {
    return (
      <FilterProvider>
        <MobileSidebar>
          {children}
        </MobileSidebar>
      </FilterProvider>
    );
  }

  return content;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <AppContent>
              {children}
            </AppContent>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}