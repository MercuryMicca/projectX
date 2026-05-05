"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

export default function IntroPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleStartClick = () => {
    setErrorMessage("");
    setIsOnboardingOpen(true);
  };

  const handleEnter = async () => {
    if (isEntering) return;
    if (!playerName.trim()) return;

    setIsEntering(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/experience/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: "astronaut_day_v1",
          participantName: playerName.trim(),
        }),
      });

      const rawText = await res.text();

      let data:
        | {
            sessionId?: string;
            currentChapter?: string;
            openingMessage?: string;
            error?: string;
          }
        | undefined;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("API did not return valid JSON");
      }

      if (!res.ok || !data?.sessionId) {
        throw new Error(data?.error || "Failed to create session");
      }

      window.location.assign(`/play/${data.sessionId}`);
    } catch (error) {
      console.error("Failed to enter simulation:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to start. Please try again."
      );
      setIsEntering(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/intro-hero.jpg')",
        }}
        initial={{ scale: 1.06, opacity: 0.82 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/45" />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-[-8%] top-[12%] h-[26rem] w-[26rem] rounded-full bg-blue-500/10 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -12, 0], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[12%] h-[20rem] w-[20rem] rounded-full bg-cyan-300/10 blur-3xl"
          animate={{ x: [0, -16, 0], y: [0, 14, 0], opacity: [0.14, 0.28, 0.14] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[6%] top-[8%] h-[18rem] w-[18rem] rounded-full bg-white/6 blur-3xl"
          animate={{ x: [0, 12, 0], y: [0, -8, 0], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)
            `,
            backgroundSize: "90px 90px",
          }}
        />
      </div>

      {/* Scan line */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[28%] h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent"
        initial={{ opacity: 0, x: "-12%" }}
        animate={{ opacity: [0, 0.7, 0], x: ["-12%", "8%", "18%"] }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1.5,
        }}
      />

      {/* Content */}
      <section className="relative z-10 flex min-h-screen items-center px-6 py-10 md:px-12 lg:px-20">
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
            <div className="h-px w-10 bg-white/40" />
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/62">
              ProjectX · Experience 01
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/6 px-3 py-1.5 backdrop-blur-md"
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]"
              animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-xs uppercase tracking-[0.18em] text-white/75">
              Simulation Ready
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl"
          >
            A Day as an Astronaut
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-lg leading-8 text-white/82 md:text-xl"
          >
            When gravity disappears,
            <br />
            even the smallest things change.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={handleStartClick}
              disabled={isEntering}
              className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-80"
            >
              Enter Orbit
            </button>
          </motion.div>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-300/85">{errorMessage}</p>
          )}
        </motion.div>
      </section>

      <AnimatePresence>
        {isOnboardingOpen ? (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/64 px-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-8"
              initial={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 space-y-4">
                <motion.p
                  className="text-[11px] uppercase tracking-[0.34em] text-white/44"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.45 }}
                >
                  Onboarding
                </motion.p>

                <motion.div
                  className="space-y-3 text-white"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  <motion.h2
                    variants={fadeUp}
                    className="text-3xl font-semibold tracking-tight md:text-4xl"
                  >
                    You are stepping into a life.
                  </motion.h2>

                  <motion.p
                    variants={fadeUp}
                    className="text-lg leading-8 text-white/70 md:text-xl"
                  >
                    Not to win.
                    <br />
                    But to understand.
                  </motion.p>
                </motion.div>
              </div>

              <motion.form
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleEnter();
                }}
                className="space-y-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45 }}
              >
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-white/46">
                    Your Name
                  </span>
                  <input
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                    maxLength={40}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/45 focus:bg-white/[0.08]"
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEntering) return;
                      setIsOnboardingOpen(false);
                      setErrorMessage("");
                    }}
                    className="text-sm text-white/44 transition hover:text-white/72"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isEntering || !playerName.trim()}
                    className="inline-flex min-w-[168px] items-center justify-center rounded-full border border-white/14 bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isEntering ? "Entering..." : "→ Continue"}
                  </button>
                </div>

                {errorMessage ? (
                  <p className="text-sm text-red-300/85">{errorMessage}</p>
                ) : null}
              </motion.form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </main>
  );
}
