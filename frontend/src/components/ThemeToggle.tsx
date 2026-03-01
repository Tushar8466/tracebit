"use client";

import * as React from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors hover:cursor-pointer"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <IconSun className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
            ) : (
                <IconMoon className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
            )}
        </button>
    );
}