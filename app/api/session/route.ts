 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await prisma.experienceSession.create({
      data: {
        theme: "astronaut_day_v1",
        currentChapter: "wakeup",
        missionProgress: 50,
        stress: 50,
        teamTrust: 50,
        energy: 50,
        status: "active",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Failed to create session:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create session",
      },
      { status: 500 }
    );
  }
}