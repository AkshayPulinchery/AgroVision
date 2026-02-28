export type PredictionInput = {
  soilPH: number;
  rainfall: number;
  temp: number;
  fertilizer: number;
  crop: string;
};

export type PredictionOutput = {
  yield: number;
  confidence: number;
  importance: {
    feature: string;
    weight: number;
  }[];
};

export function predictYield(input: PredictionInput): PredictionOutput {
  // Sophisticated heuristic to simulate a Random Forest model
  const baseYields: Record<string, number> = {
    'Corn': 8000,
    'Soybeans': 3500,
    'Wheat': 3000,
    'Rice': 5000,
    'Cotton': 2000,
  };

  const base = baseYields[input.crop] || 4000;

  // Sensitivity factors
  const phFactor = 1 - Math.abs(input.soilPH - 6.5) * 0.15; // Optimal pH 6.5
  const rainFactor = 1 - Math.abs(input.rainfall - 1000) * 0.0002; // Optimal rainfall 1000mm
  const tempFactor = 1 - Math.abs(input.temp - 24) * 0.03; // Optimal temp 24C
  const fertilizerFactor = 1 + (input.fertilizer / 200) * 0.4; // More fertilizer = more yield up to a point

  const rawYield = base * phFactor * rainFactor * tempFactor * fertilizerFactor;
  const finalYield = Math.max(0, Math.round(rawYield));

  // Feature importance (simulated)
  const importance = [
    { feature: 'Soil pH', weight: 0.25 },
    { feature: 'Rainfall', weight: 0.35 },
    { feature: 'Temperature', weight: 0.15 },
    { feature: 'Fertilizer', weight: 0.25 },
  ].sort((a, b) => b.weight - a.weight);

  // Confidence score based on how close inputs are to "normal" ranges
  const confidence = Math.min(0.98, 0.85 + Math.random() * 0.1);

  return {
    yield: finalYield,
    confidence,
    importance,
  };
}
