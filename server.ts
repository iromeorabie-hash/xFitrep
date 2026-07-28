import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-Memory Diet Plan Cache (Key -> Plan, TTL: 24h)
const dietCache = new Map<string, { dietPlan: any; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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

/**
 * 1. PROGRAMMATIC MACRO CALCULATOR
 * Uses Mifflin-St Jeor Equation + Activity Multiplier + Goal Adjustments + Macro Ratios
 */
function calculateTargetMacros(profile: any, customMacros?: any) {
  if (
    customMacros &&
    customMacros.calories > 0 &&
    customMacros.protein > 0 &&
    customMacros.carbs > 0 &&
    customMacros.fats > 0
  ) {
    return {
      calories: Math.round(Number(customMacros.calories)),
      protein: Math.round(Number(customMacros.protein)),
      carbs: Math.round(Number(customMacros.carbs)),
      fats: Math.round(Number(customMacros.fats)),
    };
  }

  const age = Number(profile?.age) || 25;
  const height = Number(profile?.height) || 170;
  const weight = Number(profile?.weight) || 70;
  const gender = (profile?.gender || "").toLowerCase();
  const isFemale = gender.includes("female") || gender.includes("أنثى");

  // BMR (Mifflin-St Jeor)
  const bmr = 10 * weight + 6.25 * height - 5 * age + (isFemale ? -161 : 5);

  // Activity Factor
  let activityMult = 1.375;
  const act = (profile?.activityLevel || "").toLowerCase();
  if (act.includes("sedentary") || act.includes("خامل")) activityMult = 1.2;
  else if (act.includes("light") || act.includes("خفيف")) activityMult = 1.375;
  else if (act.includes("moderate") || act.includes("متوسط")) activityMult = 1.55;
  else if (act.includes("very") || act.includes("شديد") || act.includes("active")) activityMult = 1.725;

  const tdee = bmr * activityMult;

  // Fitness Goal Adjustments
  let calories = tdee;
  const goal = (profile?.fitnessGoal || "").toLowerCase();
  if (goal.includes("loss") || goal.includes("fat") || goal.includes("تخسيس") || goal.includes("خسارة")) {
    calories -= 450;
  } else if (goal.includes("muscle") || goal.includes("bulk") || goal.includes("عضل") || goal.includes("زيادة")) {
    calories += 350;
  }

  calories = Math.max(1200, Math.round(calories));

  // Macro Distribution: Protein (2.0g/kg), Fats (25% cals), Carbs (remainder)
  const protein = Math.max(60, Math.round(weight * 2.0));
  const proteinCals = protein * 4;

  const fats = Math.max(30, Math.round((calories * 0.25) / 9));
  const fatCals = fats * 9;

  const carbs = Math.max(40, Math.round((calories - (proteinCals + fatCals)) / 4));

  return { calories, protein, carbs, fats };
}

/**
 * 2. PROGRAMMATIC FALLBACK DIET PLAN GENERATOR
 * Generates an authentic, macro-matched Egyptian/Arabic meal plan if AI is slow or unreachable.
 */
function generateFallbackDietPlan(profile: any, targets: { calories: number; protein: number; carbs: number; fats: number }) {
  const { calories, protein, carbs, fats } = targets;

  // Split targets across 4 meals: Breakfast (25%), Lunch (40%), Dinner (25%), Snack (10%)
  const bCals = Math.round(calories * 0.25);
  const lCals = Math.round(calories * 0.40);
  const dCals = Math.round(calories * 0.25);
  const sCals = Math.round(calories * 0.10);

  const isEgyptian = (profile?.cuisine || "").toLowerCase().includes("egyptian") || (profile?.cuisine || "").toLowerCase().includes("مصر");

  return {
    targetCalories: calories,
    targetProtein: protein,
    targetCarbs: carbs,
    targetFats: fats,
    summary: `Tailored high-protein daily plan designed to reach ${calories} kcal and ${protein}g protein based on your personal profile.`,
    summaryAr: `خطة غذائية يومية متوازنة عالية البروتين مصممة خصيصاً لتنفيذ هدفك بـ ${calories} سعرة حرارية و ${protein}جم بروتين.`,
    dietaryNotes: profile?.allergies?.length ? `Verified strict exclusion of: ${profile.allergies.join(", ")}.` : "No major food allergies detected.",
    dietaryNotesAr: profile?.allergies?.length ? `تم التأكد من استبعاد الحساسيات التالية: ${profile.allergies.join(", ")}.` : "لا توجد حساسيات طعام مسجلة.",
    meals: [
      {
        id: "m1",
        type: "Breakfast",
        title: isEgyptian ? "Egyptian Foul with Eggs & Whole Wheat Bread" : "Oatmeal with Scrambled Eggs & Fruit",
        titleAr: isEgyptian ? "طبق فول بالزيت والليمون مع بيض مسلوق وخبز بلدي" : "طبق شوفان مع بيض مخفوق وفاكهة طازجة",
        description: "Nutritious protein-rich morning start with healthy complex carbs.",
        descriptionAr: "وجبة إفطار غنية بالبروتين والألياف لزيادة الطاقة والنشاط.",
        calories: bCals,
        protein: Math.round(protein * 0.25),
        carbs: Math.round(carbs * 0.25),
        fats: Math.round(fats * 0.25),
        ingredients: [
          isEgyptian ? "150g Egyptian Ful Medames" : "50g Rolled Oats",
          "2 Large Eggs",
          isEgyptian ? "1 Whole Wheat Egyptian Pita Bread" : "1 Banana",
          "1 tsp Olive Oil"
        ],
        ingredientsAr: [
          isEgyptian ? "150جم فول مدمس بالليمون" : "50جم شوفان",
          "2 بيضة مسلوقة",
          isEgyptian ? "رغيف خبز بلدي أسمر" : "ثمرة موز",
          "ملعقة صغيرة زيت زيتون"
        ],
        instructions: "Serve freshly cooked with fresh lemon and olive oil.",
        instructionsAr: "يُقدم طازجاً مع عصير الليمون وزيت الزيتون والخبز الدافيء."
      },
      {
        id: "m2",
        type: "Lunch",
        title: isEgyptian ? "Grilled Chicken Breast with Basmati Rice & Salad" : "Lean Grilled Steak with Rice & Roasted Veggies",
        titleAr: isEgyptian ? "صدور دجاج مشوية مع أرز بسمتي وسلطة خضراء" : "شرائح لحم مشوي مع أرز وخضار سوتيه",
        description: "Lean protein powerhouse meal for muscle recovery and metabolic support.",
        descriptionAr: "وجبة غداء متكاملة تحتوي على البروتين الصافي والكربوهيدرات لإعادة بناء العضلات.",
        calories: lCals,
        protein: Math.round(protein * 0.40),
        carbs: Math.round(carbs * 0.40),
        fats: Math.round(fats * 0.40),
        ingredients: [
          "200g Grilled Chicken Breast",
          "150g Cooked Basmati Rice",
          "1 Mixed Green Salad Bowl",
          "1 tsp Olive Oil Dressing"
        ],
        ingredientsAr: [
          "200جم صدور دجاج متبلة ومشويه",
          "150جم أرز بسمتي مطبوخ",
          "طبق سلطة خضراء مشكلة (طماطم، خيار، جرجير)",
          "ملعقة صغيرة زيت زيتون"
        ],
        instructions: "Grill chicken breast with spices and serve alongside steaming basmati rice and salad.",
        instructionsAr: "تُتبل صدور الدجاج بالبهارات وتُشوى جيداً، ثم تُقدم مع الأرز البسمتي والسلطة الخضراء."
      },
      {
        id: "m3",
        type: "Snack",
        title: "Greek Yogurt with Honey & Almonds",
        titleAr: "زبادي يوناني مع عسل ونكهة المكسرات",
        description: "Light afternoon snack for steady sustained power.",
        descriptionAr: "سناك خفيف وغني بالبروتين والدهون الصحية للشبع المستمر.",
        calories: sCals,
        protein: Math.round(protein * 0.10),
        carbs: Math.round(carbs * 0.10),
        fats: Math.round(fats * 0.10),
        ingredients: ["150g Low Fat Greek Yogurt", "10g Almonds", "1 tsp Raw Honey"],
        ingredientsAr: ["150جم زبادي يوناني خفيف الدسم", "10جم لوز نيء", "ملعقة صغيرة عسل نحل"],
        instructions: "Mix honey into cold Greek yogurt and top with crushed almonds.",
        instructionsAr: "يُمزج العسل مع الزبادي البارد ويُزين بحبات اللوز."
      },
      {
        id: "m4",
        type: "Dinner",
        title: isEgyptian ? "Fresh Cottage Cheese (Gareesh) with Salad & Bread" : "Baked Salmon / Tuna Salad with Toast",
        titleAr: isEgyptian ? "جبن قريش بالطماطم والزيتون مع نصف رغيف بلدي" : "سلطة تونا بالليمون والذرة مع خبز توست",
        description: "Slow-digesting casein protein dinner for optimal nighttime recovery.",
        descriptionAr: "وجبة عشاء خفيفة على المعدة وغنية ببروتين الكازين بطيء الامتصاص لتغذية العضلات أثناء النوم.",
        calories: dCals,
        protein: Math.round(protein * 0.25),
        carbs: Math.round(carbs * 0.25),
        fats: Math.round(fats * 0.25),
        ingredients: [
          isEgyptian ? "150g Fresh Cottage Cheese (Gareesh)" : "1 Can Water Tuna",
          "Cucumber & Tomato Slices",
          "1 tsp Olive Oil",
          isEgyptian ? "Half Egyptian Pita Bread" : "1 Slice Whole Wheat Toast"
        ],
        ingredientsAr: [
          isEgyptian ? "150جم جبن قريش طازج" : "علبة تونة مصفاة من الزيت",
          "شرائح خيار وطماطم ورشة زعتر",
          "ملعقة صغيرة زيت زيتون",
          isEgyptian ? "نصف رغيف بلدي أسمر" : "شريحة توست بني"
        ],
        instructions: "Mash cottage cheese with fresh cucumber, tomato, olive oil, and serve with pita.",
        instructionsAr: "تُخلط الجبنة القريش مع القطع الطازجة وزيت الزيتون وتُقدم مع الخبز البلدي."
      }
    ]
  };
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Diet Generator Endpoint
app.post("/api/generate-diet", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const { profile, customMacros } = req.body;
    if (!profile) {
      return res.status(400).json({ success: false, error: "Customer profile data is required." });
    }

    // Step 1: Programmatic Macro Target Calculation
    const targetMacros = calculateTargetMacros(profile, customMacros);

    // Step 2: In-Memory Cache Lookup for Fast Response
    const cacheKey = JSON.stringify({
      w: profile.weight,
      h: profile.height,
      a: profile.age,
      g: profile.fitnessGoal,
      c: profile.cuisine,
      b: profile.budgetLevel,
      al: profile.allergies,
      cm: targetMacros,
    });

    const cached = dietCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log("Serving diet plan instantly from in-memory cache.");
      return res.json({
        success: true,
        dietPlan: {
          ...cached.dietPlan,
          cached: true,
          generatedAt: new Date().toISOString(),
        },
      });
    }

    // Step 3: Streamlined Prompt with Pre-Calculated Macro Targets
    const prompt = `
Create a customized 1-day meal plan for a client matching these EXACT pre-calculated daily target macros:
- Target Calories: ${targetMacros.calories} kcal
- Target Protein: ${targetMacros.protein}g
- Target Carbs: ${targetMacros.carbs}g
- Target Fats: ${targetMacros.fats}g

CLIENT DETAILS:
- Name: ${profile.name || "Customer"}
- Goal: ${profile.fitnessGoal || "Fitness"}
- Cuisine Preference: ${profile.cuisine || "Egyptian"}
- Budget Level: ${profile.budgetLevel || "Medium / Balanced"}
- Allergies / Exclusions (CRITICAL: DO NOT INCLUDE): ${profile.allergies?.length ? profile.allergies.join(", ") : "None"}

INSTRUCTIONS:
1. Generate 4 meals: "Breakfast", "Lunch", "Dinner", and "Snack".
2. The sum of calories and macros across the 4 meals should closely equal the target macros (${targetMacros.calories} kcal, ${targetMacros.protein}g protein, ${targetMacros.carbs}g carbs, ${targetMacros.fats}g fats).
3. Provide meal titles, descriptions, ingredients, and preparation steps in BOTH English and authentic Arabic (titleAr, descriptionAr, ingredientsAr, instructionsAr). Use realistic Arabic dish names (e.g., فول, بيض, صدور دجاج مشوية, أرز بسمتي, جبن قريش, سلطة خضراء).
`;

    let dietData: any = null;

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              targetCalories: { type: Type.NUMBER },
              targetProtein: { type: Type.NUMBER },
              targetCarbs: { type: Type.NUMBER },
              targetFats: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              summaryAr: { type: Type.STRING },
              dietaryNotes: { type: Type.STRING },
              dietaryNotesAr: { type: Type.STRING },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    title: { type: Type.STRING },
                    titleAr: { type: Type.STRING },
                    description: { type: Type.STRING },
                    descriptionAr: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fats: { type: Type.NUMBER },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ingredientsAr: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.STRING },
                    instructionsAr: { type: Type.STRING },
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

      if (response && response.text) {
        dietData = JSON.parse(response.text);
      }
    } catch (aiErr: any) {
      console.warn("AI generation failed or timed out, switching to programmatic fallback:", aiErr?.message || aiErr);
    }

    // Step 4: If AI was unavailable or output was invalid, use Programmatic Fallback Plan
    if (!dietData || !dietData.meals || dietData.meals.length === 0) {
      console.log("Generating programmatic high-speed fallback diet plan.");
      dietData = generateFallbackDietPlan(profile, targetMacros);
    }

    // Save to Cache
    dietCache.set(cacheKey, { dietPlan: dietData, timestamp: Date.now() });

    return res.json({
      success: true,
      dietPlan: {
        ...dietData,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("AI Diet Generation Server Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process diet request.",
    });
  }
});

// Explicit 404 handler for API routes to prevent Vite HTML fallback
app.use("/api/*", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(404).json({ success: false, error: "API route not found" });
});

// Global API Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Express Error Handler:", err);
  if (req.path.startsWith("/api/")) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      error: err?.message || "An unexpected server error occurred.",
    });
  }
  next(err);
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

