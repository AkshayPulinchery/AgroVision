'use server';
/**
 * @fileOverview A Genkit flow for qualitative analysis of predicted crop yields.
 *
 * - analyzeYield - A function that provides smart insights based on environmental data.
 * - AnalyzeYieldInput - The input type for the analyzeYield function.
 * - AnalyzeYieldOutput - The return type for the analyzeYield function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeYieldInputSchema = z.object({
  crop: z.string().describe('The type of crop.'),
  soilPH: z.number().describe('The soil pH level.'),
  rainfall: z.number().describe('The rainfall in mm.'),
  temp: z.number().describe('The temperature in Celsius.'),
  predictedYield: z.number().describe('The calculated yield value.'),
});
export type AnalyzeYieldInput = z.infer<typeof AnalyzeYieldInputSchema>;

const AnalyzeYieldOutputSchema = z.object({
  insight: z.string().describe('A smart agricultural insight about the current conditions.'),
  recommendation: z.string().describe('A specific recommendation to optimize the yield.'),
});
export type AnalyzeYieldOutput = z.infer<typeof AnalyzeYieldOutputSchema>;

export async function analyzeYield(input: AnalyzeYieldInput): Promise<AnalyzeYieldOutput> {
  return analyzeYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeYieldPrompt',
  input: { schema: AnalyzeYieldInputSchema },
  output: { schema: AnalyzeYieldOutputSchema },
  prompt: `You are an expert AI agronomist. 
Analyze the following environmental data for a farmer growing {{{crop}}}:

- Soil pH: {{{soilPH}}}
- Rainfall: {{{rainfall}}} mm
- Temperature: {{{temp}}} °C
- Current Predicted Yield: {{{predictedYield}}} kg/ha

Provide a concise "insight" explaining how these factors are interacting, and a specific "recommendation" for improvement. 
Be professional, helpful, and scientific.`,
});

const analyzeYieldFlow = ai.defineFlow(
  {
    name: 'analyzeYieldFlow',
    inputSchema: AnalyzeYieldInputSchema,
    outputSchema: AnalyzeYieldOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate AI analysis.');
    }
    return output;
  }
);
