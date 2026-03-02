"use client";

import { cn } from "@/lib/utils";

interface BackgroundRippleEffectProps {
  className?: string;
  children?: React.ReactNode;
}

export function BackgroundRippleEffect({
  className,
  children,
}: BackgroundRippleEffectProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-black",
        className,
      )}
    >
      {/* center glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* radial streaks */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[140%] w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-0 bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent animate-[spin_14s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[140%] w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-40 bg-gradient-to-b from-transparent via-violet-400/40 to-transparent animate-[spin_18s_linear_infinite_reverse]" />
        <div className="absolute left-1/2 top-1/2 h-[140%] w-[2px] -translate-x-1/2 -translate-y-1/2 -rotate-35 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent animate-[spin_22s_linear_infinite]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

