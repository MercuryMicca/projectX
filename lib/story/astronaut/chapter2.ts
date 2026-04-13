import type { StoryNode } from "./chapter1";

export const astronautChapter2StoryNodes: Record<string, StoryNode> = {
  hygiene_start: {
    id: "hygiene_start",
    chapterId: "chapter2",
    sceneTitle: "Hygiene",
    backgroundImage: "/images/astronaut/hygiene-breakfast.jpg",
    narration:
      "The hygiene station is less a bathroom than a compromise between biology and engineering. Nothing here is casual. You do not simply brush your teeth, rinse, and move on. Every object has to be put somewhere deliberate. Every small motion leaves behind a consequence if you do not finish it properly. In orbit, almost nothing ends when the action ends.",
    choices: [
      {
        id: "hygiene-standard",
        label: "Follow the standard routine carefully, step by step",
        nextNodeId: "hygiene_detail",
        effects: {
          teamTrust: 5,
          stress: -4,
          missionProgress: 2,
        },
        flavor:
          "You treat routine as a form of discipline, not inconvenience.",
      },
      {
        id: "hygiene-fast",
        label: "Move quickly and compress the routine to save time",
        nextNodeId: "hygiene_detail",
        effects: {
          missionProgress: 6,
          stress: 4,
          energy: -1,
        },
        flavor:
          "You are already thinking about the schedule more than the moment.",
      },
      {
        id: "hygiene-health-log",
        label: "Take an extra moment to log how your body feels this morning",
        nextNodeId: "hygiene_detail",
        effects: {
          missionProgress: 4,
          teamTrust: 4,
          stress: -1,
        },
        flavor:
          "You know that in space, small body signals deserve respect.",
      },
    ],
  },

  hygiene_detail: {
    id: "hygiene_detail",
    chapterId: "chapter2",
    sceneTitle: "Nothing is Casual",
    backgroundImage: "/images/astronaut/hygiene-breakfast.jpg",
    narration:
      "A tiny bead of water escapes where you did not intend it to. Your toothbrush does not stay where your hand leaves it. A wrapper rotates lazily unless you trap it. On Earth, many actions disappear the moment they are done. Here, every action demands a small act of closure. You are not struggling exactly. You are learning to finish every gesture all the way.",
    choices: [
      {
        id: "detail-tidy",
        label: "Pause and secure everything before moving on",
        nextNodeId: "breakfast",
        effects: {
          teamTrust: 5,
          missionProgress: 4,
        },
        flavor:
          "Professionalism begins in the quiet spaces where nobody is watching.",
      },
      {
        id: "detail-adapt",
        label: "Adjust smoothly and keep moving without overthinking it",
        nextNodeId: "breakfast",
        effects: {
          missionProgress: 6,
          energy: -3,
          stress: 1,
        },
        flavor:
          "You let adaptability do part of the work for you.",
      },
      {
        id: "detail-breathe",
        label: "Take one slow breath and let the rhythm of the station settle you",
        nextNodeId: "breakfast",
        effects: {
          stress: -5,
          energy: 3,
        },
        flavor:
          "The station is easier to live in when you stop trying to rush gravity back into it.",
      },
    ],
  },

  breakfast: {
    id: "breakfast",
    chapterId: "chapter2",
    sceneTitle: "Breakfast",
    backgroundImage: "/images/astronaut/hygiene-breakfast.jpg",
    narration:
      "Breakfast is practical, packaged, nutritionally competent — and just a little emotionally flat. It does its job. It does not feel like morning the way breakfast on Earth does. There is no kitchen warmth, no incidental abundance, no ceremony to it. And yet this is still how your day is fueled: one careful opening, one secured pouch, one efficient decision at a time.",
    choices: [
      {
        id: "breakfast-heavy",
        label: "Choose the higher-energy option and prepare for a long work block",
        nextNodeId: "toilet",
        effects: {
          energy: 7,
          stress: 2,
          missionProgress: 1,
        },
        flavor:
          "You are feeding the schedule, not the mood.",
      },
      {
        id: "breakfast-light",
        label: "Choose something lighter to keep your body feeling stable",
        nextNodeId: "toilet",
        effects: {
          energy: 4,
          stress: -4,
        },
        flavor:
          "You trust steadiness more than brute fuel.",
      },
      {
        id: "breakfast-briefing",
        label: "Eat while reviewing the task timeline again",
        nextNodeId: "toilet",
        effects: {
          missionProgress: 6,
          energy: 2,
          stress: 1,
        },
        flavor:
          "Even breakfast becomes part of preparation when the day is tight.",
      },
    ],
  },

  toilet: {
    id: "toilet",
    chapterId: "chapter2",
    sceneTitle: "Uncelebrated Procedures",
    backgroundImage: "/images/astronaut/hygiene-breakfast.jpg",
    narration:
      "There is one more task before the station fully becomes a workplace: the kind of private, procedural, unglamorous task that every astronaut does and nobody writes fan fiction about. Space does not excuse you from biology. It simply makes biology more procedural. Real maturity up here is not wonder — it is whether you are willing to take uncelebrated processes seriously.",
    choices: [
      {
        id: "toilet-careful",
        label: "Do it properly, with full attention to procedure",
        nextNodeId: "chapter2_end",
        effects: {
          teamTrust: 5,
          stress: -3,
          missionProgress: 2,
        },
        flavor:
          "You respect the system even when the moment feels undignified.",
      },
      {
        id: "toilet-rush",
        label: "Try to move through it quickly and get on with the day",
        nextNodeId: "chapter2_end",
        effects: {
          missionProgress: 4,
          stress: 5,
          teamTrust: -2,
        },
        flavor:
          "You push forward, but the station notices impatience.",
      },
      {
        id: "toilet-accept",
        label: "Accept it plainly: this is part of the profession too",
        nextNodeId: "chapter2_end",
        effects: {
          stress: -4,
          energy: 3,
          teamTrust: 2,
        },
        flavor:
          "Not every act of professionalism looks heroic.",
      },
    ],
  },

  chapter2_end: {
    id: "chapter2_end",
    chapterId: "chapter2",
    sceneTitle: "Morning Complete",
    backgroundImage: "/images/astronaut/hygiene-breakfast.jpg",
    narration:
      "Your morning routine is complete. Nothing dramatic has happened, and yet you already feel the difference between visiting orbit in imagination and living inside its rules. You have not even started the day’s real work, but the clock has moved anyway. Somewhere on the timeline ahead: system checks, experiment prep, exercise, coordination. The station is done waking up with you. It expects you to begin.",
    choices: [
      {
        id: "chapter2-to-chapter3",
        label: "Continue to daily briefing",
        nextNodeId: "briefing_start",
        effects: {},
        flavor:
          "The ordinary part of the morning is over. The workday is ready to take shape.",
      },
    ],
  },
};