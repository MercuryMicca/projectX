import type {
  ChapterContext,
  IntentClassificationResult,
  NarrativeMessageContext,
  NarrativeSessionState,
} from "../engine";

export const CHAPTER_ONE_KEY = "wake_up";
export const DEFAULT_CHAPTER_ONE_ASTRONAUT_NAME = "Astronaut";

export type ChapterOneIntent =
  | "observe_environment"
  | "check_body"
  | "check_schedule"
  | "identity_check"
  | "ask_question"
  | "off_track"
  | "neutral";

export const chapterOneIntentLabels: ChapterOneIntent[] = [
  "observe_environment",
  "check_body",
  "check_schedule",
  "identity_check",
  "ask_question",
  "off_track",
  "neutral",
];

export function isChapterOne(chapterKey: string) {
  return chapterKey === CHAPTER_ONE_KEY || chapterKey === "wakeup";
}

export function getChapterOneOpeningMessage(participantName?: string) {
  const astronautName =
    participantName?.trim() || DEFAULT_CHAPTER_ONE_ASTRONAUT_NAME;

  return `You are ${astronautName}, an astronaut aboard the station.
You wake up in your crew quarters. The station is quiet.

What do you do first?`;
}

export function getChapterOneContext(): ChapterContext {
  return {
    chapterKey: CHAPTER_ONE_KEY,
    title: "Wake Up",
    goal: "Settle into the astronaut mindset through calm awareness, observation, and attention to the first details of the orbital morning.",
    summary:
      "You wake inside the station as the lights rise gently and the first minutes of the day ask for calm attention rather than haste.",
    order: 1,
  };
}

export function buildChapterOneClassificationPrompt(params: {
  message: string;
  session: NarrativeSessionState & { messages?: NarrativeMessageContext[] };
}) {
  const { message, session } = params;
  const recentMessages = (session.messages ?? []).slice(-6);

  return `Classify the user's intent for Chapter 1 of an astronaut life simulation.

Current Chapter:
Wake Up

Chapter Goal:
Help the user slowly enter the astronaut mindset through awareness, calm observation, and adapting to life in space.

User Message:
"${message}"

Recent Conversation:
${JSON.stringify(recentMessages)}

Return JSON:
{
  "intent": "observe_environment | check_body | check_schedule | identity_check | ask_question | off_track | neutral",
  "confidence": 0.0,
  "reason": "short explanation"
}

Examples:
- "who am I?" -> identity_check
- "look outside" -> observe_environment
- "check my body" -> check_body
- "what's on my schedule?" -> check_schedule
- "what should I do?" -> neutral
}`;
}

export function normalizeChapterOneIntent(
  classification: IntentClassificationResult
): ChapterOneIntent {
  const intent = classification.intent as ChapterOneIntent;

  return chapterOneIntentLabels.includes(intent) ? intent : "neutral";
}

export function computeChapterOneNextState(params: {
  session: NarrativeSessionState & { messages?: NarrativeMessageContext[] };
  intent: IntentClassificationResult;
}) {
  const { session, intent } = params;
  const next = { ...session };
  const normalizedIntent = normalizeChapterOneIntent(intent);
  next.hasIntroducedIdentity = true;

  if (normalizedIntent === "observe_environment") {
    next.awareness = (next.awareness ?? 0) + 8;
    next.stress -= 2;
  }

  if (normalizedIntent === "check_body") {
    next.awareness = (next.awareness ?? 0) + 6;
    next.energy -= 1;
  }

  if (normalizedIntent === "check_schedule") {
    next.missionProgress += 10;
  }

  if (normalizedIntent === "identity_check") {
    next.awareness = (next.awareness ?? 0) + 5;
  }

  if (normalizedIntent === "ask_question") {
    next.awareness = (next.awareness ?? 0) + 3;
  }

  if (normalizedIntent === "off_track") {
    next.stress += 2;
  }

  next.awareness = Math.max(0, Math.min(100, next.awareness ?? 0));
  next.stress = Math.max(0, Math.min(100, next.stress));
  next.energy = Math.max(0, Math.min(100, next.energy));
  next.missionProgress = Math.max(0, Math.min(100, next.missionProgress));

  const isImmersed = (next.awareness ?? 0) >= 15;
  const isReady = next.missionProgress >= 10;
  const readyToProgress = isImmersed && isReady;

  if (readyToProgress) {
    next.currentChapter = "system_check";
  } else {
    next.currentChapter = CHAPTER_ONE_KEY;
  }

  next.lastIntent = intent.intent;

  return {
    nextState: next,
    readyToProgress,
    normalizedIntent,
  };
}

