/**
 * Gemini AI Service for Nourish
 * - Multimodal Food Recognition & Calorie Estimation
 * - Personalized Mindful Nutrition Assistant ("Sage") integrating Google Health Telemetry
 * - Strict schema parsing, rate-limit resilience, and model fallbacks
 */

import { GoogleGenAI } from '@google/genai';
import { HealthTelemetry } from './googleHealth';

export interface FoodRecognitionItem {
  id: string;
  name: string;
  baseCal: number;
  weightG: number;
  iconType: 'fish' | 'grain' | 'leaf' | 'egg' | 'apple';
  desc: string;
}

export interface FoodRecognitionResult {
  plateName: string;
  confidence: number;
  totalCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  items: FoodRecognitionItem[];
  mindfulNotes: string;
}

export function getGeminiClient(): { ai: GoogleGenAI | null; apiKey?: string } {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return { ai: null };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'nourish-mindful-wellness',
      },
    },
  });

  return { ai, apiKey };
}

const VISION_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
const TEXT_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];

/**
 * Recognizes food plate from an image using Gemini Vision
 */
export async function recognizeFoodPlate(
  base64Data: string,
  mimeType = 'image/jpeg',
  userHint?: string
): Promise<FoodRecognitionResult> {
  const { ai } = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables. Please add your Gemini API key to .env.local.');
  }

  // Sanitize base64 payload
  const cleanedBase64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

  const prompt = `You are the culinary and nutritional vision engine for Nourish, an artisanal mindful wellness application.
Analyze this meal image carefully and identify the visible food components, portion estimates, and macronutrients.
${userHint ? `User note / context: "${userHint}"` : ''}

You must respond ONLY with a valid JSON object matching this schema:
{
  "plateName": "A descriptive, sensory culinary name for this dish",
  "confidence": 0.94,
  "totalCalories": 420,
  "proteinG": 28,
  "carbsG": 36,
  "fatG": 14,
  "items": [
    {
      "id": "item-1",
      "name": "Grilled Wild Salmon",
      "baseCal": 210,
      "weightG": 140,
      "iconType": "fish", // must be one of: "fish", "grain", "leaf", "egg", "apple"
      "desc": "Wild-caught fillet"
    }
  ],
  "mindfulNotes": "A brief 1-2 sentence mindful comment on nourishment, fiber, or micronutrient harmony."
}

Rules:
1. Provide realistic portion weights (in grams) and calorie numbers.
2. Ensure the sum of item calories roughly equals totalCalories.
3. iconType must be strictly one of: "fish", "grain", "leaf", "egg", "apple".
4. If food is not clearly recognizable, provide your best estimation and reflect realistic lower confidence (e.g. 0.70).
5. Output strict JSON only. Do not include markdown codeblocks or extra text.`;

  let lastError: any = null;

  for (const modelName of VISION_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: cleanedBase64,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) continue;

      // Clean any accidental markdown wrap
      const jsonStr = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(jsonStr) as FoodRecognitionResult;

      // Validate structure
      if (parsed.plateName && Array.isArray(parsed.items) && parsed.items.length > 0) {
        // Normalize IDs and icon types
        parsed.items = parsed.items.map((it, idx) => ({
          id: it.id || `rec-${Date.now()}-${idx}`,
          name: it.name || 'Nourishing Component',
          baseCal: Math.round(Number(it.baseCal) || 50),
          weightG: Math.round(Number(it.weightG) || 50),
          iconType: ['fish', 'grain', 'leaf', 'egg', 'apple'].includes(it.iconType) ? it.iconType : 'leaf',
          desc: it.desc || 'Fresh ingredient',
        }));

        parsed.totalCalories = Math.round(Number(parsed.totalCalories) || parsed.items.reduce((s, i) => s + i.baseCal, 0));
        parsed.proteinG = Math.round(Number(parsed.proteinG) || Math.round(parsed.totalCalories * 0.065));
        parsed.carbsG = Math.round(Number(parsed.carbsG) || Math.round(parsed.totalCalories * 0.08));
        parsed.fatG = Math.round(Number(parsed.fatG) || Math.round(parsed.totalCalories * 0.04));
        parsed.confidence = Math.min(0.99, Math.max(0.5, Number(parsed.confidence) || 0.9));

        return parsed;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Vision model ${modelName} error, trying fallback...`, err?.message || err);
    }
  }

  throw new Error(`Failed to recognize food plate: ${lastError?.message || 'Gemini Vision endpoint was unreachable.'}`);
}

/**
 * Generates personalized mindful chat response integrating Google Health telemetry
 */
export async function generateSageChatReply(
  messages: Array<{ role: string; content: string }>,
  userContext: any,
  healthTelemetry?: HealthTelemetry | null
): Promise<string> {
  const { ai } = getGeminiClient();

  // Incorporate Google Health data into system instruction if connected
  const healthSnippet = healthTelemetry
    ? `Live Google Health Synchronization:
- Daily Steps: ${healthTelemetry.stepsToday.toLocaleString()}
- Active Calories Burned Today: ${healthTelemetry.activeCaloriesBurned} kcal
- Active Minutes: ${healthTelemetry.activeMinutesToday} min
- Last Health Sync: ${healthTelemetry.lastSyncTime}`
    : 'Live Google Health: Disconnected / Not yet synced today.';

  const systemInstruction = `You are "Sage", the mindful wellness companion and nutrition guide inside Nourish.
Your tone is warm, serene, encouraging, and sensory-rich—reflecting high-end culinary mindfulness and holistic living.
Never judge, shame, or induce guilt around calories, portion sizes, or food choices.
Frame nourishment through balance, energy resilience, cellular vitality, and self-compassion.

Current User Context:
- User Name: ${userContext?.userName || 'Alex'}
- Daily Calorie Target: ${userContext?.dailyCalories || 2000} kcal
- Consumed Today: ${userContext?.consumedCalories || 1240} kcal (${userContext?.remainingCalories || 760} kcal remaining)
- Hydration: ${userContext?.consumedWater || 1250} ml / ${userContext?.dailyHydration || 2000} ml goal (${userContext?.remainingWater || 750} ml left)
- Meals Logged Today: ${userContext?.mealsSummary || 'Breakfast (420 kcal), Lunch (580 kcal), Snacks (240 kcal)'}
- ${healthSnippet}
- Preferences: Mass Unit: ${userContext?.massUnit || 'Metric'}, Energy Unit: ${userContext?.energyUnit || 'kcal'}

Guidelines for your responses:
1. Provide practical, delicious, whole-food suggestions that fit the remaining calories and macronutrients if requested.
2. If Google Health reports active calories burned, gently factor that into the user's energy expenditure and recovery suggestions.
3. For hydration, give gentle encouragement and explain the benefits of mindful water intake.
4. Keep advice clear, concise, and structured with subtle bullet points or gentle prose.
5. If the user asks about logging food or water, invite them to use Nourish's AI lens or fluid carafe tracker.`;

  if (!ai) {
    const remainingKcal = userContext?.remainingCalories || 760;
    const burnedInfo = healthTelemetry?.activeCaloriesBurned
      ? ` With ${healthTelemetry.activeCaloriesBurned} kcal of mindful active burn logged from Google Health, your energy vitality is steady.`
      : '';
    return `Hello ${userContext?.userName || 'Alex'}. As your Nourish guide, I'm here to support your mindful rhythm. You have approximately ${remainingKcal} kcal remaining today, with ${userContext?.remainingWater || 750} ml left to reach your fluid anchor.${burnedInfo} For dinner, a warm bowl of wild roasted vegetables with tahini and grilled protein would harmonize beautifully. What mindful question can I help you explore?`;
  }

  const contents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  for (const modelName of TEXT_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Sage text model ${modelName} returned error:`, err?.message || err);
    }
  }

  throw new Error('Mindful assistant endpoint was unable to generate a response.');
}
