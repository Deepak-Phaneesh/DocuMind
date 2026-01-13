import { AuthForm } from '@/components/AuthForm';

// Force dynamic rendering - prevent static generation at build time
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-950 to-black text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 space-y-8">
                <div className="text-center">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                        DocuMind
                    </h1>
                </div>
                <AuthForm mode="signup" />
            </div>
        </main>
    );
}
