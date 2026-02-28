'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating synthetic crop yield data.
 *
 * - generateSyntheticCropData - A function that generates synthetic crop yield data.
 * - GenerateSyntheticCropDataInput - The input type for the generateSyntheticCropData function.
 * - GenerateSyntheticCropDataOutput - The return type for the generateSyntheticCropData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSyntheticCropDataInputSchema = z.object({
  existingCropData: z.string().describe(
    "Existing crop yield data, typically in CSV format, including headers. This data will be used as a pattern for generating new records."
  ),
  numRecords: z
    .number()
    .int()
    .positive()
    .describe("The number of synthetic crop yield records to generate."),
});
export type GenerateSyntheticCropDataInput = z.infer<
  typeof GenerateSyntheticCropDataInputSchema
>;

const GenerateSyntheticCropDataOutputSchema = z.object({
  syntheticCropData: z
    .string()
    .describe("Generated synthetic crop yield data in CSV format, including headers."),
});
export type GenerateSyntheticCropDataOutput = z.infer<
  typeof GenerateSyntheticCropDataOutputSchema
>;

export async function generateSyntheticCropData(
  input: GenerateSyntheticCropDataInput
): Promise<GenerateSyntheticCropDataOutput> {
  return generateSyntheticCropDataFlow(input);
}

const generateSyntheticCropDataPrompt = ai.definePrompt({
  name: 'generateSyntheticCropDataPrompt',
  input: { schema: GenerateSyntheticCropDataInputSchema },
  output: { schema: GenerateSyntheticCropDataOutputSchema },
  prompt:
    `You are an AI assistant specialized in agricultural data simulation. Your task is to generate synthetic crop yield data based on the provided existing data.
    The synthetic data should follow the patterns, distributions, and relationships observed in the 'existingCropData'.

    Generate {{{numRecords}}} new records. The output must be in CSV format, including the header row.
    The columns should be: 'soil_ph', 'rainfall', 'temp', 'fertilizer', 'crop', 'yield'.
    Ensure that the generated values are realistic and within typical agricultural ranges for each column.

    Existing data to learn from:
    {{{existingCropData}}}

    Generated synthetic crop yield data (CSV format):
    `,
});

const generateSyntheticCropDataFlow = ai.defineFlow(
  {
    name: 'generateSyntheticCropDataFlow',
    inputSchema: GenerateSyntheticCropDataInputSchema,
    outputSchema: GenerateSyntheticCropDataOutputSchema,
  },
  async (input) => {
    const { output } = await generateSyntheticCropDataPrompt(input);
    return output!;
  }
);
