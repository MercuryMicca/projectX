import { OpenAI } from "openai";
import {
  buildChapterOneClassificationPrompt,
  buildChapterOneResponsePrompt,
  CHAPTER_ONE_KEY,
  computeChapterOneNextState,
  getChapterOneContext,
  getChapterOneOpeningMessage,
  isChapterOne,
} from "./chapters/chapter1";
import {
  buildChapterTwoResponsePrompt,
  getChapterTwoContext,
  isChapterTwo,
} from "./chapters/chapter2";

export type NarrativeIntent =
  | "observe_environment"
  | "check_body"
  | "check_schedule"
  | "identity_check"
  | "follow_objective"
  | "explore_environment"
  | "ask_question"
  | "emotional_reaction"
  | "off_track"
  | "neutral"
  | "skip_ahead"
  | "refuse";

export type NarrativeBeat =
  | "arrival"
  | "adaptation"
  | "complication"
  | "resolution"
  | "finale";

export type NarrativeSessionState = {
  id?: string;
  participantName?: string;
  theme: string;
  currentChapter: string;
  awareness?: number;
  hasIntroducedIdentity?: boolean;
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
  status: string;
  storyBeat?: NarrativeBeat;
  lastIntent?: NarrativeIntent;
};

export type ChapterContext = {
  chapterKey: string;
  title: string;
  goal: string;
  summary: string;
  order: number;
};

export type NarrativeMessageContext = {
  role: string;
  content: string;
  intent?: string | null;
};

export type IntentClassificationInput = {
  message: string;
  session: NarrativeSessionState & {
    messages?: NarrativeMessageContext[];
  };
  chapter: ChapterContext;
};

export type IntentClassificationResult = {
  intent: NarrativeIntent;
  confidence: number;
  reason: string;
};

export type NextStateInput = {
  session: NarrativeSessionState & {
    messages?: NarrativeMessageContext[];
  };
  intent: IntentClassificationResult;
};

export type NarrativeResponseInput = {
  userMessage: string;
  session: NarrativeSessionState & {
    messages?: NarrativeMessageContext[];
  };
  chapter: ChapterContext;
  intent: IntentClassificationResult;
};

const INTENT_MODEL = process.env.OPENAI_INTENT_MODEL ?? "gpt-5.2";

const intentLabels: NarrativeIntent[] = [
  "observe_environment",
  "check_body",
  "check_schedule",
  "identity_check",
  "follow_objective",
  "explore_environment",
  "ask_question",
  "emotional_reaction",
  "off_track",
  "neutral",
  "skip_ahead",
  "refuse",
];

const defaultSessionState: NarrativeSessionState = {
  theme: "astronaut_day_v1",
  currentChapter: CHAPTER_ONE_KEY,
  awareness: 0,
  hasIntroducedIdentity: true,
  missionProgress: 0,
  stress: 20,
  teamTrust: 50,
  energy: 80,
  status: "active",
  storyBeat: "arrival",
};

export const defaultChapterDefinitions: Record<string, ChapterContext> = {
  wake_up: {
    ...getChapterOneContext(),
  },
  wakeup: {
    ...getChapterOneContext(),
    chapterKey: "wakeup",
  },
  briefing: {
    chapterKey: "briefing",
    title: "Daily Briefing",
    goal: "Guide the user toward the station's technical priorities.",
    summary:
      "The user syncs with mission expectations and starts to understand the day as operational work, not spectacle.",
    order: 2,
  },
  system_check: {
    ...getChapterTwoContext(),
  },
  crisis: {
    chapterKey: "crisis",
    title: "Crisis",
    goal: "Guide the user through rising operational tension without losing procedural discipline.",
    summary:
      "The mission becomes less routine and more fragile as the consequences of earlier decisions begin to surface.",
    order: 4,
  },
  debrief: {
    chapterKey: "debrief",
    title: "Debrief",
    goal: "Guide the user to reflect on the mission and close the experience coherently.",
    summary:
      "The orbital day settles into memory, evaluation, and emotional residue as the experience comes to a close.",
    order: 5,
  },
};

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  return new OpenAI({ apiKey });
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function inferStoryBeat(missionProgress: number): NarrativeBeat {
  if (missionProgress >= 90) {
    return "finale";
  }

  if (missionProgress >= 70) {
    return "resolution";
  }

  if (missionProgress >= 45) {
    return "complication";
  }

  if (missionProgress >= 20) {
    return "adaptation";
  }

  return "arrival";
}

function inferStatus(
  previousStatus: string,
  missionProgress: number,
  intent: NarrativeIntent
) {
  if (missionProgress >= 100) {
    return "complete";
  }

  if (previousStatus === "paused" && intent === "off_track") {
    return "paused";
  }

  return "active";
}

