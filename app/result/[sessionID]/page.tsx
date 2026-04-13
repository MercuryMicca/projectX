"use client";

import { useEffect, useMemo, useState } from "react";

type ResultPageProps = {
  params: Promise<{ sessionID: string }>;
};

type SessionData = {
  id: string;
  currentChapter: string;
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
};

type ArchetypeKey =
  | "calm_operator"
  | "precision_scientist"
  | "team_anchor"
  | "adaptive_problem_solver";

type ArchetypeMeta = {
  title: string;
  subtitle: string;
  keywords: string[];
  shareCaption: string;
  reflection: string;
  whyItMatters: string;
  closingLine: string;
  relatedAstronauts: {
    name: string;
    role: string;
    description: string;
  }[];
};

function getArchetypeKey(session: SessionData): ArchetypeKey {
  if (session.teamTrust >= 70 && session.stress <= 22) {
    return "team_anchor";
  }

  if (session.missionProgress >= 58 && session.stress <= 24) {
    return "calm_operator";
  }

  if (session.missionProgress >= 54 && session.teamTrust >= 62) {
    return "adaptive_problem_solver";
  }

  return "precision_scientist";
}

function getMissionScore(session: SessionData) {
  return Math.max(
    0,
    Math.min(
      100,
      session.missionProgress + session.teamTrust + session.energy - session.stress
    )
  );
}

function getStateSummary(session: SessionData) {
  return [
    {
      label: "Mission Progress",
      value: session.missionProgress,
    },
    {
      label: "Stress",
      value: session.stress,
    },
    {
      label: "Team Trust",
      value: session.teamTrust,
    },
    {
      label: "Energy",
      value: session.energy,
    },
  ];
}

const ARCHETYPES: Record<ArchetypeKey, ArchetypeMeta> = {
  calm_operator: {
    title: "Calm Operator",
    subtitle: "You keep systems steady when the day gets tight.",
    keywords: ["steady", "disciplined", "dependable"],
    shareCaption:
      "I got Calm Operator in ProjectX: A Day as an Astronaut — apparently my orbit style is keeping things steady, procedural, and quietly alive.",
    reflection:
      "You moved through the station with steadiness, restraint, and respect for procedure. Nothing about your day suggested a need for drama. You kept things stable, made room for process, and treated small decisions like they mattered — because in orbit, they do.",
    whyItMatters:
      "What you experienced reflects a side of astronaut life most people do not imagine first: not launch, not spectacle, but routine, judgment, careful timing, and the discipline to keep a fragile environment trustworthy.",
    closingLine:
      "You did not need heroics to make the day meaningful. In orbit, steadiness is its own kind of strength.",
    relatedAstronauts: [
      {
        name: "Peggy Whitson",
        role: "Long-duration ISS commander",
        description:
          "Her long stays aboard the ISS reflect the kind of steady, procedural, long-form responsibility that keeps missions reliable over time.",
      },
      {
        name: "Chris Hadfield",
        role: "Former ISS commander",
        description:
          "He helped many people understand that life in orbit is not only extraordinary — it is also practical, disciplined, and deeply human.",
      },
    ],
  },
  precision_scientist: {
    title: "Precision Scientist",
    subtitle: "You protect what the data is allowed to mean.",
    keywords: ["exact", "observant", "careful"],
    shareCaption:
      "I got Precision Scientist in ProjectX: A Day as an Astronaut — less drama, more protecting the integrity of the data.",
    reflection:
      "You treated process, readings, and procedural integrity as things worth protecting. Your choices suggest someone who is less interested in looking impressive than in making sure the result can still be trusted when the moment has passed.",
    whyItMatters:
      "Real astronaut work includes science that depends on patient handling, careful logging, and the willingness to respect small deviations instead of smoothing them away.",
    closingLine:
      "A perfect result is not always possible. An honest result still is.",
    relatedAstronauts: [
      {
        name: "Samantha Cristoforetti",
        role: "ESA astronaut and ISS crew member",
        description:
          "Her work aboard the ISS reflects how science, routine, and disciplined execution coexist inside station life.",
      },
      {
        name: "Koichi Wakata",
        role: "JAXA astronaut and former ISS commander",
        description:
          "His missions reflect the mix of operational discipline and scientific work that defines long-duration station life.",
      },
    ],
  },
  team_anchor: {
    title: "Team Anchor",
    subtitle: "You keep missions coherent by staying aligned with people.",
    keywords: ["coordinated", "trusted", "grounded"],
    shareCaption:
      "I got Team Anchor in ProjectX: A Day as an Astronaut — apparently my astronaut style is keeping people and systems aligned.",
    reflection:
      "You seemed to understand that trust is not a soft quality in orbit — it is operational. Your day suggests someone who keeps work coherent by staying aligned with teammates, ground support, and the larger rhythm of the mission.",
    whyItMatters:
      "Astronaut life is not a solo performance. Crew time is scheduled, supported, and continuously shaped by coordination with people on the station and on the ground.",
    closingLine:
      "No mission this complex is carried by one brilliant person alone.",
    relatedAstronauts: [
      {
        name: "Chris Hadfield",
        role: "Former ISS commander",
        description:
          "His public legacy works partly because he made visible how spaceflight depends on communication, clarity, and a shared mission rhythm.",
      },
      {
        name: "Sunita Williams",
        role: "NASA astronaut",
        description:
          "Her long-duration work reflects the kind of sustained professionalism and team coordination that station life requires.",
      },
    ],
  },
  adaptive_problem_solver: {
    title: "Adaptive Problem Solver",
    subtitle: "You meet uncertainty without stepping away from it.",
    keywords: ["flexible", "composed", "resourceful"],
    shareCaption:
      "I got Adaptive Problem Solver in ProjectX: A Day as an Astronaut — apparently my orbit style is staying calm when things stop being predictable.",
    reflection:
      "Your day suggests a mind that does not freeze when conditions shift. You seem willing to absorb new information, make room for uncertainty, and keep moving without losing your sense of judgment. Space rewards that kind of flexibility.",
    whyItMatters:
      "A large part of station work is not dramatic crisis response. It is deciding what to do when something is slightly off, imperfect, delayed, or not as clean as you hoped it would be.",
    closingLine:
      "You do not need the day to behave itself. You need yourself to.",
    relatedAstronauts: [
      {
        name: "Sunita Williams",
        role: "NASA astronaut",
        description:
          "Her long missions reflect physical endurance, adaptability, and the ability to stay effective even when routine and pressure build over time.",
      },
      {
        name: "Peggy Whitson",
        role: "Long-duration ISS commander",
        description:
          "Her experience reflects the calm judgment needed to keep moving through long stretches of technical work without losing precision.",
      },
    ],
  },
};

