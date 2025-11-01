"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { FormEvent, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Member, ChatMessage as ChatMessageType } from "@/lib/data";


export default function ChatPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");

  const messagesRef = useMemoFirebase(() => collection(firestore, "chat_messages"), [firestore]);
  const messagesQuery = useMemoFirebase(() => query(messagesRef, orderBy("timestamp", "asc")), [messagesRef]);

  const { data: messages, isLoading: messagesLoading } = useCollection<ChatMessageType>(messagesQuery);
  const { data: members, isLoading: membersLoading } = useCollection<Member>(useMemoFirebase(() => collection(firestore, "users"), [firestore]));

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    await addDoc(messagesRef, {
      senderId: user.uid,
      content: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Team Comms
        </h1>
        <p className="text-muted-foreground mb-4">
          Real-time communication channel for all agents.
        </p>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 min-h-0">
        <Card className="hidden md:flex flex-col">
          <CardHeader>
            <CardTitle>Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start bg-accent"># general</Button>
                <Button variant="ghost" className="justify-start"># missions</Button>
                <Button variant="ghost" className="justify-start"># random</Button>
            </nav>
          </CardContent>
           <Separator className="my-4" />
           <CardHeader>
            <CardTitle>Direct Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full">
            <nav className="flex flex-col gap-2">
                {(membersLoading || !members) ? Array.from({length: 5}).map((_, i) => <div key={i} className="h-8 bg-muted rounded-md animate-pulse" />) : members.map(member => (
                    <Button key={member.id} variant="ghost" className="justify-start gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={member.profilePicture} />
                            <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.username}
                    </Button>
                ))}
            </nav>
            </ScrollArea>
          </CardContent>
        </Card>
        <div className="flex flex-col h-full bg-card rounded-lg border">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {(messagesLoading || !messages) && <div className="text-center p-8">Loading messages...</div>}
              {messages && messages.map((message) => {
                const author = members?.find((m) => m.id === message.senderId);
                return (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={author?.profilePicture} />
                      <AvatarFallback>{author ? author.username.charAt(0) : '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-primary">{author?.username || 'Unknown Agent'}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp?.toDate ? new Date(message.timestamp.toDate()).toLocaleTimeString() : 'sending...'}
                        </p>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="relative">
              <Input
                placeholder="Type a message..."
                className="pr-16"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!user}
              />
              <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-12" disabled={!user || !newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
