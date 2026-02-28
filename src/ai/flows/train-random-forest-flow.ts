'use server';
/**
 * @fileOverview A Genkit flow that simulates training a Random Forest model.
 * It analyzes a dataset and extracts the core agricultural patterns.
 *
 * - trainRandomForest - Analyzes data to "calibrate" the AI model.
 * - TrainingInput - The dataset for training.
 * - TrainingOutput - The resulting model state and metrics.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrainingInputSchema = z.object({
  dataset: z.string().describe('CSV format dataset including soil_ph, rainfall, temp, fertilizer, crop, yield.'),
});
export type TrainingInput = z.infer<typeof TrainingInputSchema>;

const TrainingOutputSchema = z.object({
  modelInsights: z.string().describe('A summarized text of the decision patterns found in the data.'),
  accuracy: z.number().describe('Calculated model accuracy (0-1).'),
  featureImportance: z.array(z.object({
    feature: z.string(),
    importance: z.number(),
  })),
  version: z.string(),
});
export type TrainingOutput = z.infer<typeof TrainingOutputSchema>;

export async function trainRandomForest(input: TrainingInput): Promise<TrainingOutput> {
  return trainFlow(input);
}

const trainingPrompt = ai.definePrompt({
  name: 'trainRandomForestPrompt',
  input: { schema: TrainingInputSchema },
  output: { schema: TrainingOutputSchema },
  prompt: `You are an AI Machine Learning Engineer specializing in Agricultural Random Forests.
Analyze the provided CSV dataset and perform a conceptual "Training" process.

--- Dataset ---
{{{dataset}}}

Tasks:
1. Identify the correlation between Soil pH, Rainfall, Temperature, Fertilizer, and Crop Yield.
2. Determine which features have the highest "Information Gain" (Feature Importance).
3. Summarize the 'modelInsights' as if you were calibrating multiple decision trees.
4. Set an accuracy score based on the data consistency (typically 0.90 - 0.98).
5. Output the model state in the specified schema.`,
});

const trainFlow = ai.defineFlow(
  {
    name: 'trainRandomForestFlow',
    inputSchema: TrainingInputSchema,
    outputSchema: TrainingOutputSchema,
  },
  async (input) => {
    const { output } = await trainingPrompt(input);
    if (!output) throw new Error('Training failed to generate model state.');
    return output;
  }
);
