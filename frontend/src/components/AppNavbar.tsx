"use client";

import { FloatingDock } from "./ui/floating-docs";
import Image from "next/image";
import {
    IconHome,
    IconTerminal2,
    IconBrandGithub,
    IconBrandX,
    IconUserCircle,
    IconLayoutDashboard,
    IconUsers
} from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";

export function AppNavbar() {
    const { data: session } = useSession();

    const items = [
        {
            title: "Home",
            icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/",
        },
        {
            title: "Analyze",
            icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/analyze",
        },
        ...(session ? [{
            title: "Dashboard",
            icon: <IconLayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/dashboard",
        }] : []),
        {
            title: "Contributors",
            icon: <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/contributors",
        },
        {
            title: "Twitter",
            icon: <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "#",
        },
        {
            title: "GitHub",
            icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "#",
        },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-24">
            {/* Brand Logo */}
            <div className="absolute top-6 left-6 md:left-10 pointer-events-auto flex items-center gap-3">
                <div className="h-8 w-8 rounded overflow-hidden flex items-center justify-center shadow-md relative">
                    <Image
                        src="/tracebit.jpeg"
                        alt="Tracebit Logo"
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">
                    Tracebit
                </span>
            </div>

            {/* Centered Dock */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                <FloatingDock items={items} />
            </div>

            {/* Auth Button */}
            <div className="absolute top-6 right-6 md:right-10 pointer-events-auto flex items-center gap-4">
                {session ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            {session.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="rounded-full border border-neutral-200 dark:border-neutral-800"
                                />
                            ) : (
                                <IconUserCircle className="w-8 h-8 text-neutral-500" />
                            )}
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {session.user?.name}
                            </span>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <a
                        href="/signup"
                        className="px-5 py-2 text-sm font-bold rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-105 transition-transform shadow-md"
                    >
                        Sign In
                    </a>
                )}
            </div>
        </div>
    );
}