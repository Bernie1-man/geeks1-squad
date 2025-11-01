import { members } from "@/lib/data";
import dynamic from "next/dynamic";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Member } from "@/lib/data";


const MemberCard = dynamic(() => import("@/components/dashboard/member-card"));
const ActivityInsights = dynamic(() => import("@/components/dashboard/activity-insights").then(mod => mod.ActivityInsights));

export default function DashboardPage() {
  const firestore = useFirestore();
  const { data: members, isLoading } = useCollection<Member>(useMemoFirebase(() => collection(firestore, "users"), [firestore]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Agent Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of the GeekForce team status and activities.
        </p>
      </div>

      <ActivityInsights />

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Team Roster
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading && Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-48 bg-card rounded-lg animate-pulse" />)}
          {members?.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
