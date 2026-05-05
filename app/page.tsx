"use client";

import { useRouter } from "next/navigation";

const roleOptions = [
  {
    icon: "🚀",
    title: "Live a day as an Astronaut",
    description:
      "Begin with one orbital morning shaped by routine, observation, and calm discipline.",
    active: true,
  },
  {
    icon: "🎭",
    title: "Step into the life of an Actor",
    active: false,
  },
  {
    icon: "🏃",
    title: "Train like a professional Athlete",
    active: false,
  },
  {
    icon: "🧠",
    title: "Operate as a Surgeon",
    active: false,
  },
  {
    icon: "✈️",
    title: "Fly as a Pilot",
    active: false,
  },
  {
    icon: "🌊",
    title: "Dive as a Deep Sea Explorer",
    active: false,
  },
] as const;

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
          <div className="max-w-4xl">
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

            <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {roleOptions.map((role) =>
                role.active ? (
                  <button
                    key={role.title}
                    onClick={handleStart}
                    className="group rounded-[26px] border border-white/16 bg-white/10 p-5 text-left shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/14"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl">{role.icon}</p>
                        <p className="mt-4 text-lg font-medium text-white">
                          {role.title}
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/88">
                        Active
                      </span>
                    </div>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-white/62">
                      {role.description}
                    </p>
                    <div className="mt-5 flex items-center gap-3 text-sm text-white/86">
                      <span>Enter Orbit</span>
                      <span className="transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </button>
                ) : (
                  <div
                    key={role.title}
                    className="rounded-[26px] border border-white/8 bg-white/[0.045] p-5 opacity-55 backdrop-blur-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl grayscale">{role.icon}</p>
                        <p className="mt-4 text-lg font-medium text-white/78">
                          {role.title}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/56">
                        Coming soon
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
