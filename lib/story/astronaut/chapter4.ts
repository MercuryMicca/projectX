import type { StoryNode } from "./chapter1";

export const astronautChapter4StoryNodes: Record<string, StoryNode> = {
  systems_start: {
    id: "systems_start",
    chapterId: "chapter4",
    sceneTitle: "Systems Check",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "You drift into the equipment section and the station changes character again. This part of orbit is less poetic and more procedural: panels, cables, air movement, status lights, machine hum. Life support, environmental controls, circulation, interfaces — none of it is dramatic when it works, which is exactly why it has to be taken seriously. A space station does not stay alive by accident.",
    choices: [
      {
        id: "systems-checklist",
        label: "Work strictly through the checklist, one item at a time",
        nextNodeId: "loose_fastener",
        effects: {
          teamTrust: 4,
          missionProgress: 3,
        },
        flavor:
          "You trust process not because it is rigid, but because it keeps people alive.",
      },
      {
        id: "systems-critical-first",
        label: "Check the most failure-prone critical items first",
        nextNodeId: "loose_fastener",
        effects: {
          missionProgress: 5,
          stress: 1,
        },
        flavor:
          "You prioritize exposure and risk before completeness.",
      },
      {
        id: "systems-voice-log",
        label: "Inspect while speaking your observations into the log",
        nextNodeId: "loose_fastener",
        effects: {
          missionProgress: 3,
          teamTrust: 2,
        },
        flavor:
          "You treat clarity as part of execution.",
      },
    ],
  },

  loose_fastener: {
    id: "loose_fastener",
    chapterId: "chapter4",
    sceneTitle: "A Small Imperfection",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "One fastening point catches your eye. It is not broken. It is simply not sitting where you want it to sit. On Earth, you might call it minor and move on. Up here, minor things deserve more respect. The most dangerous quality in a small problem is how easily it resembles something you can postpone.",
    choices: [
      {
        id: "fastener-fix-now",
        label: "Stop and handle it immediately",
        nextNodeId: "manual_test",
        effects: {
          missionProgress: 4,
          teamTrust: 3,
          energy: -2,
        },
        flavor:
          "You would rather spend effort now than uncertainty later.",
      },
      {
        id: "fastener-mark-later",
        label: "Mark it, finish the main inspection, and return afterward",
        nextNodeId: "manual_test",
        effects: {
          missionProgress: 3,
          stress: 1,
        },
        flavor:
          "You protect flow, but you are now carrying one loose thread in your mind.",
      },
      {
        id: "fastener-report-photo",
        label: "Document it and send a photo to the ground for confirmation",
        nextNodeId: "manual_test",
        effects: {
          teamTrust: 5,
          missionProgress: 2,
        },
        flavor:
          "You make the system wider by bringing more eyes into the judgment.",
      },
    ],
  },

  manual_test: {
    id: "manual_test",
    chapterId: "chapter4",
    sceneTitle: "Manual Verification",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "The next task is brief but exacting: a manual confirmation step that does not take long, but punishes impatience. Your hands move slower than your instincts want them to. You can feel the difference between being fast and being precise, and you know only one of those is useful here.",
    choices: [
      {
        id: "manual-steady",
        label: "Go slowly and optimize for stability",
        nextNodeId: "reading_anomaly",
        effects: {
          teamTrust: 3,
          stress: -2,
        },
        flavor:
          "You are not trying to impress the timeline. You are trying to respect the machine.",
      },
      {
        id: "manual-fast",
        label: "Push the pace and recover time where you can",
        nextNodeId: "reading_anomaly",
        effects: {
          missionProgress: 4,
          stress: 2,
        },
        flavor:
          "You are betting that competence can outrun pressure.",
      },
      {
        id: "manual-crosscheck",
        label: "Complete the test while cross-checking previous readings",
        nextNodeId: "reading_anomaly",
        effects: {
          missionProgress: 5,
          energy: -2,
        },
        flavor:
          "You are stacking accuracy onto accuracy, even if it costs you.",
      },
    ],
  },

  reading_anomaly: {
    id: "reading_anomaly",
    chapterId: "chapter4",
    sceneTitle: "Slight Deviation",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "A value sits just outside the range you expected. Not by much. Not enough to call it a failure. Enough to ask a question. This is the kind of moment that defines technical work in orbit: not obvious danger, but ambiguous deviation. The station is asking whether you can tell the difference between noise and signal.",
    choices: [
      {
        id: "anomaly-retest",
        label: "Retest the reading before assigning meaning to it",
        nextNodeId: "chapter4_end",
        effects: {
          missionProgress: 3,
          stress: -1,
        },
        flavor:
          "You refuse to confuse first impressions with evidence.",
      },
      {
        id: "anomaly-report",
        label: "Escalate it to the ground immediately",
        nextNodeId: "chapter4_end",
        effects: {
          teamTrust: 5,
          stress: 1,
        },
        flavor:
          "You favor transparency over private confidence.",
      },
      {
        id: "anomaly-history",
        label: "Compare it against previous trend data before deciding",
        nextNodeId: "chapter4_end",
        effects: {
          missionProgress: 4,
          energy: -1,
        },
        flavor:
          "You believe context is what turns data into judgment.",
      },
    ],
  },

  chapter4_end: {
    id: "chapter4_end",
    chapterId: "chapter4",
    sceneTitle: "Inspection Complete",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "The inspection block closes without spectacle, which is its own kind of success. Nothing dramatic needed to happen for your work to matter. The station is still breathing, still circulating, still holding together around the crew because a hundred quiet checks were taken seriously. Ahead lies the next shift in the day: science. Less maintenance, more interpretation. Different tools, same responsibility.",
    choices: [
      {
        id: "chapter4-to-chapter5",
        label: "Continue to science mission",
        nextNodeId: "science_start",
        effects: {},
        flavor:
          "You leave the machine stable behind you and move toward the questions it exists to help answer.",
      },
    ],
  },
};