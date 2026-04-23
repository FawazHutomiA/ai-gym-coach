import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { UserProfile } from "@/sections/dashboard/user-profile";

export default async function ProfilePage() {
  await assertAppFeature("feature.profile");
  return <UserProfile />;
}
