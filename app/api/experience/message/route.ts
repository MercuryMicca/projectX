import type { Message as PrismaMessage } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  classifyUserIntent,
  computeNextState,
  generateNarrativeResponse,
  getChapterContext,
  normalizeSessionState,
  type ChapterContext,
  type IntentClassificationResult,
  type NarrativeMessageContext,
  type NarrativeSessionState,
} from "@/lib/narrative/engine";
import {
  getAstronautSelectedChoice,
} from "@/lib/story/astronaut/flow";
import type { StatEffects } from "@/lib/story/astronaut/chapter1";

type ExperienceMessageRequest = {
  sessionId?: unknown;
  message?: unknown;
  nodeId?: unknown;
};

type SessionWithMessages = {
  id: string;
  userId: string | null;
  theme: string;
  currentChapter: string;
  awareness: number;
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
  status: string;
  messages: PrismaMessage[];
};

function mapSessionToState(
  session: SessionWithMessages
): NarrativeSessionState & { messages: NarrativeMessageContext[] } {
  return {
    ...normalizeSessionState({
      id: session.id,
      participantName: session.userId ?? undefined,
      theme: session.theme,
      currentChapter: session.currentChapter,
      awareness: session.awareness,
      missionProgress: session.missionProgress,
      stress: session.stress,
      teamTrust: session.teamTrust,
      energy: session.energy,
      status: session.status,
    }),
    messages: session.messages.map((item) => ({
      role: item.role,
      content: item.content,
      intent: item.intent,
    })),
  };
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function applyStoryEffects(
  session: NarrativeSessionState & { messages?: NarrativeMessageContext[] },
  effects: StatEffects
) {
  return {
    ...session,
    missionProgress: clamp(session.missionProgress + (effects.missionProgress ?? 0)),
    stress: clamp(session.stress + (effects.stress ?? 0)),
    teamTrust: clamp(session.teamTrust + (effects.teamTrust ?? 0)),
    energy: clamp(session.energy + (effects.energy ?? 0)),
  };
}

function applyChapterOneNodeBonuses(
  session: NarrativeSessionState & { messages?: NarrativeMessageContext[] },
  nodeId: string
) {
  if (session.currentChapter !== "wake_up" && session.currentChapter !== "wakeup") {
    return session;
  }

  const awarenessBonuses: Record<string, number> = {
    wakeup: 6,
    first_choice: 5,
    microgravity: 6,
    chapter1_end: 4,
  };

  const progressBonuses: Record<string, number> = {
    microgravity: 2,
    chapter1_end: 3,
  };

  return {
    ...session,
    awareness: clamp((session.awareness ?? 0) + (awarenessBonuses[nodeId] ?? 0)),
    missionProgress: clamp(
      session.missionProgress + (progressBonuses[nodeId] ?? 0)
    ),
  };
}

async function loadSessionState(sessionId: string) {
  return prisma.experienceSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 20,
      },
    },
  });
}

async function getCurrentChapter(theme: string, chapterKey: string) {
  const chapter = await prisma.chapterDefinition.findUnique({
    where: {
      theme_chapterKey: {
        theme,
        chapterKey,
      },
    },
  });

  return chapter ?? getChapterContext(chapterKey);
}

async function saveUserAndAssistantMessages(
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  intent: IntentClassificationResult
) {
  await prisma.message.createMany({
    data: [
      {
        sessionId,
        role: "user",
        content: userMessage,
        intent: intent.intent,
      },
      {
        sessionId,
        role: "assistant",
        content: assistantMessage,
        intent: intent.intent,
      },
    ],
  });
}

async function updateSessionState(
  sessionId: string,
  state: NarrativeSessionState
) {
  await prisma.experienceSession.update({
    where: { id: sessionId },
    data: {
      currentChapter: state.currentChapter,
      awareness: state.awareness ?? 20,
      missionProgress: state.missionProgress,
      stress: state.stress,
      teamTrust: state.teamTrust,
      energy: state.energy,
      status: state.status,
    },
  });
}

