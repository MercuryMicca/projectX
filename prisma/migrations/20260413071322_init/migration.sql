-- CreateTable
CREATE TABLE "ExperienceSession" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "currentChapter" TEXT NOT NULL,
    "missionProgress" INTEGER NOT NULL,
    "stress" INTEGER NOT NULL,
    "teamTrust" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceSession_pkey" PRIMARY KEY ("id")
);
