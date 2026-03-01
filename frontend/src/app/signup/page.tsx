"use client";

import { signIn } from "next-auth/react";
import { IconBrandGithub } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function SignUpPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            {/* Background gradients */}
            <div className="absolute inset-0 w-full h-full bg-white dark:bg-black z-0 pointer-events-none transition-colors duration-300" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-200/50 dark:bg-slate-900/50 rounded-full blur-[120px] z-0 pointer-events-none" />
            <BackgroundBeams />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex w-full max-w-md flex-col items-center justify-center p-8 sm:p-12 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl shadow-2xl"
            >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl overflow-hidden bg-slate-900 dark:bg-white shadow-md mb-8">
                    <Image
                        src="/tracebit.jpeg"
                        alt="Tracebit Logo"
                        fill
                        className="object-cover"
                    />
                </div>

                <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
                    Welcome to Tracebit
                </h1>
                <p className="text-center text-neutral-600 dark:text-neutral-400 mb-8 max-w-xs">
                    Sign in to analyze your repositories and detect AI contributions securely.
                </p>

                <button
                    onClick={() => signIn("github", { callbackUrl: "/" })}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-900 dark:bg-white px-8 py-3.5 text-sm font-semibold text-white dark:text-slate-900 shadow-md hover:bg-slate-800 dark:hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <IconBrandGithub className="h-5 w-5" />
                    Continue with GitHub
                </button>

                <p className="mt-8 text-xs text-center text-neutral-500 dark:text-neutral-500">
                    By clicking continue, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}
