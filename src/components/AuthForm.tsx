'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User } from 'lucide-react';

interface AuthFormProps {
    mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name,
                        },
                    },
                });

                if (signUpError) throw signUpError;

                // Show success message
                alert('Check your email to confirm your account!');
                router.push('/login');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;

                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-6 p-8 rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl"
        >
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-zinc-400">
                    {mode === 'login'
                        ? 'Sign in to access your documents'
                        : 'Sign up to start chatting with PDFs'}
                </p>
            </div>

            <div className="space-y-4">
                {mode === 'signup' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <Input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                        />
                    </div>
                    {mode === 'signup' && (
                        <p className="text-xs text-zinc-500">Must be at least 6 characters</p>
                    )}
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                    {error}
                </motion.div>
            )}

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </span>
                ) : (
                    <span>{mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
                )}
            </Button>

            <div className="text-center text-sm text-zinc-400">
                {mode === 'login' ? (
                    <p>
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign up
                        </a>
                    </p>
                ) : (
                    <p>
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </a>
                    </p>
                )}
            </div>
        </motion.form>
    );
}
