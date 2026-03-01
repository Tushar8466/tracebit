"use client";

import { BoxesCore } from "./ui/background-boxes";
import { EvervaultCard } from "./ui/evervault-card";
import { motion, AnimatePresence } from "motion/react";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";
import React from "react";

import { Search, Brain, BarChart, User, Settings, Lock } from "lucide-react";

const features = [
  {
    title: "AI Likelihood Score",
    description: "Scan any GitHub PR or commit URL in seconds.",
    icon: <Search className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" strokeWidth={1.5} />,
  },
  {
    title: "Style Drift Indicator",
    description: "Powered by CodeBERT — trained specifically on code, not text.",
    icon: <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500" strokeWidth={1.5} />,
  },
  {
    title: "Post-Merge Stability",
    description: "Get a 0–100% AI probability score with an explainability report.",
    icon: <BarChart className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" strokeWidth={1.5} />,
  },
  {
    title: "Ownership Confidence",
    description: "Detects deviations from a contributor's historical coding style.",
    icon: <User className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" strokeWidth={1.5} />,
  },
  {
    title: "Repository AI Influence Trend",
    description: "Drop one config file into any repo. Scans run automatically.",
    icon: <Settings className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500" strokeWidth={1.5} />,
  },
  {
    title: "Privacy First",
    description: "Code is never stored. Scans are ephemeral. Always.",
    icon: <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-500" strokeWidth={1.5} />,
  },
];

function HomePage() {
  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* ── Hero Section ── */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
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
            Tracebit detects AI-generated contributions across your GitHub
            repositories — silently, instantly, without changing how you work.
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

      {/* ── Features Section ── */}
      <div className="relative z-20 w-full mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to detect AI code
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Powerful tools built for modern engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="border border-black/20 dark:border-white/20 flex flex-col items-start p-4 relative h-[30rem] bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl group"
            >
              {/* Corner icons */}
              <Icon className="absolute h-6 w-6 -top-3 -left-3 text-slate-900 dark:text-white" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-slate-900 dark:text-white" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 text-slate-900 dark:text-white" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-slate-900 dark:text-white" />

              {/* Evervault interactive card */}
              <div className="w-full flex-1 flex items-center justify-center">
                <EvervaultCard text={feature.icon} />
              </div>

              {/* Text */}
              <div className="w-full mt-2 flex flex-col gap-3 pb-10">
                <h3 className="text-slate-900 dark:text-white text-xl font-bold">
                  {feature.title}
                </h3>
                <p className="text-sm font-light border border-black/20 dark:border-white/20 rounded-full px-4 py-2 text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Who Is It For Section ── */}
      <div className="relative z-20 w-full mx-auto px-4 py-24 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Who is Tracebit for?
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Designed for teams that value transparency and code quality.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-black w-full gap-4 mx-auto max-w-7xl">
          <Card
            title="Engineering Leaders"
            description="Ensure code quality and understand where AI is assisting your team without sacrificing velocity."
            icon={<AceternityIcon />}
          >
            <CanvasRevealEffect
              animationSpeed={5.1}
              containerClassName="bg-emerald-900"
            />
          </Card>
          <Card
            title="Open Source Maintainers"
            description="Protect your open source repositories by instantly verifying if incoming PRs are AI-generated."
            icon={<AceternityIcon />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [236, 72, 153],
                [232, 121, 249],
              ]}
              dotSize={2}
            />
            {/* Radial gradient for the cute hair */}
            <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
          </Card>
          <Card
            title="Recruiters"
            description="Audit repositories for potential vulnerabilities introduced through automated coding tools."
            icon={<AceternityIcon />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-sky-600"
              colors={[[125, 211, 252]]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

const Card = ({
  title,
  icon,
  children,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  description: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem]"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 flex flex-col items-center justify-center px-4 w-full h-full">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {icon}
        </div>

        {/* Title revealed on hover */}
        <h2 className="dark:text-white text-xl md:text-2xl font-bold text-black opacity-0 group-hover/canvas-card:opacity-100 z-10 transition duration-200 text-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover/canvas-card:-translate-y-6">
          {title}
        </h2>
      </div>
    </div>
  );
};

const AceternityIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white"
    >
      <path
        d="M20 15L45 32.5L20 50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

export default HomePage;