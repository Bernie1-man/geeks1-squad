'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Member } from '@/lib/data';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.date({ required_error: 'Start date is required.' }),
  endTime: z.date({ required_error: 'End date is required.' }),
  attendeeIds: z.array(z.string()).min(1, 'At least one attendee is required'),
});

export default function AddEventForm({
  onEventAdded,
}: {
  onEventAdded: () => void;
}) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const eventsRef = useMemoFirebase(
    () => collection(firestore, 'events'),
    [firestore]
  );
  const { data: members, isLoading: membersLoading } = useCollection<Member>(
    useMemoFirebase(() => collection(firestore, 'users'), [firestore])
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      attendeeIds: user ? [user.uid] : [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create an event.',
      });
      return;
    }

    const newEvent = {
      ...values,
      startTime: values.startTime.toISOString(),
      endTime: values.endTime.toISOString(),
    };

    addDocumentNonBlocking(eventsRef, newEvent);

    toast({
      title: 'Event Created',
      description: `"${values.title}" has been added to the calendar.`,
    });
    onEventAdded();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Mission Briefing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the event" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP p')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                        <Input
                            type="time"
                            onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newDate = new Date(field.value || new Date());
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                            }}
                        />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP p')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < (form.getValues("startTime") || new Date())}
                      initialFocus
                    />
                     <div className="p-3 border-t border-border">
                        <Input
                            type="time"
                            onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newDate = new Date(field.value || new Date());
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                            }}
                        />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
          control={form.control}
          name="attendeeIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attendees</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      <span className="truncate">
                        {field.value?.length > 0
                          ? `${field.value.length} agent(s) selected`
                          : 'Select attendees...'}
                      </span>
                      
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search agents..." />
                    <CommandList>
                      <CommandEmpty>No agents found.</CommandEmpty>
                      <CommandGroup>
                        {members?.map((member) => (
                          <CommandItem
                            value={member.username}
                            key={member.id}
                            onSelect={() => {
                              const currentIds = field.value || [];
                              const newIds = currentIds.includes(member.id)
                                ? currentIds.filter((id) => id !== member.id)
                                : [...currentIds, member.id];
                              field.onChange(newIds);
                             
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                field.value?.includes(member.id)
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {member.username}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Event</Button>
      </form>
    </Form>
  );
}
