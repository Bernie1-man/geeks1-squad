"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { CalendarEvent, } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddEventForm from "@/components/calendar/add-event-form";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setAddEventOpen] = useState(false);
  const firestore = useFirestore();

  const eventsRef = useMemoFirebase(() => collection(firestore, 'events'), [firestore]);
  const { data: events, isLoading: eventsLoading } = useCollection<CalendarEvent>(eventsRef);

  const { data: members, isLoading: membersLoading } = useCollection<Member>(useMemoFirebase(() => collection(firestore, "users"), [firestore]));


  const selectedDateString = date ? format(date, "yyyy-MM-dd") : "";
  const todaysEvents = events?.filter(
    (event) => event.startTime && format(new Date(event.startTime), "yyyy-MM-dd") === selectedDateString
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) || [];

  const eventDates = events?.map(event => new Date(event.startTime)) || [];

  const handleEventAdded = () => {
    setAddEventOpen(false);
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Events Calendar
        </h1>
        <p className="text-muted-foreground">
          Plan and view all GeekForce missions and activities.
        </p>
      </div>
       <div className="flex justify-end">
        <Dialog open={isAddEventOpen} onOpenChange={setAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new event</DialogTitle>
            </DialogHeader>
            <AddEventForm onEventAdded={handleEventAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardContent className="p-2 md:p-6 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              modifiers={{
                hasEvent: eventDates,
              }}
              modifiersStyles={{
                hasEvent: {
                    position: 'relative',
                    overflow: 'visible',
                }
              }}
              components={{
                DayContent: (props) => {
                  const dayHasEvent = eventDates.some(eventDate => format(eventDate, 'yyyy-MM-dd') === format(props.date, 'yyyy-MM-dd'));
                  return (
                    <div className="relative">
                      {props.date.getDate()}
                      {dayHasEvent && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>
        <div className="space-y-4">
            <h2 className="text-xl font-semibold font-headline">
                Events for {date ? format(date, "PPP") : "..."}
            </h2>
            {eventsLoading && <p>Loading events...</p>}
            {!eventsLoading && todaysEvents.length > 0 ? (
                <div className="space-y-4">
                    {todaysEvents.map(event => (
                        <Card key={event.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {event.startTime && format(new Date(event.startTime), 'p')} - {event.endTime && format(new Date(event.endTime), 'p')}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm">Participants:</p>
                                    <div className="flex -space-x-2">
                                    <TooltipProvider>
                                    {event.attendeeIds?.map(participantId => {
                                        const member = members?.find(m => m.id === participantId);
                                        if (!member) return null;
                                        return (
                                            <Tooltip key={member.id}>
                                                <TooltipTrigger>
                                                     <Avatar className="h-6 w-6 border-2 border-card">
                                                        <AvatarImage src={member.profilePicture} />
                                                        <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>{member.username}</TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                    </TooltipProvider>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                !eventsLoading && <div className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-lg border border-dashed">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No events scheduled</h3>
                    <p className="text-sm text-muted-foreground">All clear for today, agent.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
