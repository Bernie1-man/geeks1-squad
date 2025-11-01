"use client";

import dynamic from "next/dynamic";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Task } from "@/lib/data";

const TaskBoard = dynamic(() => import("@/components/tasks/task-board"));

export default function TasksPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const tasksCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "tasks") : null),
    [firestore, user]
  );
  
  const { data: tasks, isLoading } = useCollection<Task>(tasksCollectionRef);
  
  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Mission Board
        </h1>
        <p className="text-muted-foreground">
          Track all agent assignments and mission progress.
        </p>
      </div>
      {isLoading ? <p>Loading tasks...</p> : <TaskBoard initialTasks={tasks || []} />}
    </div>
  );
}