async function logNarrativeEvents(params: {
  sessionId: string;
  previousState: NarrativeSessionState;
  nextState: NarrativeSessionState;
  intent: IntentClassificationResult;
  message: string;
  chapter: ChapterContext;
}) {
  const { sessionId, previousState, nextState, intent, message, chapter } = params;

  await prisma.eventLog.create({
    data: {
      sessionId,
      eventType: "stat_changed",
      payload: {
        from: {
          currentChapter: previousState.currentChapter,
          awareness: previousState.awareness ?? 20,
          missionProgress: previousState.missionProgress,
          energy: previousState.energy,
          stress: previousState.stress,
          teamTrust: previousState.teamTrust,
        },
        to: {
          currentChapter: nextState.currentChapter,
          awareness: nextState.awareness ?? 20,
          missionProgress: nextState.missionProgress,
          energy: nextState.energy,
          stress: nextState.stress,
          teamTrust: nextState.teamTrust,
        },
        intent: intent.intent,
        confidence: intent.confidence,
        reason: intent.reason,
        chapterKey: chapter.chapterKey,
      },
    },
  });

  if (previousState.currentChapter !== nextState.currentChapter) {
    await prisma.eventLog.create({
      data: {
        sessionId,
        eventType: "chapter_advanced",
        payload: {
          from: previousState.currentChapter,
          to: nextState.currentChapter,
        },
      },
    });
  }

  if (intent.intent === "off_track") {
    await prisma.eventLog.create({
      data: {
        sessionId,
        eventType: "off_track",
        payload: {
          chapterKey: chapter.chapterKey,
          message,
        },
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const { sessionId, message, nodeId } =
      (await req.json()) as ExperienceMessageRequest;
    const normalizedSessionId =
      typeof sessionId === "string" ? sessionId.trim() : "";
    const normalizedMessage =
      typeof message === "string" ? message.trim() : "";
    const normalizedNodeId = typeof nodeId === "string" ? nodeId.trim() : "";

    if (!normalizedSessionId) {
      return Response.json({ error: "sessionId is required." }, { status: 400 });
    }

    if (!normalizedMessage) {
      return Response.json({ error: "message is required." }, { status: 400 });
    }

    const sessionRecord = await loadSessionState(normalizedSessionId);

    if (!sessionRecord) {
      return Response.json({ error: "Session not found." }, { status: 404 });
    }

    const session = mapSessionToState(sessionRecord);
    const chapter = await getCurrentChapter(session.theme, session.currentChapter);
    const selectedChoice = getAstronautSelectedChoice(
      session.currentChapter,
      normalizedNodeId || null,
      normalizedMessage
    );
    const sessionWithStoryEffects = selectedChoice
      ? applyStoryEffects(session, selectedChoice.effects)
      : session;
    const sessionWithNodeProgress = normalizedNodeId
      ? applyChapterOneNodeBonuses(sessionWithStoryEffects, normalizedNodeId)
      : sessionWithStoryEffects;

    const intent = await classifyUserIntent({
      message: normalizedMessage,
      session: sessionWithNodeProgress,
      chapter,
    });

    const nextState = computeNextState({
      session: sessionWithNodeProgress,
      intent,
    });

    const nextChapter = await getCurrentChapter(
      session.theme,
      nextState.currentChapter
    );

    const assistantMessage = await generateNarrativeResponse({
      userMessage: normalizedMessage,
      session: {
        ...nextState,
        messages: session.messages,
      },
      chapter: nextChapter,
      intent,
    });

    await saveUserAndAssistantMessages(
      normalizedSessionId,
      normalizedMessage,
      assistantMessage,
      intent
    );
    await updateSessionState(normalizedSessionId, nextState);
    await logNarrativeEvents({
      sessionId: normalizedSessionId,
      previousState: session,
      nextState,
      intent,
      message: normalizedMessage,
      chapter,
    });

    return Response.json({
      assistantMessage,
      state: nextState,
      intent,
    });
  } catch (error) {
    console.error("Experience message API failed:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process experience message",
      },
      { status: 500 }
    );
  }
}
