import type { StoryNode } from "./chapter1";

export const astronautChapter3StoryNodes: Record<string, StoryNode> = {
  briefing_intro: {
    id: "briefing_intro",
    chapterId: "chapter3",
    sceneTitle: "Daily Briefing",
    backgroundImage: "/images/astronaut/daily-briefing.jpg",
    narration:
      "By now the station has fully crossed the line from shelter into workplace. The day is no longer beginning. It is arranging itself around consequences.",
    blockType: "narration",
    autoAdvanceTo: "briefing_start",
    choices: [],
  },

  briefing_start: {
    id: "briefing_start",
    chapterId: "chapter3",
    sceneTitle: "Daily Briefing",
    backgroundImage: "/images/astronaut/daily-briefing.jpg",
    narration:
      "The station has fully crossed the line from home to workplace. A message packet from the ground is already waiting: today's primary blocks are systems check, experiment prep, and a time-fixed exercise session. None of them are dramatic. All of them matter. In orbit, work rarely announces itself as urgent. It simply becomes expensive if you treat it casually.",
    blockType: "open",
    openNextNodeId: "time_conflict",
    suggestedPrompts: [
      "Open the systems check first",
      "Review the experiment procedure first",
      "Confirm priorities with the ground first",
    ],
    choices: [],
  },

  time_conflict: {
    id: "time_conflict",
    chapterId: "chapter3",
    sceneTitle: "Timeline Pressure",
    backgroundImage: "/images/astronaut/daily-briefing.jpg",
    narration:
      "As you compare the task blocks, a small scheduling conflict becomes obvious. The experiment setup window presses up against the maintenance timeline more tightly than you would like. Nothing is failing. Nothing is on fire. And yet the day has already become more fragile. This is what real work often feels like in orbit: not danger, but compression.",
    blockType: "choice",
    choices: [
      {
        id: "conflict-protect-systems",
        label: "Protect the systems check and push the experiment later",
        nextNodeId: "teammate_ping",
        effects: {
          teamTrust: 3,
          missionProgress: 2,
        },
        flavor:
          "You would rather disappoint the timeline than the station.",
      },
      {
        id: "conflict-push-forward",
        label: "Take the experiment window now and compress the rest of the day",
        nextNodeId: "teammate_ping",
        effects: {
          missionProgress: 4,
          stress: 3,
        },
        flavor:
          "You are choosing momentum, knowing it may cost you later.",
      },
      {
        id: "conflict-realign",
        label: "Ask the ground for a small reordering before committing",
        nextNodeId: "teammate_ping",
        effects: {
          teamTrust: 5,
          stress: -1,
        },
        flavor:
          "You treat coordination as part of execution, not as delay.",
      },
    ],
  },

  teammate_ping: {
    id: "teammate_ping",
    chapterId: "chapter3",
    sceneTitle: "Crew Coordination",
    backgroundImage: "/images/astronaut/daily-briefing.jpg",
    narration:
      "A crewmate checks in over comms. They are heading toward a nearby maintenance task and ask whether you want to knock out a small item together while you're both in the same area. It is efficient, but it will disturb the neat version of the day you just built in your head. Space stations do not run on individual perfection. They run on cooperative compromise.",
    blockType: "open",
    openNextNodeId: "chapter3_end",
    suggestedPrompts: [
      "Say yes and handle it together now",
      "Stick to your own planned order",
      "Suggest doing it together a little later",
    ],
    choices: [],
  },

    chapter3_end: {
    id: "chapter3_end",
    chapterId: "chapter3",
    sceneTitle: "Workday Locked",
    backgroundImage: "/images/astronaut/daily-briefing.jpg",
    narration:
        "The shape of the day has settled. Not perfectly, but enough. Priorities are clear, trade-offs have been made, and the station now feels less like a place you are moving through and more like a system you are helping govern. Ahead of you waits the first truly technical block of the day: real checks, real readings, real judgment. The work is about to become less abstract.",
    blockType: "open",
    suggestedPrompts: [
        "Continue to systems check",
        "Mentally review the priorities once more",
        "Move toward the equipment section",
    ],
    choices: [],
    },
};
