"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Wand2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfilePictureSuggestions } from "@/ai/flows/profile-picture-suggestions";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function AIPfpGenerator({ onImageGenerated }: { onImageGenerated: (url: string) => void }) {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    if (!description) {
      toast({
        title: "Description is empty",
        description: "Please describe the profile picture you want to generate.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      setGeneratedImage(null);
      try {
        const result = await getProfilePictureSuggestions({ description });
        setGeneratedImage(result.profilePictureDataUri);
      } catch (error) {
        console.error("AI PFP Generation failed:", error);
        toast({
          title: "Generation Failed",
          description: "Could not generate profile picture. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="text-primary h-6 w-6" />
          <CardTitle>AI Profile Picture Generator</CardTitle>
        </div>
        <CardDescription>
          Describe your desired profile picture and let AI create it for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="pfp-description">Description</Label>
          <Input
            id="pfp-description"
            placeholder="e.g., A futuristic robot agent with glowing blue eyes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button onClick={handleGenerate} disabled={isPending}>
          {isPending ? "Generating..." : "Generate Picture"}
        </Button>
      </CardContent>
      {(isPending || generatedImage) && (
        <CardFooter className="flex flex-col items-start gap-4">
            <p className="text-sm font-medium">Generated Image:</p>
            <div className="w-48 h-48 rounded-lg border bg-muted flex items-center justify-center">
            {isPending && <Skeleton className="w-full h-full" />}
            {generatedImage && (
                <Image
                src={generatedImage}
                alt="AI generated profile picture"
                width={192}
                height={192}
                className="rounded-md object-cover"
                />
            )}
            </div>
            {generatedImage && <Button onClick={handleUseImage}>Use this Image</Button>}
        </CardFooter>
      )}
    </Card>
  );
}
