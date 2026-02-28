'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating AI-powered explanations
 * for fertilizer quantity or alternative crop recommendations to farmers.
 *
 * - explainCropRecommendation - A function that generates an explanation for a given recommendation.
 * - ExplainCropRecommendationInput - The input type for the explainCropRecommendation function.
 * - ExplainCropRecommendationOutput - The return type for the explainCropRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainCropRecommendationInputSchema = z.object({
  recommendationType: z
    .enum(['fertilizer', 'crop_switch'])
    .describe("The type of recommendation: 'fertilizer' or 'crop_switch'."),
  fertilizerRecommendation: z
    .object({
      quantity: z
        .string()
        .describe("The recommended fertilizer quantity (e.g., '10kg/hectare nitrogen')."),
    })
    .optional()
    .describe('Details for a fertilizer recommendation, if applicable.'),
  cropSwitchRecommendation: z
    .object({
      alternativeCrop: z.string().describe("The suggested alternative crop (e.g., 'corn', 'soybeans')."),
    })
    .optional()
    .describe('Details for a crop switch recommendation, if applicable.'),
  originalCropType: z.string().describe('The original or currently considered crop type.'),
  soilPH: z.number().describe('The current soil pH level.'),
  rainfall: z.number().describe('The current or predicted rainfall in mm.'),
  temperature: z.number().describe('The current or predicted temperature in Celsius.'),
  predictedYield: z
    .number()
    .describe('The predicted yield in kg/hectare under current conditions or with the original crop.'),
  reasoningContext: z
    .string()
    .optional()
    .describe(
      'Optional: Additional context or specific reasons from the yield prediction that support the recommendation.'
    ),
});
export type ExplainCropRecommendationInput = z.infer<typeof ExplainCropRecommendationInputSchema>;

const ExplainCropRecommendationOutputSchema = z.object({
  explanation: z.string().describe('A clear, AI-generated explanation for the recommendation.'),
});
export type ExplainCropRecommendationOutput = z.infer<typeof ExplainCropRecommendationOutputSchema>;

export async function explainCropRecommendation(
  input: ExplainCropRecommendationInput
): Promise<ExplainCropRecommendationOutput> {
  return explainCropRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCropRecommendationPrompt',
  input: { schema: ExplainCropRecommendationInputSchema },
  output: { schema: ExplainCropRecommendationOutputSchema },
  prompt: `You are an expert agricultural advisor providing clear and actionable explanations to farmers.

Based on the following data and recommendation, provide a concise and easy-to-understand explanation for why this recommendation was made. Highlight the key factors from the provided data that justify the suggestion.

--- Input Data ---
Original Crop Type: {{{originalCropType}}}
Soil pH: {{{soilPH}}}
Rainfall: {{{rainfall}}} mm
Temperature: {{{temperature}}} °C
Predicted Yield (Original): {{{predictedYield}}} kg/hectare
{{#if reasoningContext}}Additional Context: {{{reasoningContext}}}{{/if}}

--- Recommendation ---
{{#if fertilizerRecommendation}}
Fertilizer Recommendation: {{{fertilizerRecommendation.quantity}}}
{{/if}}
{{#if cropSwitchRecommendation}}
Crop Switch Recommendation: Switch to {{{cropSwitchRecommendation.alternativeCrop}}}
{{/if}}

--- Explanation ---
`,
});

const explainCropRecommendationFlow = ai.defineFlow(
  {
    name: 'explainCropRecommendationFlow',
    inputSchema: ExplainCropRecommendationInputSchema,
    outputSchema: ExplainCropRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate explanation.');
    }
    return output;
  }
);
