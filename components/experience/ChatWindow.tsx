"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import TypewriterText from "./TypewriterText";

type NarrativeTurn = {
  id: string;
  role: "system" | "user" | "engine";
  content: string;
  intent?: string;
};

type ChatWindowProps = {
  turns: NarrativeTurn[];
  isThinking: boolean;
};

export default function ChatWindow({ turns, isThinking }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const latestTurnId = turns.at(-1)?.id;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [turns, isThinking]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[2rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(8,10,18,0.58)] shadow-2xl shadow-black/40 backdrop-blur-xl"
    >
      <div className="border-b border-white/8 px-5 py-4 md:px-7">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">
          Story Feed
        </p>
      </div>

      <div
        ref={containerRef}
        className="max-h-[44vh] min-h-[26vh] space-y-4 overflow-y-auto px-5 py-5 md:px-7 md:py-6"
      >
        <AnimatePresence initial={false}>
          {turns.map((turn) => (
            <motion.div
              key={turn.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className={
                turn.role === "user"
                  ? "ml-auto max-w-[85%] rounded-[1.5rem] border border-white/8 bg-[#F4F1EA] px-5 py-4 text-[#02040A]"
                  : turn.role === "engine"
                  ? "max-w-[92%] rounded-[1.5rem] border border-[#8FD3FF]/15 bg-[#8FD3FF]/[0.06] px-5 py-5 text-[#F4F1EA]"
                  : "max-w-[92%] rounded-[1.5rem] border border-white/10 bg-white/[0.055] px-5 py-4 text-[rgba(244,241,234,0.88)]"
              }
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] opacity-55">
                {turn.role === "user"
                  ? "You"
                  : turn.role === "engine"
                  ? "Narrative Guide"
                  : "Current Situation"}
              </p>
              {turn.role !== "user" && turn.id === latestTurnId ? (
                <TypewriterText
                  key={turn.id}
                  className="text-[15px] leading-7 md:text-[15px] md:leading-7"
                  speed={22}
                  pauseBetweenLines={900}
                  lines={turn.content.split("\n")}
                />
              ) : (
                <p className="whitespace-pre-wrap text-[15px] leading-7 md:text-[15px] md:leading-7">
                  {turn.content}
                </p>
              )}
            </motion.div>
          ))}

          {isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="max-w-[78%] rounded-[1.5rem] border border-white/10 bg-white/[0.055] px-5 py-4 text-[rgba(244,241,234,0.78)]"
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] opacity-55">
                Narrative Guide
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white/55" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-white/38 [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-white/25 [animation-delay:240ms]" />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
