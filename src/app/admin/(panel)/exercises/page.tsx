import { getAdminExercisesList } from "@/lib/data/admin-lists";
import { AdminExercisesPage } from "@/sections/admin/admin-exercises-page";

export default async function Page() {
  const exercises = await getAdminExercisesList();
  return <AdminExercisesPage initialExercises={exercises} />;
}
