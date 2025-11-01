"use client";

import { useState, useTransition } from "react";
import { Wand2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getActivitySummary } from "@/ai/flows/activity-summaries";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Member, Task, CalendarEvent } from "@/lib/data";

export function ActivityInsights() {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const { data: members, isLoading: membersLoading } = useCollection<Member>(useMemoFirebase(() => collection(firestore, "users"), [firestore]));

  const memberTasksQuery = useMemoFirebase(() => 
    selectedMemberId ? query(collection(firestore, `users/${selectedMemberId}/tasks`)) : null
  , [firestore, selectedMemberId]);
  const { data: memberTasks } = useCollection<Task>(memberTasksQuery);

  const memberEventsQuery = useMemoFirebase(() =>
    selectedMemberId ? query(collection(firestore, 'events'), where('attendeeIds', 'array-contains', selectedMemberId)) : null
  , [firestore, selectedMemberId]);
  const { data: memberEvents } = useCollection<CalendarEvent>(memberEventsQuery);

  const handleGenerateSummary = () => {
    if (!selectedMemberId) return;

    const member = members?.find((m) => m.id === selectedMemberId);
    if (!member) return;

    const taskAssignments =
      memberTasks && memberTasks.length > 0
        ? memberTasks
            .map((t) => `- ${t.title} (Due: ${t.dueDate})`)
            .join("\n")
        : "No tasks assigned.";
    const calendarEvents =
      memberEvents && memberEvents.length > 0
        ? memberEvents
            .map(
              (e) =>
                `- ${e.title} on ${e.startTime} from ${e.startTime} to ${e.endTime}`
            )
            .join("\n")
        : "No events scheduled.";

    startTransition(async () => {
      setSummary(null);
      const result = await getActivitySummary({
        teamMemberName: member.username,
        taskAssignments,
        calendarEvents,
      });
      setSummary(result.summary);
    });
  };

  return (
    <Card className="bg-gradient-to-br from-card to-secondary border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="text-primary h-6 w-6" />
          <CardTitle className="text-2xl font-headline">
            AI Activity Insights
          </CardTitle>
        </div>
        <CardDescription>
          Generate a summary of an agent's activities and potential conflicts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select onValueChange={setSelectedMemberId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select an Agent" />
            </SelectTrigger>
            <SelectContent>
              {membersLoading && <SelectItem value="loading" disabled>Loading agents...</SelectItem>}
              {members?.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateSummary}
            disabled={!selectedMemberId || isPending}
            className="flex-shrink-0"
          >
            {isPending ? "Generating..." : "Generate Summary"}
          </Button>
        </div>
      </CardContent>
      {(isPending || summary) && (
        <CardFooter>
          <Card className="w-full bg-background/50">
            <CardContent className="p-4">
              {isPending && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
              {summary && <p className="text-sm">{summary}</p>}
            </CardContent>
          </Card>
        </CardFooter>
      )}
    </Card>
  );
}
