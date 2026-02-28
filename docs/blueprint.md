# **App Name**: AgriYield AI

## Core Features:

- AI Crop Yield Prediction: Predict crop yield in kg/hectare based on soil pH, rainfall, temperature, fertilizer amount, and crop type, showing a confidence score. Utilizes a Random Forest ML model.
- Agricultural Map Visualization: Visualize predicted crop yields on an interactive map using a color heatmap. Includes region and season filtering for easy analysis.
- Fertilizer & Crop Recommendation Tool: Provide smart fertilizer quantity recommendations and suggest alternative crops. The AI explanation tool justifies each recommendation to the farmer.
- Dataset & Model Management: Allow farmers to upload crop datasets (CSV). The system will auto-clean data and generate synthetic records (400+ seasons) for robust model training. It also includes dataset versioning.
- Farmer Dashboard: A personalized dashboard for farmers to view yield prediction history, receive important alerts, and plan seasons based on recommendations.
- Admin Portal: A secure admin panel via a hidden URL for system administrators to upload new datasets, trigger model retraining, adjust recommendation logic, manage users, and view analytics.

## Style Guidelines:

- Primary color: A balanced emerald green (#1B9351), chosen to evoke growth, nature, and data precision, providing strong contrast for readability on light backgrounds.
- Background color: A very light, almost white shade with a hint of green (#EFF7F2), providing a clean and scannable base that aligns with the primary hue.
- Accent color: A vibrant golden-yellow (#F5C731) to draw attention to key actions and data points, representing ripeness and harvest within the natural palette.
- Body and headline font: 'Inter' (sans-serif), selected for its modern, legible, and objective characteristics, ensuring clarity and ease of reading for all content in a data-rich agricultural context.
- Use clear, concise, and recognizable vector icons that are functionally illustrative for agricultural concepts, suitable for a simple farmer UI.
- Prioritize a mobile-first, map-first user experience. Design for large, touch-friendly buttons and scannable UI elements to cater to users with minimal technical knowledge.
- Incorporate subtle and functional animations for feedback on user interactions and data loading, enhancing the user experience without being distracting or adding unnecessary complexity.