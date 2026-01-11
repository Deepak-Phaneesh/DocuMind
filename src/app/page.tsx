'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { FileUpload } from '@/components/FileUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { LogoutButton } from '@/components/LogoutButton';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

export default function Home() {
    const [fileInfo, setFileInfo] = useState<{ id: string; name: string } | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);
            setLoading(false);
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                router.push('/login');
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabase]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 to-black">
                <div className="text-zinc-400">Loading...</div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-zinc-950 to-black text-white relative overflow-hidden">

            {/* User Info and Logout */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <User className="w-4 h-4" />
                    <span>{user?.email}</span>
                </div>
                <LogoutButton />
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-4xl space-y-8 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                        DocuMind
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Chat with your PDFs using AI
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!fileInfo ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <FileUpload onUploadSuccess={(id: string, name: string) => setFileInfo({ id, name })} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <div className="flex justify-between items-center mb-4 px-4">
                                <span className="text-sm text-zinc-400 flex items-center gap-2">
                                    📄 <span className="text-zinc-300 font-medium">{fileInfo.name}</span>
                                </span>
                                <button
                                    onClick={() => setFileInfo(null)}
                                    className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
                                >
                                    Upload another file
                                </button>
                            </div>
                            <ChatInterface />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </main>
    );
}
