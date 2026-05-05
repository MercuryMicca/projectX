"use client";

import { motion } from "framer-motion";

type ChapterHeaderProps = {
  eyebrow: string;
  title: string;
  objective: string;
};

export default function ChapterHeader({
  eyebrow,
  title,
  objective,
}: ChapterHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] uppercase tracking-[0.34em] text-white/55 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8FD3FF]" />
        {eyebrow}
      </div>

      <div className="max-w-3xl space-y-4">
        <h1 className="font-serif text-5xl leading-none tracking-[-0.04em] text-[#F4F1EA] drop-shadow-2xl md:text-7xl">
          {title}
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[rgba(244,241,234,0.68)] md:text-xl">
          {objective}
        </p>
      </div>
    </motion.header>
  );
}
