import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    sessionID: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { sessionID } = await context.params;

    const session = await prisma.experienceSession.findUnique({
      where: { id: sessionID },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Session not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Failed to load session:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to load session",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { sessionID } = await context.params;
    const body = await request.json();

    const updatedSession = await prisma.experienceSession.update({
      where: { id: sessionID },
      data: {
        currentChapter: body.currentChapter,
        missionProgress: body.missionProgress,
        stress: body.stress,
        teamTrust: body.teamTrust,
        energy: body.energy,
      },
    });

    return NextResponse.json({
      success: true,
      session: updatedSession,
    });
  } catch (error) {
    console.error("Failed to update session:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update session",
      },
      { status: 500 }
    );
  }
}