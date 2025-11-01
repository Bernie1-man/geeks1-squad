"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import type { Member } from "@/lib/data";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const AIPfpGenerator = dynamic(() => import("@/components/profile/ai-pfp-generator").then(mod => mod.AIPfpGenerator));

const profileSchema = z.object({
  username: z.string().min(1, "Name is required."),
  description: z.string().optional(),
});

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [firestore, user]);
  const { data: currentUser, isLoading: isProfileLoading } = useDoc<Member>(userDocRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      description: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username,
        description: currentUser.description,
      });
    }
  }, [currentUser, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, values);
    toast({
      title: "Profile Updated",
      description: "Your public information has been saved.",
    });
  };

  const handlePfpUpdate = (imageUrl: string) => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, { profilePicture: imageUrl });
    toast({
      title: "Profile Picture Updated",
      description: "Your new AI-generated picture is now active.",
    });
  };

  if (isUserLoading || isProfileLoading) {
    return <p>Loading profile...</p>;
  }

  if (!currentUser) {
    return <p>Could not load agent profile.</p>;
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Agent Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your GeekForce identity and settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your public information here.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.profilePicture} />
                  <AvatarFallback>{currentUser.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                {/* This button is now part of the AI component */}
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue={"Field Agent"} disabled />
              </div>
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </CardContent>
          </form>
        </Form>
      </Card>
      
      <Separator />

      <AIPfpGenerator onImageGenerated={handlePfpUpdate} />
    </div>
  );
}
