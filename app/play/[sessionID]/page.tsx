"use client";

import { use, useEffect, useRef, useState } from "react";
import AmbientControls from "../../../components/experience/AmbientControls";
import BackgroundScene from "../../../components/experience/BackgroundScene";
import ChapterHeader from "../../../components/experience/ChapterHeader";
import ChatWindow from "../../../components/experience/ChatWindow";
import StateIndicator from "../../../components/experience/StateIndicator";
import UserInput from "../../../components/experience/UserInput";
import {
  getAstronautPromptTips,
  getAstronautSelectedChoice,
  getAstronautStoryFlow,
  getAstronautStoryNode,
  getNextAstronautNodeId,
} from "@/lib/story/astronaut/flow";

type PlayPageProps = {
  params: Promise<{ sessionID: string }>;
};

type NarrativeState = {
  id: string;
  theme: string;
  currentChapter: string;
  awareness: number;
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
  status: string;
  storyBeat?: string;
  lastIntent?: string;
};

type NarrativeTurn = {
  id: string;
  role: "system" | "user" | "engine";
  content: string;
  intent?: string;
};

type SessionMessage = {
  id: string;
  role: string;
  content: string;
  intent?: string | null;
};

type NarrativeResponse = {
  assistantMessage: string;
  state: Pick<
    NarrativeState,
    | "currentChapter"
    | "awareness"
    | "energy"
    | "stress"
    | "teamTrust"
    | "missionProgress"
  >;
};

type SceneMeta = {
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage: string;
};

function getSceneMeta(
  currentChapter: string,
  theme: string
): SceneMeta {
  if (currentChapter === "debrief") {
    return {
      eyebrow: "Debrief",
      title: "Mission Debrief",
      description:
        "The work is settling into memory. What matters now is what the day meant, what held, and what nearly broke.",
      backgroundImage: "/images/astronaut/iss-window.jpg",
    };
  }

  if (currentChapter === "science_mission") {
    return {
      eyebrow: "Science Mission",
      title: "Operational Drift",
      description:
        "The checks are beginning to resolve into action. Observation, timing, and small choices now steer the rest of the day.",
      backgroundImage: "/images/astronaut/hygiene-breakfast.jpg",
    };
  }

  if (currentChapter === "system_check") {
    return {
      eyebrow: "System Check",
      title: "Systems Under Review",
      description:
        "The mission narrows into equipment, procedure, and attention. Small details now carry the weight of larger outcomes.",
      backgroundImage: "/images/astronaut/hygiene-breakfast.jpg",
    };
  }

  if (currentChapter === "briefing") {
    return {
      eyebrow: "Briefing",
      title: "Daily Briefing",
      description:
        "The mission has started to take shape. People, timing, and systems are beginning to align into a real operational rhythm.",
      backgroundImage: "/images/astronaut/daily-briefing.jpg",
    };
  }

  return {
    eyebrow: theme === "astronaut_day_v1" ? "Wake Up" : "Narrative Mode",
    title: "Wake Up",
    description:
      "The station wakes slowly around you. Light gathers across the module, Earth hangs beyond the glass, and the first minutes ask only for calm attention.",
    backgroundImage: "/images/astronaut/wakeup.jpg",
  };
}

function mapMessagesToTurns(messages: SessionMessage[]): NarrativeTurn[] {
  return messages.map((message) => ({
    id: message.id,
    role:
      message.role === "user"
        ? "user"
        : message.role === "assistant"
        ? "engine"
        : "system",
    content: message.content,
    intent: message.intent ?? undefined,
  }));
}

