'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Button } from './ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </>
            )}
        </Button>
    );
}
