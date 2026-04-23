import { auth } from "@/auth";
import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { getProfilePayload } from "@/lib/data/profile-payload";
import { UserProfile } from "@/sections/dashboard/user-profile";
import { notFound, redirect } from "next/navigation";

export default async function ProfilePage() {
  await assertAppFeature("feature.profile");
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const initialData = await getProfilePayload(session.user.id);
  if (!initialData) {
    notFound();
  }
  return <UserProfile initialData={initialData} />;
}
