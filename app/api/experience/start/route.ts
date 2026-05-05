import { prisma } from "@/lib/prisma";
import {
  buildOpeningMessage,
  getChapterContext,
  getDefaultSessionState,
} from "@/lib/narrative/engine";

type StartExperienceRequest = {
  theme?: unknown;
  participantName?: unknown;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as StartExperienceRequest;
    const theme =
      typeof body.theme === "string" && body.theme.trim()
        ? body.theme.trim()
        : "astronaut_day_v1";
    const participantName =
      typeof body.participantName === "string" && body.participantName.trim()
        ? body.participantName.trim().slice(0, 40)
        : "Astronaut";

    const initialState = getDefaultSessionState(theme);
    const chapter = getChapterContext(initialState.currentChapter);

    const session = await prisma.experienceSession.create({
      data: {
        userId: participantName,
        theme: initialState.theme,
        currentChapter: initialState.currentChapter,
        awareness: initialState.awareness ?? 20,
        missionProgress: initialState.missionProgress,
        stress: initialState.stress,
        teamTrust: initialState.teamTrust,
        energy: initialState.energy,
        status: initialState.status,
      },
    });

    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "system",
        content: buildOpeningMessage(chapter, participantName),
      },
    });

    await prisma.eventLog.create({
      data: {
        sessionId: session.id,
        eventType: "session_started",
        payload: {
          theme,
          participantName,
          chapterKey: chapter.chapterKey,
        },
      },
    });

    return Response.json({
      sessionId: session.id,
      currentChapter: session.currentChapter,
      participantName,
      openingMessage: buildOpeningMessage(chapter, participantName),
    });
  } catch (error) {
    console.error("Failed to start experience:", error);

    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to start experience",
      },
      { status: 500 }
    );
  }
}
