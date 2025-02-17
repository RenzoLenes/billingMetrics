'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  expanded?: boolean;
}

export function ThemeToggle({ expanded = true }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={expanded ? "default" : "icon"}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-full justify-center"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 -translate-x-12" />
      {expanded && <span className="ml-2">Cambiar tema</span>}
      
    </Button>
  );
}