function inferCurrentChapter(
  previousChapter: string,
  beat: NarrativeBeat,
  intent: NarrativeIntent
) {
  if (previousChapter.startsWith("narrative:")) {
    return intent === "off_track" ? previousChapter : `narrative:${beat}`;
  }

  return previousChapter;
}

function getChapterFromProgress(missionProgress: number) {
  if (missionProgress >= 85) {
    return "debrief";
  }

  if (missionProgress >= 60) {
    return "crisis";
  }

  if (missionProgress >= 30) {
    return "system_check";
  }

  if (missionProgress >= 10) {
    return "briefing";
  }

  return CHAPTER_ONE_KEY;
}

export function normalizeSessionState(
  session: Partial<NarrativeSessionState> | null | undefined
): NarrativeSessionState {
  const merged = {
    ...defaultSessionState,
    ...session,
  };

  const storyBeat = merged.storyBeat ?? inferStoryBeat(merged.missionProgress);

  return {
    id: merged.id,
    participantName: merged.participantName,
    theme: merged.theme,
    currentChapter: merged.currentChapter,
    awareness: clamp(merged.awareness ?? 0),
    hasIntroducedIdentity: merged.hasIntroducedIdentity ?? true,
    missionProgress: clamp(merged.missionProgress),
    stress: clamp(merged.stress),
    teamTrust: clamp(merged.teamTrust),
    energy: clamp(merged.energy),
    status: merged.status,
    storyBeat,
    lastIntent: merged.lastIntent,
  };
}

export function getDefaultSessionState(
  theme = "astronaut_day_v1"
): NarrativeSessionState {
  return {
    ...defaultSessionState,
    theme,
  };
}

export function getChapterContext(chapterKey: string): ChapterContext {
  if (isChapterOne(chapterKey)) {
    return getChapterOneContext();
  }

  return (
    defaultChapterDefinitions[chapterKey] ??
    defaultChapterDefinitions[CHAPTER_ONE_KEY]
  );
}

export function buildOpeningMessage(
  chapter: ChapterContext,
  participantName?: string
) {
  if (isChapterOne(chapter.chapterKey)) {
    return getChapterOneOpeningMessage(participantName);
  }

  return `${chapter.title}. ${chapter.summary}`;
}

export async function classifyUserIntent({
  message,
  session,
  chapter,
}: IntentClassificationInput): Promise<IntentClassificationResult> {
  const client = getClient();
  const recentMessages = (session.messages ?? []).slice(-6);
  const prompt = isChapterOne(chapter.chapterKey)
    ? buildChapterOneClassificationPrompt({ message, session })
    : `Classify the user intent.

Message: "${message}"

Current Chapter: "${chapter.chapterKey}"
Chapter Goal: "${chapter.goal}"
Current Progress: ${session.missionProgress}
Recent Messages: ${JSON.stringify(recentMessages)}

Return JSON:
{
  "intent": "follow_objective | explore_environment | ask_question | emotional_reaction | off_track | skip_ahead | refuse",
  "confidence": 0.0,
  "reason": "short explanation"
}`;

  const response = await client.responses.create({
    model: INTENT_MODEL,
    input: prompt,
  });

  const raw = response.output_text.trim();

  try {
    const parsed = JSON.parse(raw) as {
      intent?: string;
      confidence?: number;
      reason?: string;
    };
    const normalized = parsed.intent?.trim().toLowerCase() as
      | NarrativeIntent
      | undefined;

    const fallbackIntent = isChapterOne(chapter.chapterKey)
      ? "neutral"
      : "follow_objective";

    return {
      intent:
        normalized && intentLabels.includes(normalized)
          ? normalized
          : fallbackIntent,
      confidence:
        typeof parsed.confidence === "number"
          ? clamp(parsed.confidence * 100, 0, 100) / 100
          : 0.5,
      reason:
        typeof parsed.reason === "string" && parsed.reason.trim()
          ? parsed.reason.trim()
          : "Fallback classification was used.",
    };
  } catch {
    return {
      intent: isChapterOne(chapter.chapterKey) ? "neutral" : "follow_objective",
      confidence: 0.5,
      reason: "Classifier JSON could not be parsed, so the default intent was used.",
    };
  }
}

