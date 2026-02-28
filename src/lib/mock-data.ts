
/**
 * @fileOverview Hardcoded mock data for AgroVision prototype.
 * Contains 250+ farm field locations and 500+ yield predictions.
 */

export const MOCK_CROPS = ["Corn", "Soybeans", "Wheat", "Rice", "Cotton"];
export const MOCK_FIELD_PREFIXES = ["North", "East", "South", "West", "Central", "Valley", "Ridge", "Brook", "Delta", "Plateau"];

// Generate 250 Fields
export const MOCK_FIELDS = Array.from({ length: 250 }).map((_, i) => {
  const prefix = MOCK_FIELD_PREFIXES[Math.floor(Math.random() * MOCK_FIELD_PREFIXES.length)];
  const baseLat = 34.0522;
  const baseLng = -118.2437;
  return {
    id: `field-${i}`,
    name: `${prefix} Sector ${i + 1}`,
    crop: MOCK_CROPS[Math.floor(Math.random() * MOCK_CROPS.length)],
    lat: baseLat + (Math.random() - 0.5) * 0.12,
    lng: baseLng + (Math.random() - 0.5) * 0.12,
    moisture: Math.floor(Math.random() * 40) + 40,
    soilPH: Number((Math.random() * (7.2 - 5.8) + 5.8).toFixed(1)),
    temp: Math.floor(Math.random() * 10) + 20,
    health: Math.floor(Math.random() * 20) + 75,
    lastUpdated: new Date().toISOString()
  };
});

// Generate 500 Predictions
export const MOCK_PREDICTIONS = Array.from({ length: 500 }).map((_, i) => {
  return {
    id: `pred-${i}`,
    crop: MOCK_CROPS[Math.floor(Math.random() * MOCK_CROPS.length)],
    soilPH: Number((Math.random() * (7.5 - 5.5) + 5.5).toFixed(1)),
    rainfall: Math.floor(Math.random() * 800) + 600,
    temp: Math.floor(Math.random() * 15) + 15,
    fertilizer: Math.floor(Math.random() * 100) + 100,
    predictedYield: Math.floor(Math.random() * 5000) + 3000,
    confidence: 0.85 + Math.random() * 0.1,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365)
  };
});

// Generate 100 Irrigation Logs
export const MOCK_IRRIGATION_LOGS = Array.from({ length: 100 }).map((_, i) => {
  const types = ["Drip", "Sprinkler", "Pivot", "Surface"];
  const field = MOCK_FIELDS[Math.floor(Math.random() * MOCK_FIELDS.length)];
  return {
    id: `log-${i}`,
    fieldName: field.name,
    type: types[Math.floor(Math.random() * types.length)],
    duration: `${Math.floor(Math.random() * 45) + 15} mins`,
    volume: `${Math.floor(Math.random() * 2000) + 500}L`,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7),
    status: Math.random() > 0.1 ? "Completed" : "In Progress"
  };
});
