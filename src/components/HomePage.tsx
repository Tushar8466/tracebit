"use client";

import { BoxesCore } from "./ui/background-boxes";
import { motion } from "motion/react";

function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black rounded-lg transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full bg-white dark:bg-black z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none transition-colors duration-300" />

      <div className="absolute inset-0 w-full h-full z-0">
        <BoxesCore />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center pointer-events-auto mt-20">
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Every commit leaves a trace
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-neutral-600 dark:text-neutral-200 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Tracebit detects AI-generated contributions
          across your GitHub repositories — silently,
          instantly, without changing how you work.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 relative z-50 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <button className="px-8 py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Get Started
          </button>
          <button className="px-8 py-3 rounded-full bg-transparent border border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-semibold hover:bg-neutral-900/10 dark:hover:bg-white/10 transition-colors">
            View Documentation
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;
