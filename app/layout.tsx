// app/layout.tsx
'use client'; // Añade esto si Providers usa hooks de React

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Sidebar } from '@/components/sidebar';
import { FilterProvider } from '@/contexts/filter-context'; // Importa FilterProvider

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <FilterProvider> {/* Envuelve todo en FilterProvider */}
            <div className="flex h-screen">
              <Sidebar />
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