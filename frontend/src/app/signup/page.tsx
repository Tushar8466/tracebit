"use client";

import { signIn } from "next-auth/react";
import { 
  IconBrandGithub, 
  IconGitBranch, 
  IconRobot, 
  IconShield,
  IconSparkles,
  IconChartBar
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import { BackgroundBeams } from "@/components/ui/background-beams";

const features = [
  {
    icon: IconGitBranch,
    title: "Repository Analysis",
    description: "Deep insights into your codebase contributors and commit patterns"
  },
  {
    icon: IconRobot,
    title: "AI Detection",
    description: "Identify AI-generated contributions with advanced pattern recognition"
  },
  {
    icon: IconShield,
    title: "Secure & Private",
    description: "Your code never leaves your browser. GitHub OAuth only."
  },
  {
    icon: IconChartBar,
    title: "Visual Reports",
    description: "Beautiful charts and statistics for your team's contributions"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <BackgroundBeams />
      
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-black/50">
            {/* Card glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-violet-500/30 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative p-8 sm:p-10">
              {/* Logo */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-xl"
              >
                <Image
                  src="/tracebit.jpeg"
                  alt="Tracebit Logo"
                  width={48}
                  height={48}
                  className="rounded-xl object-cover"
                />
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                    Welcome to Tracebit
                  </h1>
                  <IconSparkles className="w-5 h-5 text-violet-400" />
                </div>
                <p className="text-neutral-400 text-sm sm:text-base">
                  Analyze repositories, track contributions, and detect AI-generated code with precision.
                </p>
              </motion.div>

              {/* GitHub Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="group relative w-full flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg hover:bg-violet-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <IconBrandGithub className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Continue with GitHub
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {/* Terms */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-xs text-center text-neutral-500"
              >
                By continuing, you agree to our{" "}
                <a href="#" className="text-neutral-400 hover:text-white underline-offset-2 hover:underline transition-colors">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-neutral-400 hover:text-white underline-offset-2 hover:underline transition-colors">Privacy Policy</a>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
