"use client";

import { motion } from "framer-motion";
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
  const [isEntering, setIsEntering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEnter = async () => {
    if (isEntering) return;

    setIsEntering(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/session", {
        method: "POST",
      });

      const rawText = await res.text();

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("API did not return valid JSON");
      }

      if (!res.ok || !data?.success || !data?.sessionId) {
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
            Not just to learn how astronauts live — but to step into a world
            where even the smallest routine changes when gravity disappears.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 max-w-xl space-y-4 text-sm leading-7 text-white/66 md:text-[15px]"
          >
            <p>
              On Earth, every action ends where you leave it. In orbit, nothing does.
            </p>
            <p>
              This experience follows one orbital morning through tiny choices,
              changing constraints, and the quiet logic of life aboard a space station.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <InfoCard label="Format" value="Immersive AI simulation" />
            <InfoCard label="Duration" value="One orbital morning" />
            <InfoCard label="Focus" value="Routine, adaptation, perspective" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={handleEnter}
              disabled={isEntering}
              className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isEntering ? "Entering..." : "Enter Simulation"}
            </button>

            <p className="text-sm text-white/50">
              Step into another life, one decision at a time.
            </p>
          </motion.div>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-300/85">{errorMessage}</p>
          )}
        </motion.div>
      </section>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/90">{value}</p>
    </div>
  );
}