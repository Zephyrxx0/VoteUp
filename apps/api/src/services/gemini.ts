import { GoogleGenAI, Type } from "@google/genai";
import {
  StageComparison,
  TranslatedComparison,
  PersonalisedActions
} from '@voteup/contracts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateComparison(
  homeCountryCode: string,
  newCountryCode: string,
  stageId: string,
  homeSystemName: string,
  newSystemName: string
): Promise<StageComparison> {
  const prompt = `Compare the electoral systems of ${homeCountryCode} (${homeSystemName}) and ${newCountryCode} (${newSystemName}) for the stage '${stageId}'. Provide a summary for both and 3 key differences.`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          homeCountryCode: { type: Type.STRING },
          newCountryCode: { type: Type.STRING },
          stageId: { type: Type.STRING },
          homeSummary: { type: Type.STRING },
          newSummary: { type: Type.STRING },
          keyDifferences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dimension: { type: Type.STRING },
                homeValue: { type: Type.STRING },
                newValue: { type: Type.STRING }
              },
              required: ["dimension", "homeValue", "newValue"]
            }
          }
        },
        required: ["homeCountryCode", "newCountryCode", "stageId", "homeSummary", "newSummary", "keyDifferences"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as StageComparison;
}

export async function generateActions(
  countryCode: string,
  stageId: string,
  stageName: string
): Promise<PersonalisedActions> {
  const prompt = `Generate personalized, actionable steps for a voter in ${countryCode} during the '${stageName}' (${stageId}) stage of their election. Return exactly 3 action items (prioritized) and 1 map location.`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stageId: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['urgent', 'high', 'normal'] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ctaType: { type: Type.STRING, enum: ['external_url', 'calendar_add', 'map_view', 'none'] }
              },
              required: ["id", "priority", "title", "description", "ctaType"]
            }
          },
          mapLocations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                address: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['registration_office', 'polling_station', 'support_org'] }
              },
              required: ["name", "lat", "lng", "address", "type"]
            }
          }
        },
        required: ["stageId", "items", "mapLocations"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as PersonalisedActions;
}

export async function translateContent<T>(content: string, targetLang: string): Promise<string> {
  const prompt = `Translate the following JSON string into ${targetLang}. Preserve all JSON keys, structure, and formatting. Only translate the human-readable values. \n\n${content}`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return response.text || '';
}

export async function streamQA(prompt: string, context: string, onToken: (token: string) => void): Promise<string> {
  const fullPrompt = `Context:\n${context}\n\nQuestion:\n${prompt}\n\nAnswer concisely based on the context:`;

  const responseStream = await ai.models.generateContentStream({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    contents: fullPrompt
  });

  let fullResponse = '';
  for await (const chunk of responseStream) {
    if (chunk.text) {
      fullResponse += chunk.text;
      onToken(chunk.text);
    }
  }
  return fullResponse;
}