export function buildChapterOneResponsePrompt(params: {
  userMessage: string;
  session: NarrativeSessionState & { messages?: NarrativeMessageContext[] };
  intent: IntentClassificationResult;
  readyToProgress: boolean;
}) {
  const { userMessage, session, intent, readyToProgress } = params;
  const astronautName =
    session.participantName?.trim() || DEFAULT_CHAPTER_ONE_ASTRONAUT_NAME;
  const recentConversation = (session.messages ?? [])
    .slice(-6)
    .map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.content}`)
    .join("\n");

  const normalizedIntent = normalizeChapterOneIntent(intent);

  return {
    systemPrompt: `You are a narrative guide for an interactive astronaut simulation.

Your goal is NOT to tell a story.
Your goal is to guide the user through a short, playable experience.

---

CHAPTER CONTEXT:
- Chapter: Wake Up
- The user has just woken up in a space station crew quarters
- This chapter focuses on ONE skill: awareness

---

RESPONSE STYLE (CRITICAL):
- Keep responses SHORT (1-4 sentences max)
- Use clear, concrete language
- No poetic writing
- No long descriptions
- No abstract explanations
- End on momentum, not micromanagement

Each response must:
1. React to the user's action
2. Add ONE concrete detail about the environment or body
3. Leave a meaningful next step

---

IDENTITY RULE:
- The user's identity is introduced ONLY once at the beginning
- Do NOT repeat identity unless the user asks (e.g. "who am I?")

---

AMBIENT MEMORY SYSTEM (VERY IMPORTANT):

Occasionally include short memory fragments that reflect real astronaut life.

These should:
- Be 1-2 lines max
- Be subtle, not explained
- Be attached to the current action
- Feel like a passing thought or habit

They should reveal:
- discipline (e.g. fixed wake-up time like 06:30)
- training (repeated practice, controlled movement)
- body adaptation (microgravity requires effort)
- structured routine (nothing is random)

DO NOT:
- explain the meaning of the memory
- lecture the user
- include memory in every response

Frequency:
- roughly every 2-3 turns OR when naturally triggered

---

EXAMPLES OF MEMORY INSERTION:

If the user checks time:
"You check the time - 06:30.
You've kept this schedule since training."

If the user moves:
"You push slightly.
You move more than you expect.
You learned to control every small movement."

If the user looks outside:
"Earth moves slowly below.
Sixteen sunrises a day. You stopped counting."

---

PHASE DESIGN (FOLLOW THIS FLOW):

Phase 1: Orientation
- The user wakes up
- Slight uncertainty

Phase 2: Break expectation
- Movement behaves differently

Phase 3: Adjustment
- Calm vs rushed behavior produces different results

Phase 4: Awareness
- Environment feels unfamiliar

Phase 5: Small anomaly
- Minor system issue (not urgent, but not normal)

---

BEHAVIOR RULES:

- Do NOT over-explain
- Do NOT repeat setup
- Do NOT summarize
- Always stay inside the current moment
- Use second person perspective
- Identity has already been introduced unless the user explicitly asks for it
- Do NOT repeat:
  - "You are ${astronautName}"
  - personal profile details that were not explicitly provided
  unless directly relevant to an identity_check
- Continue from the previous action and current situation
- If you end with a question or prompt, it must point to the next meaningful beat of the scene, not a tiny procedural sub-decision.
- Do NOT end with narrow binary questions like "Do you do A or B?" unless that exact choice is the main turning point.
- Do NOT invent menu-like choices in the prose.
- Prefer broad prompts such as:
  - "What do you do next?"
  - "How do you want to move forward?"
  - "What's your next move?"
- Sometimes do not ask a question at all if the moment should simply land.

- If the user is ready to progress, use this exact transition:
"You take a moment.
Then you remember — your system check is due.
Time to begin."

---

FINAL GOAL:

By the end of this chapter, the user should feel:

"Even simple actions require attention here."

Do not say this directly.
Let them experience it.

---

Intent handling:
- If identity_check, clearly tell the user their name and that they are an astronaut aboard the station. Do not invent age or extra personal profile details.
- If observe_environment, focus on the quarters, the window, Earth, station light, or quiet.
- If check_body, focus on hands, breathing, balance, drift, or microgravity.
- If check_schedule, mention the first task: system check - oxygen, power, communications.
- If ask_question, answer briefly in-world, then move back to action.
- If off_track, gently redirect without breaking immersion.
- If neutral, keep the scene moving with a simple next step.`,
    userPrompt: `Current Chapter:
Wake Up

Participant Name:
${astronautName}

Current State:
Awareness: ${session.awareness ?? 0}
Energy: ${session.energy}
Stress: ${session.stress}
Mission Progress: ${session.missionProgress}
Has Introduced Identity: ${session.hasIntroducedIdentity ? "yes" : "no"}

User Intent:
${normalizedIntent}

Intent Reason:
${intent.reason}

Ready To Progress:
${readyToProgress ? "yes" : "no"}

Recent Conversation:
${recentConversation || `User: ${userMessage}`}

Latest User Message:
${userMessage}

Scene facts:
- The station lights are slowly coming on.
- Earth is visible outside the window.
- The station is quiet.
- The user is adapting to microgravity.`,
  };
}
