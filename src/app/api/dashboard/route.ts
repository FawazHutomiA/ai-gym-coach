import { NextResponse } from "next/server";
import { getDashboardPayload } from "@/lib/data/dashboard-payload";
import { requireAppFeature } from "@/lib/auth/require-app-feature";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAppFeature("feature.dashboard");
  if (!guard.ok) return guard.response;
  const session = guard.session;

  try {
    const data = await getDashboardPayload(session.user.id, session.user.name ?? "");
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
