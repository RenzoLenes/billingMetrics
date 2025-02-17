'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { BarChart3, FileText, Home, Users, Settings, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

const menuItems = [
  { icon: Home, label: 'Inicio', href: '/dashboard' },
  { icon: FileText, label: 'Facturas', href: '/facturas' },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login'); // Redirige al login después de cerrar sesión
  };

  return (
    <aside className={cn(
      "h-screen sticky top-0 bg-background border-r transition-all duration-300",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-3 border-b">
          {expanded && (
            <h2 className="text-lg font-semibold">Sistema</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {expanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Botón de Cerrar Sesión */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-500 hover:text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {expanded && <span>Cerrar Sesión</span>}
          </Button>
        </div>

        <div className="border-t p-3">
          <ThemeToggle expanded={expanded} />
        </div>
      </div>
    </aside>
  );
}
