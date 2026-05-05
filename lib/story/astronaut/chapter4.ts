import type { StoryNode } from "./chapter1";

export const astronautChapter4StoryNodes: Record<string, StoryNode> = {
  systems_intro: {
    id: "systems_intro",
    chapterId: "chapter4",
    sceneTitle: "Systems Check",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "The station changes character again. This part of orbit is less poetic and more procedural.",
    blockType: "narration",
    autoAdvanceTo: "systems_start",
    choices: [],
  },

  systems_start: {
    id: "systems_start",
    chapterId: "chapter4",
    sceneTitle: "Systems Check",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "You drift into the equipment section and the station changes character again. This part of orbit is less poetic and more procedural: panels, cables, air movement, status lights, machine hum. Life support, environmental controls, circulation, interfaces — none of it is dramatic when it works, which is exactly why it has to be taken seriously. A space station does not stay alive by accident.",
    blockType: "open",
    openNextNodeId: "loose_fastener",
    suggestedPrompts: [
      "Work through the checklist carefully",
      "Check the critical systems first",
      "Speak observations into the log as you go",
    ],
    choices: [],
  },

  loose_fastener: {
    id: "loose_fastener",
    chapterId: "chapter4",
    sceneTitle: "A Small Imperfection",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "One fastening point catches your eye. It is not broken. It is simply not sitting where you want it to sit. On Earth, you might call it minor and move on. Up here, minor things deserve more respect. The most dangerous quality in a small problem is how easily it resembles something you can postpone.",
    blockType: "choice",
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
    blockType: "open",
    openNextNodeId: "reading_anomaly",
    suggestedPrompts: [
      "Go slowly and optimize for stability",
      "Push the pace and recover time",
      "Cross-check as you complete the test",
    ],
    choices: [],
  },

  reading_anomaly: {
    id: "reading_anomaly",
    chapterId: "chapter4",
    sceneTitle: "Slight Deviation",
    backgroundImage: "/images/astronaut/systems-check.jpg",
    narration:
      "A value sits just outside the range you expected. Not by much. Not enough to call it a failure. Enough to ask a question. This is the kind of moment that defines technical work in orbit: not obvious danger, but ambiguous deviation. The station is asking whether you can tell the difference between noise and signal.",
    blockType: "choice",
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
    blockType: "open",
    suggestedPrompts: [
        "Continue to science mission",
        "Pause and log the last findings",
        "Reset your focus for the next block",
    ],
    choices: [],
    },
};
