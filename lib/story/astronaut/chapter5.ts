import type { StoryNode } from "./chapter1";

export const astronautChapter5StoryNodes: Record<string, StoryNode> = {
  science_start: {
    id: "science_start",
    chapterId: "chapter5",
    sceneTitle: "Science Mission",
    backgroundImage: "/images/astronaut/science-mission.jpg",
    narration:
      "The experiment rack is already powered and waiting. Earlier today, your job was to keep the station functioning. Here, the purpose shifts slightly: now your job is to keep the work meaningful. A sample container sits under the task light with a thin line of condensation on one edge. Inside your gloves, your fingers feel just clumsy enough to be irritating. That is normal. Precision in orbit rarely looks elegant. Most of the time, it just looks patient.",
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
          "Science is not a beautiful idea. Science is whether you respected step seven as much as step one.",
      },
      {
        id: "science-optimize-flow",
        label: "Read through the full sequence quickly, then optimize the flow",
        nextNodeId: "science_deviation",
        effects: {
          missionProgress: 4,
          stress: 2,
        },
        flavor:
          "You trust your own rhythm. Science, unfortunately, does not always share that trust.",
      },
      {
        id: "science-check-sample",
        label: "Check the most sensitive sample conditions first",
        nextNodeId: "science_deviation",
        effects: {
          missionProgress: 4,
          stress: -1,
        },
        flavor:
          "A whole experiment can look healthy while one tiny detail is quietly preparing to betray it.",
      },
    ],
  },

  science_deviation: {
    id: "science_deviation",
    chapterId: "chapter5",
    sceneTitle: "Unexpected Reading",
    backgroundImage: "/images/astronaut/science-mission.jpg",
    narration:
      "One reading comes back slightly off. Not disastrously wrong. Not politely ignorable either. Just wrong enough to become annoying. The number sits there on the display with the maddening calm of something that has no intention of explaining itself. This is the part of science people rarely romanticize: not discovery, but restraint. Not brilliance, but refusing to lie to yourself just because you want the run to stay clean.",
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
          "Before you assign meaning to the number, make sure it has actually earned one.",
      },
      {
        id: "deviation-continue-log",
        label: "Continue the run and log the anomaly in full detail",
        nextNodeId: "science_wrap",
        effects: {
          missionProgress: 5,
          stress: 2,
        },
        flavor:
          "Not every deviation deserves panic. Every deviation deserves honesty.",
      },
      {
        id: "deviation-call-ground",
        label: "Call the ground and wait for guidance before proceeding",
        nextNodeId: "science_wrap",
        effects: {
          teamTrust: 5,
          missionProgress: 1,
        },
        flavor:
          "Fast is useful. Shared confidence is usually more useful.",
      },
    ],
  },

  science_wrap: {
    id: "science_wrap",
    chapterId: "chapter5",
    sceneTitle: "Wrap-Up",
    backgroundImage: "/images/astronaut/science-mission.jpg",
    narration:
      "The experiment block closes in the least cinematic way possible: clips secured, surfaces cleaned, data saved, containers back where they belong. And yet that small lack of drama is exactly what makes it satisfying. Good work in orbit often looks unimpressive from the outside. Inside it, though, you can feel the difference between something merely finished and something properly closed. There is still a little time left in the day. Enough to use well. Not enough to pretend it doesn't matter.",
    choices: [
      {
        id: "wrap-debrief",
        label: "Write today’s debrief and tomorrow’s notes first",
        nextNodeId: "final_question",
        effects: {
          missionProgress: 4,
          teamTrust: 2,
        },
        flavor:
          "A task is not really finished until someone has made it useful for the next person — even if that person is also you.",
      },
      {
        id: "wrap-supplies",
        label: "Check remaining supplies and consumables before closing out",
        nextNodeId: "final_question",
        effects: {
          missionProgress: 3,
          teamTrust: 3,
        },
        flavor:
          "A surprising amount of stability is just careful people counting boring things on time.",
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
          "You are not avoiding work. You are briefly remembering what all this work is for.",
      },
    ],
  },

  final_question: {
    id: "final_question",
    chapterId: "chapter5",
    sceneTitle: "Night Cycle",
    backgroundImage: "/images/astronaut/earth-window.jpg",
    narration:
      "The lights begin their slow shift toward night mode. The station does not really sleep; it just lowers its voice. Maybe that is true of people up here too. You did not save the world today. You did something quieter than that. You helped a fragile system remain useful, honest, and alive one more day above the planet that sent you here. Before the day closes completely, one thought stays with you longer than the others.",
    choices: [
      {
        id: "result-calm-operator",
        label: "Keep everything steady",
        nextNodeId: "chapter5_end",
        effects: {
          missionProgress: 1,
        },
        flavor:
          "You do not need heroics. You need things to stay where they should, behave as they should, and not suddenly invent new problems.",
      },
      {
        id: "result-precision-scientist",
        label: "Protect the integrity of the data",
        nextNodeId: "chapter5_end",
        effects: {
          missionProgress: 1,
        },
        flavor:
          "A pretty result is optional. An honest result is not.",
      },
      {
        id: "result-team-anchor",
        label: "Stay aligned with the people behind the mission",
        nextNodeId: "chapter5_end",
        effects: {
          teamTrust: 2,
        },
        flavor:
          "No mission this complicated is ever really about one person being brilliant in a corner.",
      },
      {
        id: "result-adaptive-problem-solver",
        label: "Meet uncertainty without flinching",
        nextNodeId: "chapter5_end",
        effects: {
          stress: -1,
          energy: 1,
        },
        flavor:
          "You do not need the day to behave itself. You just need yourself to.",
      },
    ],
  },

  chapter5_end: {
    id: "chapter5_end",
    chapterId: "chapter5",
    sceneTitle: "Day Complete",
    backgroundImage: "/images/astronaut/earth-window.jpg",
    narration:
      "The day is complete. Outside, Earth continues turning with or without witness. Inside, the station keeps doing what it was built to do: hold, circulate, support, endure. Today, so did you. Not as a symbol. Not as a poster. Just as a person who showed up, paid attention, and carried a small portion of responsibility well. In orbit, that is not small. Your result is ready.",
    choices: [],
  },
};