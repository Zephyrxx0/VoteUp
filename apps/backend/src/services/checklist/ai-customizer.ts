import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import type { ChecklistTemplate } from './template-provider.ts';

const checklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  stage: z.number().int().min(1).max(8),
  isMandatory: z.boolean(),
  category: z.string(),
});

const checklistTemplateSchema = z.object({
  stage: z.number().int().min(1).max(8),
  stageName: z.string(),
  items: z.array(checklistItemSchema),
});

type ContentGenerator = {
  generateContent(prompt: string): Promise<{ response: { text(): string } }>;
};

const SIMPLE_INSTRUCTION_SYSTEM_PROMPT = [
  'You are a civic checklist customizer for Indian election stages.',
  'You must only modify checklist item "title" and "description" text.',
  'Keep instructions simple, short, and actionable for mobile readers.',
  'Ground details for the provided constituency and stage with realistic places and timelines.',
  'Never remove items or change IDs, categories, mandatory flags, stage, or stageName.',
  'Return JSON only with the exact same structure as input template.',
].join(' ');

export class AICustomizer {
  private readonly model: ContentGenerator | null;

  constructor(model?: ContentGenerator) {
    if (model) {
      this.model = model;
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.model = null;
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: SIMPLE_INSTRUCTION_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
  }

  async customize(
    template: ChecklistTemplate,
    constituency: string,
    stage: number,
  ): Promise<ChecklistTemplate> {
    if (!this.model) {
      return template;
    }

    const prompt = [
      `Constituency: ${constituency}`,
      `Stage: ${stage}`,
      'Update only item title and description with localized realistic deadlines/offices.',
      'Do not alter IDs, category, isMandatory, stage, stageName, or item count.',
      `Template JSON: ${JSON.stringify(template)}`,
    ].join('\n');

    try {
      const result = await this.model.generateContent(prompt);
      const raw = result.response.text();
      const parsed = JSON.parse(raw) as unknown;
      return checklistTemplateSchema.parse(parsed) as ChecklistTemplate;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[AICustomizer] Gemini customization failed, using static template fallback.', errorMessage);
      return template;
    }
  }
}
