import {
  astronautChapter1StoryNodes,
  type NodeChoice,
  type StoryNode,
} from "./chapter1";
import { astronautChapter2StoryNodes } from "./chapter2";
import { astronautChapter3StoryNodes } from "./chapter3";
import { astronautChapter4StoryNodes } from "./chapter4";
import { astronautChapter5StoryNodes } from "./chapter5";

export type AstronautStoryFlow = {
  flowId: string;
  chapterKeys: string[];
  startNodeId: string;
  nodes: Record<string, StoryNode>;
};

const astronautStoryFlows: AstronautStoryFlow[] = [
  {
    flowId: "chapter1",
    chapterKeys: ["wake_up", "wakeup", "chapter1"],
    startNodeId: "wakeup",
    nodes: astronautChapter1StoryNodes,
  },
  {
    flowId: "chapter2",
    chapterKeys: ["chapter2"],
    startNodeId: "hygiene_start",
    nodes: astronautChapter2StoryNodes,
  },
  {
    flowId: "chapter3",
    chapterKeys: ["briefing", "chapter3"],
    startNodeId: "briefing_start",
    nodes: astronautChapter3StoryNodes,
  },
  {
    flowId: "chapter4",
    chapterKeys: ["system_check", "chapter4"],
    startNodeId: "systems_start",
    nodes: astronautChapter4StoryNodes,
  },
  {
    flowId: "chapter5",
    chapterKeys: ["science_mission", "chapter5"],
    startNodeId: "science_start",
    nodes: astronautChapter5StoryNodes,
  },
];

export function getAstronautStoryFlow(chapterKey: string) {
  return (
    astronautStoryFlows.find((flow) => flow.chapterKeys.includes(chapterKey)) ?? null
  );
}

export function getAstronautStoryNode(
  chapterKey: string,
  nodeId?: string | null
) {
  const flow = getAstronautStoryFlow(chapterKey);

  if (!flow) {
    return null;
  }

  const resolvedNodeId = nodeId ?? flow.startNodeId;
  return flow.nodes[resolvedNodeId] ?? flow.nodes[flow.startNodeId] ?? null;
}

export function getAstronautPromptTips(
  chapterKey: string,
  nodeId?: string | null
) {
  const node = getAstronautStoryNode(chapterKey, nodeId);
  if (!node) {
    return [];
  }

  if (node.choices.length > 0) {
    return node.choices.map((choice) => choice.label);
  }

  return node.suggestedPrompts ?? [];
}

export function getNextAstronautNodeId(
  chapterKey: string,
  nodeId: string | null | undefined,
  selectedLabel: string
) {
  const node = getAstronautStoryNode(chapterKey, nodeId);

  if (!node) {
    return null;
  }

  if (node.blockType === "open") {
    return node.openNextNodeId ?? null;
  }

  if (node.choices.length === 0) {
    return null;
  }

  const normalizedLabel = selectedLabel.trim().toLowerCase();
  const matchedChoice =
    node.choices.find(
      (choice) => choice.label.trim().toLowerCase() === normalizedLabel
    ) ?? node.choices[0];

  return matchedChoice?.nextNodeId ?? null;
}

export function getAstronautSelectedChoice(
  chapterKey: string,
  nodeId: string | null | undefined,
  selectedLabel: string
): NodeChoice | null {
  const node = getAstronautStoryNode(chapterKey, nodeId);

  if (!node) {
    return null;
  }

  const normalizedLabel = selectedLabel.trim().toLowerCase();
  return (
    node.choices.find(
      (choice) => choice.label.trim().toLowerCase() === normalizedLabel
    ) ?? null
  );
}
