'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest the optimal dog walker for a given dog based on its characteristics and the owner's preferences.
 *
 * The flow takes dog characteristics and owner preferences as input and returns a suggestion for the best matching dog walker.
 *
 * - suggestOptimalDogWalker - The main function to trigger the flow.
 * - SuggestOptimalDogWalkerInput - The input type for the suggestOptimalDogWalker function.
 * - SuggestOptimalDogWalkerOutput - The output type for the suggestOptimalDogWalker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestOptimalDogWalkerInputSchema = z.object({
  dogBreed: z.string().describe('The breed of the dog.'),
  dogEnergyLevel: z.enum(['low', 'medium', 'high']).describe('The energy level of the dog.'),
  dogSize: z.enum(['small', 'medium', 'large']).describe('The size of the dog.'),
  ownerPreferences: z
    .string()
    .describe(
      'Any specific preferences the owner has for the dog walker, such as experience with specific breeds or availability on certain days.'
    ),
  location: z.string().describe('The location of the dog owner.'),
});

export type SuggestOptimalDogWalkerInput = z.infer<typeof SuggestOptimalDogWalkerInputSchema>;

// Define the output schema
const SuggestOptimalDogWalkerOutputSchema = z.object({
  dogWalkerSuggestion: z
    .string()
    .describe(
      'The name and a brief description of the suggested dog walker, including why they are a good match.'
    ),
});

export type SuggestOptimalDogWalkerOutput = z.infer<typeof SuggestOptimalDogWalkerOutputSchema>;

// Exported function to call the flow
export async function suggestOptimalDogWalker(
  input: SuggestOptimalDogWalkerInput
): Promise<SuggestOptimalDogWalkerOutput> {
  return suggestOptimalDogWalkerFlow(input);
}

// Define the prompt
const suggestOptimalDogWalkerPrompt = ai.definePrompt({
  name: 'suggestOptimalDogWalkerPrompt',
  input: {schema: SuggestOptimalDogWalkerInputSchema},
  output: {schema: SuggestOptimalDogWalkerOutputSchema},
  prompt: `You are an expert in matching dogs with suitable dog walkers.

  Given the following information about the dog and the owner's preferences, suggest a dog walker who would be a good match.

  Dog Breed: {{{dogBreed}}}
  Dog Energy Level: {{{dogEnergyLevel}}}
  Dog Size: {{{dogSize}}}
  Owner Preferences: {{{ownerPreferences}}}
  Location: {{{location}}}

  Consider the dog's breed, energy level, size, and the owner's preferences when making your suggestion. The suggestion should be concise and include the name of the dog walker and a brief explanation of why they are a good fit.  The location of the dog walker should be close to the dog owner.
  `,
});

// Define the flow
const suggestOptimalDogWalkerFlow = ai.defineFlow(
  {
    name: 'suggestOptimalDogWalkerFlow',
    inputSchema: SuggestOptimalDogWalkerInputSchema,
    outputSchema: SuggestOptimalDogWalkerOutputSchema,
  },
  async input => {
    const {output} = await suggestOptimalDogWalkerPrompt(input);
    return output!;
  }
);
