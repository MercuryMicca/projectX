"use client";

import { use, useEffect, useMemo, useState } from "react";
import ChoiceButton from "../../../components/ChoiceButton";
import StatusBar from "../../../components/StatusBar";

import {
  astronautChapter1StoryNodes,
  type NodeChoice,
} from "../../../lib/story/astronaut/chapter1";
import { astronautChapter2StoryNodes } from "../../../lib/story/astronaut/chapter2";
import { astronautChapter3StoryNodes } from "../../../lib/story/astronaut/chapter3";
import { astronautChapter4StoryNodes } from "../../../lib/story/astronaut/chapter4";
import { astronautChapter5StoryNodes } from "../../../lib/story/astronaut/chapter5";

type GameState = {
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
};

type PlayPageProps = {
  params: Promise<{
    sessionID: string;
  }>;
};

export default function PlayPage({ params }: PlayPageProps) {
  const { sessionID } = use(params);

  const [currentNodeId, setCurrentNodeId] = useState("wakeup");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const allStoryNodes = useMemo(
    () => ({
      ...astronautChapter1StoryNodes,
      ...astronautChapter2StoryNodes,
      ...astronautChapter3StoryNodes,
      ...astronautChapter4StoryNodes,
      ...astronautChapter5StoryNodes,
    }),
    []
  );

  const currentNode = useMemo(
    () => allStoryNodes[currentNodeId] ?? astronautChapter1StoryNodes.wakeup,
    [allStoryNodes, currentNodeId]
  );

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`/api/session/${sessionID}`);
        const text = await response.text();

        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Session API did not return valid JSON");
        }

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load session");
        }

        setGameState({
          missionProgress: data.session.missionProgress,
          stress: data.session.stress,
          teamTrust: data.session.teamTrust,
          energy: data.session.energy,
        });

        setCurrentNodeId(data.session.currentChapter || "wakeup");
        setSelectedChoiceId(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load session.");
      } finally {
        setIsLoading(false);
      }
    }

    if (sessionID) {
      loadSession();
    }
  }, [sessionID]);

  async function handleChoice(choice: NodeChoice) {
    if (!gameState || !sessionID || isSaving) return;

    setSelectedChoiceId(choice.id);
    setIsSaving(true);

    const nextState = {
      missionProgress:
        gameState.missionProgress + (choice.effects.missionProgress ?? 0),
      stress: gameState.stress + (choice.effects.stress ?? 0),
      teamTrust: gameState.teamTrust + (choice.effects.teamTrust ?? 0),
      energy: gameState.energy + (choice.effects.energy ?? 0),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await fetch(`/api/session/${sessionID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentChapter: choice.nextNodeId,
          missionProgress: nextState.missionProgress,
          stress: nextState.stress,
          teamTrust: nextState.teamTrust,
          energy: nextState.energy,
        }),
      });

      const text = await response.text();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Session update API did not return valid JSON");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update session");
      }

      setGameState(nextState);
      setCurrentNodeId(choice.nextNodeId);
      setSelectedChoiceId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save progress.");
      setSelectedChoiceId(null);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-white/70">Loading mission...</p>
        </div>
      </main>
    );
  }

  if (error || !gameState) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-400">{error || "Session not found."}</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center px-6 py-10 text-white"
      style={{
        backgroundImage: `url(${currentNode.backgroundImage})`,
      }}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/50">
            ProjectX
          </p>

          <h1 className="text-3xl font-bold">A Day as an Astronaut</h1>

          <p className="mt-2 text-base text-white/60 md:text-lg">
            {currentNode.chapterId === "chapter1"
              ? `Chapter 1 — ${currentNode.sceneTitle}`
              : currentNode.chapterId === "chapter2"
              ? `Chapter 2 — ${currentNode.sceneTitle}`
              : currentNode.chapterId === "chapter3"
              ? `Chapter 3 — ${currentNode.sceneTitle}`
              : currentNode.chapterId === "chapter4"
              ? `Chapter 4 — ${currentNode.sceneTitle}`
              : currentNode.chapterId === "chapter5"
              ? `Chapter 5 — ${currentNode.sceneTitle}`
              : currentNode.sceneTitle}
          </p>
        </div>

        <StatusBar
          missionProgress={gameState.missionProgress}
          stress={gameState.stress}
          teamTrust={gameState.teamTrust}
          energy={gameState.energy}
        />

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl">
          <p className="mb-3 text-sm text-white/50">{currentNode.sceneTitle}</p>
          <p className="text-lg leading-8 text-white/95">{currentNode.narration}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl">
          <p className="mb-4 text-sm text-white/50">
            {currentNode.choices.length > 0
              ? "What do you do next?"
              : "Checkpoint unlocked"}
          </p>

          {currentNode.choices.length > 0 ? (
            <div className="space-y-3">
              {currentNode.choices.map((choice) => (
                <div key={choice.id} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleChoice(choice)}
                    className="block w-full text-left"
                    disabled={isSaving}
                  >
                    <ChoiceButton label={choice.label} />
                  </button>

                  {selectedChoiceId === choice.id && choice.flavor && (
                    <p className="px-1 text-sm text-white/60">{choice.flavor}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <a
              href={`/result/${sessionID}`}
              className="inline-block rounded-xl bg-white px-6 py-3 font-medium text-black hover:opacity-90"
            >
              View Result
            </a>
          )}
        </div>

        {isSaving && <p className="text-sm text-white/60">Saving progress...</p>}
      </div>
    </main>
  );
}