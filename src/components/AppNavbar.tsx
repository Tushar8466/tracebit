"use client";

import { FloatingDock } from "./ui/floating-docs";
import {
    IconHome,
    IconTerminal2,
    IconBrandGithub,
    IconBrandX,
} from "@tabler/icons-react";

export function AppNavbar() {
    const items = [
        {
            title: "Home",
            icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/",
        },
        {
            title: "Products",
            icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "#",
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
                <div className="h-8 w-8 rounded bg-slate-900 dark:bg-white flex items-center justify-center shadow-md">
                    <span className="text-white dark:text-slate-900 font-bold text-lg leading-none">T</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">
                    Tracebit
                </span>
            </div>

            {/* Centered Dock */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                <FloatingDock items={items} />
            </div>
        </div>
    );
}
