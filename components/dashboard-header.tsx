'use client';

import { Menu, LogOut } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    return (
        <div className='p-5 shadow-sm border-b bg-background'>
            {/* Layout para desktop - justify-end para botón de cerrar sesión a la derecha */}
            <div className="hidden md:flex justify-end">
                <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                </Button>
            </div>

            {/* Layout para móvil - elementos distribuidos uniformemente */}
            <div className="md:hidden flex justify-between items-center">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-accent rounded-md transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <h2 className="text-lg font-semibold">Sistema</h2>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-500 hover:text-white transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export default DashboardHeader; 