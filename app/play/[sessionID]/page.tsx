"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  params: Promise<{ sessionID: string }>;
};

export default function PlayPage({ params }: PlayPageProps) {
  const [sessionID, setSessionID] = useState("");
  const [currentNodeId, setCurrentNodeId] = useState("wakeup");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

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

  async function tryPlayAudio() {
    if (!audioRef.current || !isAudioEnabled) return;

    try {
      audioRef.current.volume = 0.35;
      await audioRef.current.play();
    } catch (error) {
      console.error("Audio autoplay blocked:", error);
    }
  }

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true);
        setError("");

        const resolvedParams = await params;
        const id = resolvedParams.sessionID;
        setSessionID(id);

        const response = await fetch(`/api/session/${id}`);
        const data = await response.json();

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
        setError("Failed to load session.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [params]);

  useEffect(() => {
    if (!isAudioEnabled && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isAudioEnabled]);

  async function handleChoice(choice: NodeChoice) {
    if (!gameState || !sessionID || isSaving) return;

    await tryPlayAudio();

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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

      const data = await response.json();

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
      <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/70">Loading mission...</p>
        </div>
      </main>
    );
  }

  if (error || !gameState) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-400">{error || "Session not found."}</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen text-white px-6 py-10 bg-cover bg-center"
      style={{
        backgroundImage: `url(${currentNode.backgroundImage})`,
      }}
    >
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/audio/astronaut/ambient-orbit.mp3"
      />

      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="relative max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">
              ProjectX
            </p>

            <h1 className="text-3xl font-bold">A Day as an Astronaut</h1>

            <p className="text-white/60 text-base md:text-lg mt-2">
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

          <button
            onClick={async () => {
              if (!audioRef.current) return;

              if (isAudioEnabled) {
                audioRef.current.pause();
                setIsAudioEnabled(false);
              } else {
                setIsAudioEnabled(true);
                try {
                  audioRef.current.volume = 0.35;
                  await audioRef.current.play();
                } catch (error) {
                  console.error("Audio play failed:", error);
                }
              }
            }}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80 hover:bg-black/40"
          >
            {isAudioEnabled ? "Sound On" : "Sound Off"}
          </button>
        </div>

        <StatusBar
          missionProgress={gameState.missionProgress}
          stress={gameState.stress}
          teamTrust={gameState.teamTrust}
          energy={gameState.energy}
        />

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl">
          <p className="text-sm text-white/50 mb-3">{currentNode.sceneTitle}</p>
          <p className="text-lg leading-8 text-white/95">
            {currentNode.narration}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl">
          <p className="text-sm text-white/50 mb-4">
            {currentNode.choices.length > 0
              ? "What do you do next?"
              : "Result unlocked"}
          </p>

          {currentNode.choices.length > 0 ? (
            <div className="space-y-3">
              {currentNode.choices.map((choice) => (
                <div key={choice.id} className="space-y-2">
                  <div onClick={() => handleChoice(choice)}>
                    <ChoiceButton label={choice.label} />
                  </div>

                  {selectedChoiceId === choice.id && choice.flavor && (
                    <p className="text-sm text-white/60 px-1">
                      {choice.flavor}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <a
              href={`/result/${sessionID}`}
              className="inline-block rounded-xl bg-white text-black px-6 py-3 font-medium hover:opacity-90"
            >
              View Result
            </a>
          )}
        </div>

        {isSaving && (
          <p className="text-sm text-white/60">Saving progress...</p>
        )}
      </div>
    </main>
  );
}