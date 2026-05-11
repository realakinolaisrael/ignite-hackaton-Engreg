import { NextResponse } from "next/server";
import { getTimeline, updateTimelineItem } from "../../lib/timeline";

export const runtime = "nodejs";

export async function GET() {
  const timeline = await getTimeline();
  return NextResponse.json({ timeline });
}

export async function PATCH(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | { id?: string; started?: boolean }
    | null;

  if (!payload || typeof payload.id !== "string" || typeof payload.started !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await updateTimelineItem(payload.id, payload.started);
  if (!updated) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}
