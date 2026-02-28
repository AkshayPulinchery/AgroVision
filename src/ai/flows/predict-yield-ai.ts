'use server';
/**
 * @fileOverview A Genkit flow that performs inference using a "trained" Random Forest simulation.
 *
 * - predictYieldAI - Uses AI to predict yield based on environmental features.
 * - PredictYieldAIInput - Input features (soil, weather, crop).
 * - PredictYieldAIOutput - Predicted yield and confidence.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictYieldAIInputSchema = z.object({
  crop: z.string(),
  soilPH: z.number(),
  rainfall: z.number(),
  temp: z.number(),
  fertilizer: z.number(),
  modelContext: z.string().optional().describe('Context from a previously trained model run.'),
});
export type PredictYieldAIInput = z.infer<typeof PredictYieldAIInputSchema>;

const PredictYieldAIOutputSchema = z.object({
  yield: z.number().describe('Predicted yield in kg/ha.'),
  confidence: z.number().describe('Confidence score between 0 and 1.'),
  reasoning: z.string().describe('Brief explanation of why this yield was predicted based on the forest logic.'),
});
export type PredictYieldAIOutput = z.infer<typeof PredictYieldAIOutputSchema>;

export async function predictYieldAI(input: PredictYieldAIInput): Promise<PredictYieldAIOutput> {
  return predictFlow(input);
}

const inferencePrompt = ai.definePrompt({
  name: 'predictYieldAIPrompt',
  input: { schema: PredictYieldAIInputSchema },
  output: { schema: PredictYieldAIOutputSchema },
  prompt: `You are an AI Random Forest Regressor for AgroVision. 
You have been trained on historical harvest data for {{{crop}}}.

--- Features ---
- Soil pH: {{{soilPH}}}
- Rainfall: {{{rainfall}}} mm
- Temperature: {{{temp}}} °C
- Fertilizer: {{{fertilizer}}} kg/ha
{{#if modelContext}}--- Model Context ---
{{{modelContext}}}{{/if}}

Perform inference by conceptualizing an ensemble of decision trees. 
Consider the optimal pH (6.0-7.0), rainfall requirements, and temperature sensitivity for {{{crop}}}.
Predict the 'yield' in kg/ha and provide your 'confidence' score and 'reasoning'.`,
});

const predictFlow = ai.defineFlow(
  {
    name: 'predictYieldAIFlow',
    inputSchema: PredictYieldAIInputSchema,
    outputSchema: PredictYieldAIOutputSchema,
  },
  async (input) => {
    const { output } = await inferencePrompt(input);
    if (!output) throw new Error('Inference failed.');
    return output;
  }
);
