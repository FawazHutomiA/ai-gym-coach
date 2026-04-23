import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { userProfiles, users } from "@/db/schema";

export type ProfilePayload = {
  displayName: string;
  email: string;
  phone: string;
  goal: "cutting" | "bulking" | "maintenance";
  bio: string;
  heightCm: string;
  weightKg: string;
  emailNotifications: boolean;
};

export async function getProfilePayload(userId: string): Promise<ProfilePayload | null> {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return null;

  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

  return {
    displayName: user.name,
    email: user.email,
    phone: profile?.phone ?? "",
    goal: (profile?.goal ?? "maintenance") as "cutting" | "bulking" | "maintenance",
    bio: profile?.bio ?? "",
    heightCm: profile?.heightCm ?? "",
    weightKg: profile?.weightKg ?? "",
    emailNotifications: profile?.emailNotifications ?? true,
  };
}