export function computeNextState({
  session,
  intent,
}: NextStateInput): NarrativeSessionState {
  if (isChapterOne(session.currentChapter)) {
    // Chapter 1 is the template for chapter-specific narrative state engines.
    return computeChapterOneNextState({ session, intent }).nextState;
  }

  const next = { ...session };

  if (intent.intent === "follow_objective") {
    next.missionProgress += 15;
    next.energy -= 2;
  }

  if (intent.intent === "explore_environment") {
    next.stress -= 3;
    next.missionProgress += 5;
  }

  if (intent.intent === "ask_question") {
    next.teamTrust += 2;
    next.missionProgress += 3;
  }

  if (intent.intent === "emotional_reaction") {
    next.stress -= 1;
    next.teamTrust += 1;
  }

  if (intent.intent === "off_track") {
    next.stress += 2;
  }

  if (intent.intent === "skip_ahead") {
    next.stress += 1;
    next.missionProgress += 1;
  }

  if (intent.intent === "refuse") {
    next.teamTrust -= 2;
    next.stress += 1;
  }

  const missionProgress = clamp(next.missionProgress);
  const stress = clamp(next.stress);
  const teamTrust = clamp(next.teamTrust);
  const energy = clamp(next.energy);
  const storyBeat = inferStoryBeat(missionProgress);
  const status = inferStatus(session.status, missionProgress, intent.intent);

  let currentChapter = getChapterFromProgress(missionProgress);

  if (
    session.currentChapter === "system_check" &&
    missionProgress >= 40
  ) {
    currentChapter = "science_mission";
  } else if (session.currentChapter.startsWith("narrative:")) {
    currentChapter = inferCurrentChapter(currentChapter, storyBeat, intent.intent);
  }

  return {
    ...session,
    awareness: clamp(session.awareness ?? 0),
    missionProgress,
    stress,
    teamTrust,
    energy,
    status,
    storyBeat,
    currentChapter,
    lastIntent: intent.intent,
  };
}

export async function generateNarrativeResponse({
  userMessage,
  session,
  chapter,
  intent,
}: NarrativeResponseInput) {
  const client = getClient();
  if (isChapterOne(session.currentChapter) || isChapterOne(chapter.chapterKey)) {
    const { systemPrompt, userPrompt } = buildChapterOneResponsePrompt({
      userMessage,
      session,
      intent,
      readyToProgress: session.currentChapter === "system_check",
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_RESPONSE_MODEL ?? "gpt-5.2",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return response.output_text.trim();
  }

  if (isChapterTwo(session.currentChapter) || isChapterTwo(chapter.chapterKey)) {
    const { systemPrompt, userPrompt } = buildChapterTwoResponsePrompt({
      userMessage,
      session,
      intent,
      readyToProgress: false,
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_RESPONSE_MODEL ?? "gpt-5.2",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return response.output_text.trim();
  }

  const recentConversation = (session.messages ?? [])
    .slice(-6)
    .map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.content}`)
    .join("\n");

  const systemPrompt = `You are a narrative guide for an interactive simulation.

CRITICAL RULES:
- Be CLEAR and DIRECT
- Do NOT be poetic or overly descriptive
- Do NOT use metaphors
- Keep responses short (1-3 sentences)
- End on momentum, not micromanagement

Your job is to:
1. Tell the user who they are
2. Give concrete situation details
3. Provide light emotional context (optional)
4. Move the story forward

Style:
- Simple
- Specific
- Grounded
- Like a game narrator, not a novelist

Avoid:
- vague descriptions
- long paragraphs
- abstract feelings without context

Additional rules:
- Stay within the current chapter.
- Do not jump ahead unless the state engine says so.
- Gently guide the user toward the current chapter goal.
- Do not expose system state, scores, or internal logic.
- The user's in-world name is ${session.participantName || "the user"}.
- If you end with a question or prompt, make it broad enough to advance the scene.
- Do NOT end with overly specific binary questions about tiny procedural motions unless that exact choice is the central dramatic beat.
- Do NOT fabricate menu-like choices in the prose.
- Prefer endings like "What do you do next?" or "How do you move forward?" over detailed either/or prompts.
- Sometimes end on a clean narrative beat with no question at all.`;

  const dynamicContext = `Current Chapter:
${chapter.title}

Participant Name:
${session.participantName || "Unknown"}

Chapter Goal:
${chapter.goal}

Current State:
Energy: ${session.energy}
Stress: ${session.stress}
Team Trust: ${session.teamTrust}
Mission Progress: ${session.missionProgress}

User Intent:
${intent.intent}

Recent Conversation:
${recentConversation || `User: ${userMessage}`}`;

  const response = await client.responses.create({
    model: process.env.OPENAI_RESPONSE_MODEL ?? "gpt-5.2",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `${dynamicContext}

Latest User Message:
${userMessage}`,
      },
    ],
  });

  return response.output_text.trim();
}