function getRealitySections() {
  return [
    {
      title: "Daily Life Under Constraint",
      body:
        "The morning routine you experienced — hygiene, meals, object management, and keeping yourself physically and mentally organized — reflects a real part of station life. In orbit, even basic acts require intention.",
    },
    {
      title: "Operational Work, Not Tourism",
      body:
        "A large part of astronaut life is task priority, systems care, coordination with ground, communication with crewmates, and following procedures well enough that the station remains trustworthy.",
    },
    {
      title: "Science as Careful Labor",
      body:
        "Experiments aboard the ISS are not abstract. They rely on samples, timing, logging, environmental control, and the discipline to treat small deviations with respect instead of ego.",
    },
  ];
}

function getRealityFacts() {
  return [
    "Astronaut days aboard the ISS are highly scheduled, rather than shaped by the station’s repeated sunrises and sunsets.",
    "Exercise is part of the workday because the body has to be actively maintained in microgravity.",
    "Station life combines maintenance, science, communication, housekeeping, and repeated small judgments — not just exceptional moments.",
  ];
}

export default function ResultPage({ params }: ResultPageProps) {
  const [sessionID, setSessionID] = useState("");
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true);
        setError("");

        const resolvedParams = await params;
        const id = resolvedParams.sessionID;
        setSessionID(id);

        const response = await fetch(`/api/session/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load result");
        }

        setSession(data.session);
      } catch (err) {
        console.error(err);
        setError("Failed to load result.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [params]);

  const archetypeKey = useMemo(
    () => (session ? getArchetypeKey(session) : "calm_operator"),
    [session]
  );

  const archetype = useMemo(() => ARCHETYPES[archetypeKey], [archetypeKey]);

  const missionScore = useMemo(
    () => (session ? getMissionScore(session) : 0),
    [session]
  );

  const stateSummary = useMemo(
    () => (session ? getStateSummary(session) : []),
    [session]
  );

  async function handleCopyCaption() {
    try {
      await navigator.clipboard.writeText(archetype.shareCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/70">Loading mission reflection...</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-400">{error || "Result not found."}</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center text-white px-6 py-16"
      style={{
        backgroundImage: "url(/images/astronaut/earth-window.jpg)",
      }}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px]" />

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Share Layer */}
        <section className="rounded-3xl border border-white/10 bg-black/45 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
            Mission Reflection
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {archetype.title}
          </h1>

          <p className="text-white/75 text-lg mb-6 leading-8">
            {archetype.subtitle}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {archetype.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
            <p className="text-sm text-white/50 mb-2">Your style in orbit</p>
            <p className="text-white/90 leading-8">{archetype.reflection}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/50 mb-2">Mission Score</p>
              <p className="text-3xl font-semibold">{missionScore}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/50 mb-2">Share Caption</p>
              <p className="text-white/85 leading-7">{archetype.shareCaption}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopyCaption}
              className="rounded-xl bg-white text-black px-5 py-3 font-medium hover:opacity-90"
            >
              {copied ? "Copied" : "Copy Share Caption"}
            </button>

            <a
              href="/"
              className="rounded-xl bg-white/10 text-white px-5 py-3 font-medium hover:bg-white/15"
            >
              Replay
            </a>
          </div>
        </section>

        {/* Reality Layer */}
        <section className="rounded-3xl border border-white/10 bg-black/45 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
            What your day actually contained
          </p>

          <p className="text-white/85 leading-8 mb-6">
            {archetype.whyItMatters}
          </p>

          <div className="grid gap-4 mb-8">
            {getRealitySections().map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm text-white/50 mb-2">{section.title}</p>
                <p className="text-white/90 leading-7">{section.body}</p>
              </div>
            ))}
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
            Real astronauts who lived this reality
          </p>

          <div className="grid gap-4 mb-8">
            {archetype.relatedAstronauts.map((astronaut) => (
              <div
                key={astronaut.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-lg font-semibold mb-1">{astronaut.name}</p>
                <p className="text-sm text-white/50 mb-3">{astronaut.role}</p>
                <p className="text-white/90 leading-7">{astronaut.description}</p>
              </div>
            ))}
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
            Reality behind the experience
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
            <ul className="space-y-3 text-white/90 leading-7">
              {getRealityFacts().map((fact) => (
                <li key={fact}>• {fact}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50 mb-2">Closing note</p>
            <p className="text-white/90 leading-8">{archetype.closingLine}</p>
          </div>
        </section>

        {/* State Summary */}
        <section className="rounded-3xl border border-white/10 bg-black/45 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
            State Summary
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stateSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm text-white/50 mb-2">{item.label}</p>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}