import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const statusStyles: { [key in Member["status"]]: string } = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  away: "bg-yellow-500",
};

export default function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={member.profilePicture}
            alt={member.username}
            data-ai-hint={member.avatar?.imageHint}
          />
          <AvatarFallback>{member.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{member.username}</CardTitle>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">{member.description}</p>
        <div className="flex items-center gap-2">
            <div className={cn("h-2.5 w-2.5 rounded-full", statusStyles[member.status])} />
            <span className="text-xs capitalize">{member.status}</span>
        </div>
      </CardContent>
    </Card>
  );
}
