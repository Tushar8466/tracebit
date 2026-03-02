"use client";

import { usePathname } from "next/navigation";
import { AppNavbar } from "./AppNavbar";
import { ThemeToggle } from "./ThemeToggle";

interface AppShellProps {
  children: React.ReactNode;
}

// Central place to control when global chrome (navbar, auth button, logo, etc.)
// is visible. We hide it on certain focused views like the AI analysis report.
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Hide navbar + sign-in on per-user analysis report pages, e.g. /analyze/tushar8466
  const hideChrome = pathname?.startsWith("/analyze/") ?? false;

  return (
    <>
      {!hideChrome && (
        <>
          <AppNavbar />
          <ThemeToggle />
        </>
      )}
      {children}
    </>
  );
}

