export type StatEffects = {
  missionProgress?: number;
  stress?: number;
  teamTrust?: number;
  energy?: number;
};

export type NodeChoice = {
  id: string;
  label: string;
  nextNodeId: string;
  effects: StatEffects;
  flavor?: string;
};

export type StoryNode = {
  id: string;
  chapterId: string;
  sceneTitle: string;
  backgroundImage: string;
  narration: string;
  blockType?: "choice" | "narration" | "open";
  autoAdvanceTo?: string | null;
  openNextNodeId?: string | null;
  suggestedPrompts?: string[];
  choices: NodeChoice[];
};

export const astronautChapter1StoryNodes: Record<string, StoryNode> = {
  wakeup_intro: {
    id: "wakeup_intro",
    chapterId: "chapter1",
    sceneTitle: "Wake Up",
    backgroundImage: "/images/astronaut/wakeup.jpg",
    narration:
      "A thin layer of fan noise fills the quarters before thought fully returns. For a second, your body reaches for gravity and finds none.",
    blockType: "narration",
    autoAdvanceTo: "wakeup",
    choices: [],
  },

  wakeup: {
    id: "wakeup",
    chapterId: "chapter1",
    sceneTitle: "Wake Up",
    backgroundImage: "/images/astronaut/wakeup.jpg",
    narration:
      "You wake inside your crew quarters, zipped into a sleeping bag fixed to the wall. Outside the station, sunrise and sunset are already racing past, but your day begins with something quieter than spectacle.",
    blockType: "choice",
    choices: [
      {
        id: "wakeup-work",
        label: "Unzip immediately and move into work mode",
        nextNodeId: "first_choice",
        effects: {
          missionProgress: 7,
          energy: -4,
          stress: 2,
        },
        flavor:
          "You choose discipline first. The body can catch up later.",
      },
      {
        id: "wakeup-window",
        label: "Push gently toward the window and steal one look at Earth",
        nextNodeId: "first_choice",
        effects: {
          stress: -6,
          energy: 4,
          missionProgress: -1,
        },
        flavor:
          "You let yourself remember where you are before becoming useful again.",
      },
      {
        id: "wakeup-brief",
        label: "Pull up the day's task summary before leaving your sleep station",
        nextNodeId: "first_choice",
        effects: {
          missionProgress: 5,
          teamTrust: 4,
        },
        flavor:
          "You want orientation before motion. Order before momentum.",
      },
    ],
  },

  first_choice: {
    id: "first_choice",
    chapterId: "chapter1",
    sceneTitle: "Orientation",
    backgroundImage: "/images/astronaut/wakeup.jpg",
    narration:
      "You ease yourself out of the sleep station and into the narrow corridor beyond. In microgravity, morning is less about standing up than re-establishing your relationship with direction. There is no floor, only habit. A task board is already synced. Somewhere deeper in the station, someone is already working.",
    blockType: "choice",
    choices: [
      {
        id: "orientation-gear",
        label: "Tidy your sleep area and secure your personal gear first",
        nextNodeId: "microgravity",
        effects: {
          teamTrust: 5,
          missionProgress: 4,
        },
        flavor:
          "You believe professionalism starts with what nobody claps for.",
      },
      {
        id: "orientation-hygiene",
        label: "Head straight toward the hygiene area",
        nextNodeId: "microgravity",
        effects: {
          energy: 4,
          stress: -4,
        },
        flavor:
          "You reset the body so the mind can follow.",
      },
      {
        id: "orientation-ground",
        label: "Send a quick “awake and nominal” update to the ground",
        nextNodeId: "microgravity",
        effects: {
          teamTrust: 7,
          missionProgress: 3,
          energy: -1,
        },
        flavor:
          "In orbit, confirmation is part of the work.",
      },
    ],
  },

  microgravity: {
    id: "microgravity",
    chapterId: "chapter1",
    sceneTitle: "Body in Motion",
    backgroundImage: "/images/astronaut/wakeup.jpg",
    narration:
      "You pivot toward the next module and your elbow brushes the wall. That is all it takes. Your body glides slowly sideways, more elegant than intended and less controlled than you would like. This is one of the quiet truths of orbit: big mistakes are rare, but tiny ones never stop asking for attention.",
    blockType: "open",
    openNextNodeId: "chapter1_end",
    suggestedPrompts: [
      "Catch a handrail and steady yourself",
      "Use the drift and guide yourself forward",
      "Pause and get your bearings before moving",
    ],
    choices: [],
  },

  chapter1_end: {
    id: "chapter1_end",
    chapterId: "chapter1",
    sceneTitle: "Morning Lock-In",
    backgroundImage: "/images/astronaut/wakeup.jpg",
    narration:
      "The first minutes of the day settle around you. The station no longer feels like something you entered this morning; it feels like a system you are now inside of. Your hands know where to go next. Your breathing has evened out. The romantic part of orbit is still there — somewhere beyond the hull, Earth is turning under you — but the workday has properly begun.",
    blockType: "open",
    suggestedPrompts: [
      "Continue to hygiene and breakfast",
      "Take one last look outside before moving on",
      "Center yourself and begin the workday",
    ],
    choices: [],
  },
};
