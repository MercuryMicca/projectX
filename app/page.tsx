"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function handleStart() {
    router.push("/intro");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background base */}
      <div className="absolute inset-0 bg-black" />

      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(70,110,255,0.14),transparent_38%)]" />

      {/* Very subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)]" />

      {/* Sparse stars */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-[12%] top-[18%] h-[2px] w-[2px] rounded-full bg-white/70" />
        <div className="absolute left-[22%] top-[28%] h-[1px] w-[1px] rounded-full bg-white/60" />
        <div className="absolute left-[36%] top-[14%] h-[2px] w-[2px] rounded-full bg-white/60" />
        <div className="absolute left-[48%] top-[22%] h-[1px] w-[1px] rounded-full bg-white/50" />
        <div className="absolute left-[62%] top-[12%] h-[2px] w-[2px] rounded-full bg-white/70" />
        <div className="absolute left-[74%] top-[26%] h-[1px] w-[1px] rounded-full bg-white/60" />
        <div className="absolute left-[82%] top-[16%] h-[2px] w-[2px] rounded-full bg-white/50" />
        <div className="absolute left-[18%] top-[64%] h-[1px] w-[1px] rounded-full bg-white/50" />
        <div className="absolute left-[29%] top-[72%] h-[2px] w-[2px] rounded-full bg-white/60" />
        <div className="absolute left-[57%] top-[70%] h-[1px] w-[1px] rounded-full bg-white/50" />
        <div className="absolute left-[78%] top-[66%] h-[2px] w-[2px] rounded-full bg-white/60" />
        <div className="absolute left-[88%] top-[78%] h-[1px] w-[1px] rounded-full bg-white/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center px-8 md:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/40">
              Immersive Life Experience
            </p>

            <h1
              className="
                text-5xl font-semibold tracking-[0.18em] text-white
                drop-shadow-[0_0_18px_rgba(180,200,255,0.10)]
                md:text-7xl
              "
            >
              PROJECT X
            </h1>

            <div className="mt-4 h-px w-24 bg-white/15" />

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72 md:text-xl">
              Step into a life you’ve never lived.
            </p>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/42 md:text-base">
              Begin with a day in orbit. Move through routine, systems, science,
              and the quiet discipline of keeping a fragile world alive.
            </p>

            <div className="mt-10">
              <button
                onClick={handleStart}
                className="
                  rounded-full border border-white/12 bg-white px-7 py-3
                  text-sm font-medium tracking-[0.08em] text-black
                  transition hover:scale-[1.01] hover:opacity-92
                "
              >
                Enter Orbit
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}