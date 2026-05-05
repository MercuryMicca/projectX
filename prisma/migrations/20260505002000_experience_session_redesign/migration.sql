-- AlterTable
ALTER TABLE "ExperienceSession"
ADD COLUMN "userId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'active',
ALTER COLUMN "energy" SET DEFAULT 70,
ALTER COLUMN "stress" SET DEFAULT 30,
ALTER COLUMN "teamTrust" SET DEFAULT 50,
ALTER COLUMN "missionProgress" SET DEFAULT 0;

-- Update legacy rows to match new defaults when values are missing or still using old seed values.
UPDATE "ExperienceSession"
SET
  "energy" = CASE WHEN "energy" = 50 THEN 70 ELSE "energy" END,
  "stress" = CASE WHEN "stress" = 50 THEN 30 ELSE "stress" END,
  "teamTrust" = CASE WHEN "teamTrust" = 50 THEN 50 ELSE "teamTrust" END,
  "missionProgress" = CASE WHEN "missionProgress" = 50 THEN 0 ELSE "missionProgress" END
WHERE
  "energy" = 50
  OR "stress" = 50
  OR "teamTrust" = 50
  OR "missionProgress" = 50;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "intent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterDefinition" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "chapterKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ChapterDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_sessionId_createdAt_idx" ON "Message"("sessionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterDefinition_theme_chapterKey_key" ON "ChapterDefinition"("theme", "chapterKey");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterDefinition_theme_order_key" ON "ChapterDefinition"("theme", "order");

-- CreateIndex
CREATE INDEX "ChapterDefinition_theme_order_idx" ON "ChapterDefinition"("theme", "order");

-- CreateIndex
CREATE INDEX "EventLog_sessionId_createdAt_idx" ON "EventLog"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "EventLog_eventType_createdAt_idx" ON "EventLog"("eventType", "createdAt");

-- AddForeignKey
ALTER TABLE "Message"
ADD CONSTRAINT "Message_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "ExperienceSession"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog"
ADD CONSTRAINT "EventLog_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "ExperienceSession"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
