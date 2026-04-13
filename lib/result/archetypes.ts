export type SessionData = {
  id: string;
  currentChapter: string;
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
};

export type ArchetypeKey =
  | "calm_operator"
  | "precision_scientist"
  | "team_anchor"
  | "adaptive_problem_solver";

export type ArchetypeMeta = {
  title: string;
  subtitle: string;
  keywords: string[];
  shareCaption: string;
  quote: string;
};

export function getArchetypeKey(session: SessionData): ArchetypeKey {
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

export function getMissionScore(session: SessionData) {
  return Math.max(
    0,
    Math.min(
      100,
      session.missionProgress + session.teamTrust + session.energy - session.stress
    )
  );
}

export const ARCHETYPES: Record<ArchetypeKey, ArchetypeMeta> = {
  calm_operator: {
    title: "Calm Operator",
    subtitle: "You keep systems steady when the day gets tight.",
    keywords: ["steady", "disciplined", "dependable"],
    shareCaption:
      "I got Calm Operator in ProjectX: A Day as an Astronaut — apparently my orbit style is keeping things steady, procedural, and quietly alive.",
    quote:
      "You don't need heroics. You need things to stay where they should, behave as they should, and not suddenly invent new problems.",
  },
  precision_scientist: {
    title: "Precision Scientist",
    subtitle: "You protect what the data is allowed to mean.",
    keywords: ["exact", "observant", "careful"],
    shareCaption:
      "I got Precision Scientist in ProjectX: A Day as an Astronaut — less drama, more protecting the integrity of the data.",
    quote:
      "A pretty result is optional. An honest result is not.",
  },
  team_anchor: {
    title: "Team Anchor",
    subtitle: "You keep missions coherent by staying aligned with people.",
    keywords: ["coordinated", "trusted", "grounded"],
    shareCaption:
      "I got Team Anchor in ProjectX: A Day as an Astronaut — apparently my astronaut style is keeping people and systems aligned.",
    quote:
      "No mission this complicated is ever really about one person being brilliant in a corner.",
  },
  adaptive_problem_solver: {
    title: "Adaptive Problem Solver",
    subtitle: "You meet uncertainty without stepping away from it.",
    keywords: ["flexible", "composed", "resourceful"],
    shareCaption:
      "I got Adaptive Problem Solver in ProjectX: A Day as an Astronaut — apparently my orbit style is staying calm when things stop being predictable.",
    quote:
      "You do not need the day to behave itself. You just need yourself to.",
  },
};