export default function PlayPage({ params }: PlayPageProps) {
  const { sessionID } = use(params);

  const [session, setSession] = useState<NarrativeState | null>(null);
  const [turns, setTurns] = useState<NarrativeTurn[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedPromptTip, setSelectedPromptTip] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionStateId = session?.id ?? null;
  const currentChapter = session?.currentChapter ?? null;

  const scene = session
    ? getSceneMeta(session.currentChapter, session.theme)
    : getSceneMeta("wake_up", "astronaut_day_v1");

  async function tryPlayAudio() {
    if (!audioRef.current || !isAudioEnabled) {
      return;
    }

    try {
      audioRef.current.volume = 0.75;
      await audioRef.current.play();
    } catch (audioError) {
      console.error("Audio autoplay blocked:", audioError);
    }
  }

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`/api/session/${sessionID}`);
        const data = (await response.json()) as {
          success?: boolean;
          session?: NarrativeState & { messages?: SessionMessage[] };
          error?: string;
        };

        if (!response.ok || !data.success || !data.session) {
          throw new Error(data.error || "Failed to load session");
        }

        setSession(data.session);
        setTurns(mapMessagesToTurns(data.session.messages ?? []));
      } catch (loadError) {
        console.error(loadError);
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load session."
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (sessionID) {
      loadSession();
    }
  }, [sessionID]);

  useEffect(() => {
    if (!isAudioEnabled && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isAudioEnabled]);

  useEffect(() => {
    if (!currentChapter) {
      return;
    }

    const flow = getAstronautStoryFlow(currentChapter);

    if (!flow) {
      setActiveNodeId(null);
      setSelectedPromptTip(null);
      return;
    }

    setActiveNodeId(flow.startNodeId);
    setSelectedPromptTip(null);
  }, [sessionStateId, currentChapter]);

  function handlePromptTipClick(option: string) {
    setInput(option);
    setSelectedPromptTip(option);
  }

  async function sendMessage() {
    if (!session || !input.trim() || isSaving) {
      return;
    }

    await tryPlayAudio();

    const message = input.trim();
    const submittedNodeId = activeNodeId;
    const selectedChoice = session
      ? getAstronautSelectedChoice(session.currentChapter, submittedNodeId, message)
      : null;
    const userTurn: NarrativeTurn = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    };

    setTurns((currentTurns) => [...currentTurns, userTurn]);
    setInput("");
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/experience/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
          message,
          nodeId: submittedNodeId,
        }),
      });

      const data = (await response.json()) as Partial<NarrativeResponse> & {
        error?: string;
      };

      if (!response.ok || !data.assistantMessage || !data.state) {
        throw new Error(data.error || "Failed to continue the narrative");
      }

      const nextState = {
        ...session,
        ...data.state,
      };
      const assistantMessage = data.assistantMessage;
      const nextNodeId =
        data.state.currentChapter !== session.currentChapter
          ? getAstronautStoryFlow(data.state.currentChapter)?.startNodeId ?? null
          : getNextAstronautNodeId(session.currentChapter, submittedNodeId, message);

      setSession(nextState);
      setActiveNodeId(nextNodeId);
      setSelectedPromptTip(null);
      setTurns((currentTurns) => [
        ...currentTurns,
        {
          id: `engine-${Date.now()}`,
          role: "engine",
          content: assistantMessage,
        },
      ]);
    } catch (submitError) {
      console.error(submitError);
      setTurns((currentTurns) =>
        currentTurns.filter((turn) => turn.id !== userTurn.id)
      );
      setInput(message);
      setSelectedPromptTip(selectedChoice?.label ?? selectedPromptTip);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to continue the narrative."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleAudio() {
    if (!audioRef.current) {
      return;
    }

    if (isAudioEnabled) {
      audioRef.current.pause();
      setIsAudioEnabled(false);
      return;
    }

    setIsAudioEnabled(true);
    try {
      audioRef.current.volume = 0.75;
      await audioRef.current.play();
    } catch (audioError) {
      console.error("Audio play failed:", audioError);
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

  if (error && !session) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-400">{error}</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-400">Session not found.</p>
        </div>
      </main>
    );
  }

  const activeNode = getAstronautStoryNode(session.currentChapter, activeNodeId);
  const promptTips = getAstronautPromptTips(session.currentChapter, activeNodeId);
  const promptLabel =
    activeNode?.sceneTitle ?? (session.currentChapter === "wake_up"
      ? "What do you do first?"
      : "What do you do next?");
  const promptHint =
    activeNode?.narration ??
    (session.currentChapter === "wake_up"
      ? "Take in the first quiet details of the station and respond naturally."
      : "Describe your next action naturally. The story will continue from there.");
  const placeholder =
    selectedPromptTip ??
    promptTips[0] ??
    (session.currentChapter === "wake_up"
      ? "I open my eyes and look toward the window."
      : "I drift toward the panel and begin checking the oxygen readout.");

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <BackgroundScene backgroundImage={scene.backgroundImage} />

      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/audio/astronaut/ambient-orbit.mp3"
      />

      <div className="relative z-10 min-h-screen px-6 pb-48 pt-6 md:px-8 md:pb-44 md:pt-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <AmbientControls
            isAudioEnabled={isAudioEnabled}
            onToggleAudio={toggleAudio}
          />

          <ChapterHeader
            eyebrow={scene.eyebrow}
            title={scene.title}
            objective={scene.description}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <ChatWindow turns={turns} isThinking={isSaving} />

            <StateIndicator
              missionProgress={session.missionProgress}
              stress={session.stress}
              energy={session.energy}
              awareness={session.awareness}
            />
          </div>
        </div>
      </div>

      <UserInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        onPromptTipClick={handlePromptTipClick}
        disabled={isSaving}
        error={error && session ? error : ""}
        isComplete={session.status === "complete" || session.missionProgress >= 100}
        resultHref={`/result/${sessionID}`}
        promptLabel={promptLabel}
        promptHint={promptHint}
        promptTips={promptTips}
        usedPromptTips={selectedPromptTip ? [selectedPromptTip] : []}
        placeholder={placeholder}
      />
    </main>
  );
}
