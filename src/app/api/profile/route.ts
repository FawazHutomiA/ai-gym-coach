import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { bodyMetricEntries, userProfiles, users } from "@/db/schema";
import { requireAppFeature } from "@/lib/auth/require-app-feature";

const patchSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional().default(""),
  goal: z.enum(["cutting", "bulking", "maintenance"]),
  bio: z.string().max(2000).optional().default(""),
  heightCm: z.string().max(20).optional().default(""),
  weightKg: z.string().max(20).optional().default(""),
  emailNotifications: z.boolean(),
});

function parseWeightKg(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) && n > 0 && n < 500 ? n : null;
}

export async function GET() {
  const guard = await requireAppFeature("feature.profile");
  if (!guard.ok) return guard.response;
  const session = guard.session;

  try {
    const db = getDb();
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      displayName: user.name,
      email: user.email,
      phone: profile?.phone ?? "",
      goal: (profile?.goal ?? "maintenance") as "cutting" | "bulking" | "maintenance",
      bio: profile?.bio ?? "",
      heightCm: profile?.heightCm ?? "",
      weightKg: profile?.weightKg ?? "",
      emailNotifications: profile?.emailNotifications ?? true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const guard = await requireAppFeature("feature.profile");
  if (!guard.ok) return guard.response;
  const session = guard.session;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const body = parsed.data;
  const userId = session.user.id;

  try {
    const db = getDb();

    await db
      .update(users)
      .set({ name: body.displayName })
      .where(eq(users.id, userId));

    await db
      .insert(userProfiles)
      .values({
        userId,
        phone: body.phone,
        goal: body.goal,
        bio: body.bio,
        heightCm: body.heightCm,
        weightKg: body.weightKg,
        emailNotifications: body.emailNotifications,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          phone: body.phone,
          goal: body.goal,
          bio: body.bio,
          heightCm: body.heightCm,
          weightKg: body.weightKg,
          emailNotifications: body.emailNotifications,
          updatedAt: new Date(),
        },
      });

    const w = parseWeightKg(body.weightKg);
    if (w !== null) {
      await db.insert(bodyMetricEntries).values({
        userId,
        weightKg: w,
        recordedAt: new Date(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
