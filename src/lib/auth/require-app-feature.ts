import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { userHasAppFeature } from "@/lib/auth/app-features";

export type AppFeatureGuardResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

export async function requireAppFeature(featureKey: string): Promise<AppFeatureGuardResult> {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const allowed = await userHasAppFeature(session.user.role, featureKey);
  if (!allowed) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, session };
}
