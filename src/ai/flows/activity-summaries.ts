'use server';

/**
 * @fileOverview An AI agent that summarizes team member activities and suggests next steps.
 *
 * - getActivitySummary - A function that generates a summary of team member activities.
 * - ActivitySummaryInput - The input type for the getActivitySummary function.
 * - ActivitySummaryOutput - The return type for the getActivitySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActivitySummaryInputSchema = z.object({
  teamMemberName: z.string().describe('The name of the team member.'),
  taskAssignments: z
    .string()
    .describe(
      'A list of task assignments for the team member, including deadlines.'
    ),
  calendarEvents: z
    .string()
    .describe('A list of calendar events for the team member, including times.'),
});
export type ActivitySummaryInput = z.infer<typeof ActivitySummaryInputSchema>;

const ActivitySummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the team member\'s recent and expected activities, including suggested next steps and potential conflicts.'
    ),
});
export type ActivitySummaryOutput = z.infer<typeof ActivitySummaryOutputSchema>;

export async function getActivitySummary(
  input: ActivitySummaryInput
): Promise<ActivitySummaryOutput> {
  return activitySummaryFlow(input);
}

const activitySummaryPrompt = ai.definePrompt({
  name: 'activitySummaryPrompt',
  input: {schema: ActivitySummaryInputSchema},
  output: {schema: ActivitySummaryOutputSchema},
  prompt: `You are an AI assistant helping managers coordinate their teams.  You will receive a team member's name, a list of their task assignments, and a list of their calendar events.  Your job is to create a brief summary of their recent and expected activity, including suggested next steps and potential conflicts.

Team Member Name: {{{teamMemberName}}}
Task Assignments: {{{taskAssignments}}}
Calendar Events: {{{calendarEvents}}}`,
});

const activitySummaryFlow = ai.defineFlow(
  {
    name: 'activitySummaryFlow',
    inputSchema: ActivitySummaryInputSchema,
    outputSchema: ActivitySummaryOutputSchema,
  },
  async input => {
    const {output} = await activitySummaryPrompt(input);
    return output!;
  }
);
