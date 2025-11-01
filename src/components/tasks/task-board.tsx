"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Task, TaskStatus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Member } from "@/lib/data";


const statusMap: { [key in TaskStatus]: string } = {
  Todo: "To Do",
  "In Progress": "In Progress",
  Done: "Done",
};

const TaskCard = ({ task }: { task: Task }) => {
  const firestore = useFirestore();
  const { data: members } = useCollection<Member>(useMemoFirebase(() => collection(firestore, "users"), [firestore]));
  const assignee = members?.find((m) => m.id === task.assigneeId);

  return (
    <Card className="hover:shadow-lg hover:border-primary/50 transition-all">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          {task.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {assignee && <AvatarImage src={assignee.profilePicture} />}
              <AvatarFallback>
                {assignee ? assignee.username?.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">
              {assignee ? assignee.username : "Unassigned"}
            </span>
          </div>
          <Badge variant="outline">{task.dueDate}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskColumn = ({
  status,
  tasks,
}: {
  status: TaskStatus;
  tasks: Task[];
}) => {
  return (
    <div className="flex-1 flex flex-col min-w-[300px]">
      <h2 className="text-lg font-semibold font-headline mb-4 px-1">{statusMap[status]} ({tasks.length})</h2>
      <div className="flex-1 bg-card rounded-lg p-2 space-y-4 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const columns: TaskStatus[] = ["Todo", "In Progress", "Done"];

  return (
    <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-end mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new task</DialogTitle>
            </DialogHeader>
            <p className="text-center p-8 text-muted-foreground">
              Task creation form would be here.
            </p>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
          />
        ))}
      </div>
    </div>
  );
}
