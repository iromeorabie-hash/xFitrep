import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini safely on the server side
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Diet Generator Endpoint
app.post("/api/generate-diet", async (req, res) => {
  try {
    const { profile, customMacros } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Customer profile data is required." });
    }

    const ai = getGeminiClient();

    const prompt = `
You are an expert sports nutritionist and dietitian creating a highly customized 1-day meal plan for a fitness client.

CLIENT PROFILE:
- Name: ${profile.name || "Customer"}
- Age: ${profile.age || 25} years
- Height: ${profile.height || 170} cm
- Current Weight: ${profile.weight || 70} kg
- Fitness Goal: ${profile.fitnessGoal || "Muscle Building"}
- Activity Level: ${profile.activityLevel || "Moderately Active"}
- Preferred Cuisine: ${profile.cuisine || "Egyptian"}
- Budget Level: ${profile.budgetLevel || "Medium / Balanced"}
- Health Conditions: ${profile.healthConditions?.length ? profile.healthConditions.join(", ") : "None"}
- Food Allergies / Intolerances: ${profile.allergies?.length ? profile.allergies.join(", ") : "None"}
- Food Preferences: ${profile.foodPreferences?.length ? profile.foodPreferences.join(", ") : "None"}
- Disliked Foods: ${profile.dislikedFoods || "None"}
${customMacros ? `- Custom Daily Macro Targets Requested: ${customMacros.calories} Calories (${customMacros.protein}g Protein, ${customMacros.carbs}g Carbs, ${customMacros.fats}g Fats)` : ""}

MANDATORY RULES & SAFETY:
1. STRICT ALLERGY EXCLUSION: NEVER include any ingredient matching the client's allergies (${profile.allergies?.length ? profile.allergies.join(", ") : "None"}).
2. CUISINE FIT: Incorporate authentic recipes and food items matching the requested cuisine ("${profile.cuisine || "Egyptian"}" e.g., Egyptian dishes like ful, eggs, cottage cheese, grilled chicken, koshary/rice, meat; or Middle Eastern / Western according to choice).
3. BUDGET CONSTRAINTS: Tailor food choices to the budget level ("${profile.budgetLevel || "Medium / Balanced"}"). If Low/Budget-friendly, prioritize affordable local protein/carbs like eggs, lentils, oats, local cheese, chicken; if High/Premium, include items like salmon, beef tenderloin, avocado, nuts, whey protein.
4. MACRO CALCULATIONS: Total target daily calories, protein (g), carbs (g), and fats (g) MUST match the requested target or scientifically derived total for their goal.
5. MEAL BREAKDOWN: Create exactly 4 meals: "Breakfast", "Lunch", "Dinner", and "Snack".
6. ARABIC FOOD NAMES: All meal titles, descriptions, food names, and ingredient lists MUST be written in fluent, authentic Arabic (e.g., "طبق فول بالزيت والليمون مع بيض مسلوق", "صدور دجاج مشوية مع أرز بسمتي وخضروات", "جبن قريش مع طماطم ورغيف بلدي"). Ensure titleAr, descriptionAr, ingredientsAr, and instructionsAr contain clear Arabic food names.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetCalories: { type: Type.NUMBER, description: "Target total daily calories" },
            targetProtein: { type: Type.NUMBER, description: "Target daily protein in grams" },
            targetCarbs: { type: Type.NUMBER, description: "Target daily carbs in grams" },
            targetFats: { type: Type.NUMBER, description: "Target daily fats in grams" },
            summary: { type: Type.STRING, description: "Executive summary of the nutritional strategy in English" },
            summaryAr: { type: Type.STRING, description: "Executive summary of the nutritional strategy in Arabic" },
            dietaryNotes: { type: Type.STRING, description: "Allergy and safety confirmation notes in English" },
            dietaryNotesAr: { type: Type.STRING, description: "Allergy and safety confirmation notes in Arabic" },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Breakfast, Lunch, Dinner, or Snack" },
                  title: { type: Type.STRING, description: "Name of the meal dish in English" },
                  titleAr: { type: Type.STRING, description: "Name of the meal dish in Arabic" },
                  description: { type: Type.STRING, description: "Short description in English" },
                  descriptionAr: { type: Type.STRING, description: "Short description in Arabic" },
                  calories: { type: Type.NUMBER, description: "Meal calories" },
                  protein: { type: Type.NUMBER, description: "Meal protein in grams" },
                  carbs: { type: Type.NUMBER, description: "Meal carbs in grams" },
                  fats: { type: Type.NUMBER, description: "Meal fats in grams" },
                  ingredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of ingredients with quantities in English",
                  },
                  ingredientsAr: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of ingredients with quantities in Arabic",
                  },
                  instructions: { type: Type.STRING, description: "Simple preparation guide in English" },
                  instructionsAr: { type: Type.STRING, description: "Simple preparation guide in Arabic" },
                },
                required: [
                  "id", "type", "title", "titleAr", "description", "descriptionAr", 
                  "calories", "protein", "carbs", "fats", 
                  "ingredients", "ingredientsAr", "instructions", "instructionsAr"
                ],
              },
            },
          },
          required: [
            "targetCalories", "targetProtein", "targetCarbs", "targetFats", 
            "summary", "summaryAr", "dietaryNotes", "dietaryNotesAr", "meals"
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response text generated by AI model.");
    }

    const dietData = JSON.parse(response.text);
    return res.json({
      success: true,
      dietPlan: {
        ...dietData,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("AI Diet Generation Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI diet plan. Please check API key configuration.",
    });
  }
});

// Vite Middleware & Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
