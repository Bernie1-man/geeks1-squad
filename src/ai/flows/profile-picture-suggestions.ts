'use server';

/**
 * @fileOverview Profile picture suggestion flow.
 *
 * This flow suggests profile pictures based on a user's description using a placeholder image service.
 *
 * @interface ProfilePictureSuggestionsInput - Input for the profile picture suggestions flow, containing a description.
 * @interface ProfilePictureSuggestionsOutput - Output of the flow, containing a data URI of the suggested profile picture.
 * @function getProfilePictureSuggestions -  Wrapper function to call the flow and return profile picture suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfilePictureSuggestionsInputSchema = z.object({
  description: z
    .string()
    .describe("A description of the user, used to generate a profile picture."),
});
export type ProfilePictureSuggestionsInput = z.infer<
  typeof ProfilePictureSuggestionsInputSchema
>;

const ProfilePictureSuggestionsOutputSchema = z.object({
  profilePictureDataUri: z
    .string()
    .describe(
      'A profile picture generated based on the description, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type ProfilePictureSuggestionsOutput = z.infer<
  typeof ProfilePictureSuggestionsOutputSchema
>;

export async function getProfilePictureSuggestions(
  input: ProfilePictureSuggestionsInput
): Promise<ProfilePictureSuggestionsOutput> {
  return profilePictureSuggestionsFlow(input);
}

const profilePictureSuggestionsFlow = ai.defineFlow(
  {
    name: 'profilePictureSuggestionsFlow',
    inputSchema: ProfilePictureSuggestionsInputSchema,
    outputSchema: ProfilePictureSuggestionsOutputSchema,
  },
  async (input) => {
    // Generate a consistent hash from the description to be used as a seed.
    let seed = 0;
    for (let i = 0; i < input.description.length; i++) {
        const char = input.description.charCodeAt(i);
        seed = ((seed << 5) - seed) + char;
        seed = seed & seed; // Convert to 32bit integer
    }

    const imageUrl = `https://picsum.photos/seed/${Math.abs(seed)}/200/200`;
    
    // Fetch the image and convert it to a data URI.
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${imageBase64}`;

    return {
      profilePictureDataUri: dataUri,
    };
  }
);
