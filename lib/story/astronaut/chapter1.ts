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
  choices: NodeChoice[];
};

export const astronautChapter1StoryNodes: Record<string, StoryNode> = {
  wakeup: {
    id: "wakeup",
    chapterId: "chapter1",
    sceneTitle: "Wake Up",
    backgroundImage: "/images/astronaut/wakeup.jpg",
    narration:
      "06:00 GMT. A thin layer of fan noise hangs in the air like white noise that never fully ends. You wake inside your crew quarters, zipped into a sleeping bag fixed to the wall. For half a second, your body reaches for gravity and finds none. Outside the station, sunrise and sunset race past in quick succession, but your day does not begin with light — it begins with the schedule. In orbit, routine is not comfort. It is structure.",
    choices: [
      {
        id: "wakeup-work",
        label: "Unzip immediately and move into work mode",
        nextNodeId: "first_choice",
        effects: {
          missionProgress: 4,
          energy: -2,
        },
        flavor:
          "You choose discipline first. The body can catch up later.",
      },
      {
        id: "wakeup-window",
        label: "Push gently toward the window and steal one look at Earth",
        nextNodeId: "first_choice",
        effects: {
          stress: -4,
          energy: 2,
        },
        flavor:
          "You let yourself remember where you are before becoming useful again.",
      },
      {
        id: "wakeup-brief",
        label: "Pull up the day’s task summary before leaving your sleep station",
        nextNodeId: "first_choice",
        effects: {
          missionProgress: 3,
          teamTrust: 2,
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
    choices: [
      {
        id: "orientation-gear",
        label: "Tidy your sleep area and secure your personal gear first",
        nextNodeId: "microgravity",
        effects: {
          teamTrust: 2,
          missionProgress: 2,
        },
        flavor:
          "You believe professionalism starts with what nobody claps for.",
      },
      {
        id: "orientation-hygiene",
        label: "Head straight toward the hygiene area",
        nextNodeId: "microgravity",
        effects: {
          energy: 1,
          stress: -1,
        },
        flavor:
          "You reset the body so the mind can follow.",
      },
      {
        id: "orientation-ground",
        label: "Send a quick “awake and nominal” update to the ground",
        nextNodeId: "microgravity",
        effects: {
          teamTrust: 4,
          missionProgress: 1,
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
    choices: [
      {
        id: "microgravity-stabilize",
        label: "Catch a handrail and stabilize yourself before moving on",
        nextNodeId: "chapter1_end",
        effects: {
          stress: -2,
          missionProgress: 2,
        },
        flavor:
          "You choose control over style.",
      },
      {
        id: "microgravity-glide",
        label: "Use the drift and redirect yourself into the next module",
        nextNodeId: "chapter1_end",
        effects: {
          missionProgress: 3,
          energy: -1,
        },
        flavor:
          "You let the station’s physics work with you instead of against you.",
      },
      {
        id: "microgravity-joke",
        label: "Laugh it off and make a quick joke over comms",
        nextNodeId: "chapter1_end",
        effects: {
          stress: -3,
          teamTrust: 1,
        },
        flavor:
          "Competence is useful. So is keeping the room human.",
      },
    ],
  },

  chapter1_end: {
    id: "chapter1_end",
    chapterId: "chapter1",
    sceneTitle: "Morning Lock-In",
    backgroundImage: "/images/astronaut/wakeup.jpg",
    narration:
      "The first minutes of the day settle around you. The station no longer feels like something you entered this morning; it feels like a system you are now inside of. Your hands know where to go next. Your breathing has evened out. The romantic part of orbit is still there — somewhere beyond the hull, Earth is turning under you — but the workday has properly begun.",
    choices: [
      {
        id: "chapter1-to-chapter2",
        label: "Continue to hygiene and breakfast",
        nextNodeId: "hygiene_start",
        effects: {},
        flavor:
          "The day is still ordinary — which is exactly what makes it real.",
      },
    ],
  },
};