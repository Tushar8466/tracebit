"use client";

import { motion } from "motion/react";

interface TextHoverEffectProps {
  text: string;
  className?: string;
}

export function TextHoverEffect({ text, className }: TextHoverEffectProps) {
  return (
    <div className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-block text-white hover:text-violet-400 cursor-default"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

