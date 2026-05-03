import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const homeCountrySchema = z
  .string()
  .trim()
  .min(2, 'homeCountry must be at least 2 characters')
  .max(80, 'homeCountry must be at most 80 characters');

const comparisonItemSchema = z.object({
  category: z.string().trim().min(1),
  homeCountryValue: z.string().trim().min(1),
  indiaValue: z.string().trim().min(1),
});

const comparisonResponseSchema = z.object({
  comparison: z.array(comparisonItemSchema).min(1),
});

export type ComparisonResponse = z.infer<typeof comparisonResponseSchema>;

export async function generateComparison(homeCountry: string): Promise<ComparisonResponse> {
  const normalizedHomeCountry = homeCountrySchema.parse(homeCountry);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required to generate AI comparisons');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = [
    'Compare election systems between the provided home country and India.',
    `Home country: ${normalizedHomeCountry}`,
    'Return strict JSON only in this shape:',
    JSON.stringify({
      comparison: [
        {
          category: 'Election Authority',
          homeCountryValue: 'Equivalent authority in home country',
          indiaValue: 'Election Commission of India',
        },
      ],
    }),
    'Include 4 to 6 comparison items with concise factual phrases.',
  ].join('\n');

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed = JSON.parse(raw) as unknown;
  return comparisonResponseSchema.parse(parsed);
}
