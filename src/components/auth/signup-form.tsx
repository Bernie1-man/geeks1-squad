"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { paths } from "@/lib/paths";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useToast } from "@/hooks/use-toast";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      // Create user profile in Firestore
      const userRef = doc(firestore, "users", user.uid);
      const {name, email} = form.getValues();
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        username: name,
        email: email,
        role: "Field Agent",
        status: "online",
        description: "A new GeekForce recruit, ready for missions!",
        profilePicture: `https://picsum.photos/seed/${user.uid}/200/200`,
      }, { merge: true });

      router.push(paths.dashboard);
    }
  }, [user, isUserLoading, router, firestore, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    initiateEmailSignUp(auth, values.email, values.password);
    toast({
      title: "Creating Account...",
      description: "Please wait while we set up your agent profile.",
    });
  }

  if (isUserLoading || user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Join the Force</CardTitle>
        <CardDescription>
          Create your agent profile to join the GeekForce.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="agent@geekforce.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              Create Profile
            </Button>
            <div className="text-sm text-muted-foreground">
              Already an agent?{" "}
              <Link href={paths.login} className="text-primary hover:underline">
                Log In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
