import type { StoryNode } from "./chapter1";

export const astronautChapter5StoryNodes: Record<string, StoryNode> = {
  science_start: {
    id: "science_start",
    chapterId: "chapter5",
    sceneTitle: "Science Mission",
    backgroundImage: "/images/astronaut/science-mission.jpg",
    narration:
      "The experiment module carries a different kind of silence. The station still hums around you — fans, systems, circulation, the quiet proof that a machine is holding human life together — but here the purpose shifts. Earlier, you were protecting function. Here, you are protecting meaning. Sample containers sit secured in their rack, one edge silvered by a trace of condensation. Through your gloves, every motion feels half a beat slower than instinct wants it to be. You know better than to resent that. Science has never cared about how quickly a hand wishes to move. Only whether it moved well enough to be trusted.",
    choices: [
      {
        id: "science-follow-steps",
        label: "Follow the procedure exactly, step by step",
        nextNodeId: "science_deviation",
        effects: {
          missionProgress: 5,
          teamTrust: 2,
        },
        flavor:
          "Good science is not elegance. It is whether you respected the seventh step as much as the first.",
      },
      {
        id: "science-optimize-flow",
        label: "Quickly read through and optimize the sequence your own way",
        nextNodeId: "science_deviation",
        effects: {
          missionProgress: 4,
          stress: 2,
        },
        flavor:
          "You trust your competence enough to bend the rhythm, even while knowing science punishes vanity.",
      },
      {
        id: "science-check-sample",
        label: "Confirm the most sensitive sample conditions first",
        nextNodeId: "science_deviation",
        effects: {
          missionProgress: 4,
          stress: -1,
        },
        flavor:
          "You know a whole experiment can appear healthy while one fragile detail quietly decides its fate.",
      },
    ],
  },

  science_deviation: {
    id: "science_deviation",
    chapterId: "chapter5",
    sceneTitle: "Unexpected Reading",
    backgroundImage: "/images/astronaut/science-mission.jpg",
    narration:
      "One data point comes back wrong — not dramatically, not catastrophically, only slightly outside the shape you hoped to see. The number is close enough to tempt indifference and far enough to forbid it. This is the part of science most people never imagine: not discovery, but discipline; not brilliance, but restraint. You feel the familiar pull to explain it away, to keep momentum, to preserve the beauty of an uninterrupted run. But beauty is not the standard here. Integrity is. Not every deviation deserves alarm. But every deviation deserves respect.",
    choices: [
      {
        id: "deviation-pause-check",
        label: "Pause and inspect the setup before continuing",
        nextNodeId: "science_wrap",
        effects: {
          missionProgress: 3,
          teamTrust: 3,
          stress: -1,
        },
        flavor:
          "You would rather lose a little time than let uncertainty borrow authority it has not earned.",
      },
      {
        id: "deviation-continue-log",
        label: "Continue the run and record the anomaly in detail",
        nextNodeId: "science_wrap",
        effects: {
          missionProgress: 5,
          stress: 2,
        },
        flavor:
          "You choose continuity, but only with the honesty to let the deviation stay visible.",
      },
      {
        id: "deviation-call-ground",
        label: "Contact the ground immediately and wait for guidance",
        nextNodeId: "science_wrap",
        effects: {
          teamTrust: 5,
          missionProgress: 1,
        },
        flavor:
          "You trade speed for shared certainty, and accept that confidence does not have to be solitary.",
      },
    ],
  },

  science_wrap: {
    id: "science_wrap",
    chapterId: "chapter5",
    sceneTitle: "Wrap-Up",
    backgroundImage: "/images/astronaut/science-mission.jpg",
    narration:
      "The run closes quietly. Data is logged. Surfaces are secured. Containers return to their places with the small, satisfying finality of work done properly. There is still a little time left in the day — not enough for grandeur, enough for intention. This is often what a meaningful day becomes in orbit: not one great triumph, but a series of things finished with care. You can close the day forward, close it practically, or let yourself reclaim one minute that belongs less to procedure and more to being alive inside all this machinery.",
    choices: [
      {
        id: "wrap-debrief",
        label: "Write today’s debrief and tomorrow’s plan first",
        nextNodeId: "final_question",
        effects: {
          missionProgress: 4,
          teamTrust: 2,
        },
        flavor:
          "You believe the day is not truly complete until what it taught can outlive the day itself.",
      },
      {
        id: "wrap-supplies",
        label: "Confirm supplies and consumables before closing out",
        nextNodeId: "final_question",
        effects: {
          missionProgress: 3,
          teamTrust: 3,
        },
        flavor:
          "You understand that tomorrow is protected by the quiet seriousness of what you verify today.",
      },
      {
        id: "wrap-earth",
        label: "Drift to the window and look at Earth for one minute",
        nextNodeId: "final_question",
        effects: {
          stress: -6,
          energy: 3,
        },
        flavor:
          "You do not go to the window because you have earned beauty. You go because perspective is also a form of maintenance.",
      },
    ],
  },

  final_question: {
    id: "final_question",
    chapterId: "chapter5",
    sceneTitle: "Night Cycle",
    backgroundImage: "/images/astronaut/earth-window.jpg",
    narration:
      "The lights begin their slow shift toward sleep mode. Nothing in the station truly stops; it only changes rhythm. The same is true of you. You did not save the world today. You did something quieter, and perhaps more difficult: you helped a fragile system remain worthy of trust for one more day, far above the people it ultimately serves. There is dignity in that, even if no one ever sees it clearly from the ground. Before the day closes completely, one question remains — not about what happened, but about what it meant.",
    choices: [
      {
        id: "result-calm-operator",
        label: "What mattered most today was keeping everything steady.",
        nextNodeId: "chapter5_end",
        effects: {
          missionProgress: 1,
        },
        flavor:
          "You find meaning in steadiness — in the quiet refusal to let things drift into avoidable disorder.",
      },
      {
        id: "result-precision-scientist",
        label: "What mattered most today was protecting the integrity of the data.",
        nextNodeId: "chapter5_end",
        effects: {
          missionProgress: 1,
        },
        flavor:
          "You find meaning in truth — in giving the unknown an answer it can trust.",
      },
      {
        id: "result-team-anchor",
        label: "What mattered most today was staying aligned with the people behind the mission.",
        nextNodeId: "chapter5_end",
        effects: {
          teamTrust: 2,
        },
        flavor:
          "You find meaning in connection — in remembering that no mission is ever carried by one person alone.",
      },
      {
        id: "result-adaptive-problem-solver",
        label: "What mattered most today was meeting uncertainty without flinching.",
        nextNodeId: "chapter5_end",
        effects: {
          stress: -1,
          energy: 1,
        },
        flavor:
          "You find meaning in judgment — in standing still long enough to see clearly when things become uncertain.",
      },
    ],
  },

  chapter5_end: {
    id: "chapter5_end",
    chapterId: "chapter5",
    sceneTitle: "Day Complete",
    backgroundImage: "/images/astronaut/earth-window.jpg",
    narration:
      "The day is complete. Outside, Earth goes on turning beneath you with or without witness. Inside, the station continues its endless work of holding, circulating, supporting, enduring. You were part of that today — not as a symbol, but as a person who showed up, paid attention, and carried a small portion of responsibility well. That is enough. More than enough. Your result is ready.",
    choices: [],
  },
};