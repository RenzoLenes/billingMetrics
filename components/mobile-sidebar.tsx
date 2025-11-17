'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { FileText, Home, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const menuItems = [
  { icon: Home, label: 'Inicio', href: '/dashboard' },
  { icon: FileText, label: 'Facturas', href: '/facturas' },
];

interface MobileSidebarProps {
  children: React.ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    setOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header con botón hamburguesa */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <h1 className="text-lg font-semibold">BillingMetrics</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center px-3 border-b">
                <h2 className="text-lg font-semibold">Sistema</h2>
              </div>

              <nav className="flex-1 space-y-2 p-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                        pathname === item.href && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t p-3">
                <Button
                  variant="ghost"
                  className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-500 hover:text-white transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>

              <div className="border-t p-3">
                <ThemeToggle expanded={true} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}