"use client";

import { useState } from "react";
import { WorkoutLogger } from "@/sections/dashboard/workout-logger";
import { WorkoutSessionList } from "@/sections/dashboard/workout-session-list";

export function LogWorkoutPageContent() {
  const [listKey, setListKey] = useState(0);

  return (
    <div className="space-y-12">
      <WorkoutLogger onSaved={() => setListKey((k) => k + 1)} />
      <WorkoutSessionList refreshKey={listKey} onChanged={() => setListKey((k) => k + 1)} />
    </div>
  );
}
