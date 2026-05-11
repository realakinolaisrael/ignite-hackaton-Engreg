import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type TimelineItem = {
  id: string;
  title: string;
  started: boolean;
  updatedAt: string;
};

const defaultTitles = [
  "Registration Opens",
  "Team Formation",
  "Training Sessions",
  "Coding Challenge",
  "Final Presentation",
  "Winner Announcement",
];

const timelineFile = path.join(process.cwd(), "data", "timeline.json");

async function ensureFile() {
  await mkdir(path.dirname(timelineFile), { recursive: true });
  try {
    await readFile(timelineFile, "utf8");
  } catch {
    const initial: TimelineItem[] = defaultTitles.map((t) => ({
      id: randomUUID(),
      title: t,
      started: false,
      updatedAt: new Date().toISOString(),
    }));
    await writeFile(timelineFile, JSON.stringify(initial, null, 2) + "\n", "utf8");
  }
}

async function readTimeline(): Promise<TimelineItem[]> {
  await ensureFile();
  try {
    const raw = await readFile(timelineFile, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

async function writeTimeline(items: TimelineItem[]) {
  await ensureFile();
  await writeFile(timelineFile, JSON.stringify(items, null, 2) + "\n", "utf8");
}

export async function getTimeline() {
  return readTimeline();
}

export async function updateTimelineItem(id: string, started: boolean) {
  const items = await readTimeline();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], started, updatedAt: new Date().toISOString() };
  await writeTimeline(items);
  return items[idx];
}
