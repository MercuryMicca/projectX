import { ImageResponse } from "next/og";
import { prisma } from "../../../lib/prisma";
import {
  ARCHETYPES,
  getArchetypeKey,
  getMissionScore,
} from "../../../lib/result/archetypes";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ sessionID: string }>;
}) {
  const { sessionID } = await params;

  const session = await prisma.experienceSession.findUnique({
    where: { id: sessionID },
  });

  if (!session) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#000",
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
          }}
        >
          Result not found
        </div>
      ),
      size
    );
  }

  const archetypeKey = getArchetypeKey(session);
  const archetype = ARCHETYPES[archetypeKey];
  const score = getMissionScore(session);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at center, rgba(50,80,180,0.18), transparent 38%), #05070d",
          color: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 18,
            }}
          >
            Project X · Astronaut Result
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            {archetype.title}
          </div>

          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 720,
              lineHeight: 1.35,
            }}
          >
            {archetype.subtitle}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            gap: 14,
            marginTop: 24,
          }}
        >
          {archetype.keywords.map((keyword) => (
            <div
              key={keyword}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                fontSize: 22,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {keyword}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 760,
            }}
          >
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.92)",
                marginBottom: 16,
              }}
            >
              “{archetype.quote}”
            </div>

            <div
              style={{
                fontSize: 22,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Live a real day in someone else’s life.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: 8,
              }}
            >
              Mission Score
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 700,
              }}
            >
              {score}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}