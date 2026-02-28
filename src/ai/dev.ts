import { config } from 'dotenv';
config();

import '@/ai/flows/explain-crop-recommendation.ts';
import '@/ai/flows/generate-synthetic-crop-data.ts';
import '@/ai/flows/analyze-yield-flow.ts';
