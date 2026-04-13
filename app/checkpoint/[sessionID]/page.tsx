"use client";

import { useEffect, useState } from "react";
import StatusBar from "../../../components/StatusBar";

type CheckpointPageProps = {
  params: Promise<{ sessionID: string }>;
};

type SessionData = {
  id: string;
  currentChapter: string;
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
};

function getCheckpointMessage(session: SessionData) {
  if (session.currentChapter === "final") {
    return "Your first mission block is complete. The station is stable, your work is logged, and your next evaluation is ready.";
  }

  return "Your mission is still in progress. Review your current status before continuing.";
}

export default function CheckpointPage({ params }: CheckpointPageProps) {
  const [sessionID, setSessionID] = useState("");
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
          throw new Error(data.error || "Failed to load checkpoint");
        }

        setSession(data.session);
      } catch (err) {
        console.error(err);
        setError("Failed to load checkpoint.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [params]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/70">Loading checkpoint...</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-400">{error || "Checkpoint not found."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/40 mb-2">
            Checkpoint
          </p>
          <h1 className="text-3xl font-bold">Mission Status</h1>
          <p className="text-white/60 mt-2">Session: {sessionID}</p>
        </div>

        <StatusBar
          missionProgress={session.missionProgress}
          stress={session.stress}
          teamTrust={session.teamTrust}
          energy={session.energy}
        />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50 mb-3">Checkpoint Summary</p>
          <p className="text-lg leading-8 text-white/90">
            {getCheckpointMessage(session)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50 mb-3">Current Chapter</p>
          <p className="text-white/90">{session.currentChapter}</p>
        </div>

        <div className="flex gap-3">
          <a
            href={`/play/${sessionID}`}
            className="inline-block rounded-xl bg-white/10 text-white px-6 py-3 font-medium hover:bg-white/15"
          >
            Back to Mission
          </a>

          <a
            href={`/result/${sessionID}`}
            className="inline-block rounded-xl bg-white text-black px-6 py-3 font-medium hover:opacity-90"
          >
            View Result
          </a>
        </div>
      </div>
    </main>
  );
}