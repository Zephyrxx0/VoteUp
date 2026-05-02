import { z } from 'zod';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  stage: number;
  isMandatory: boolean;
  category: string;
}

export interface ChecklistTemplate {
  stage: number;
  stageName: string;
  items: ChecklistItem[];
}

export interface UserChecklist {
  userId: string;
  items: Record<string, { completed: boolean; completedAt?: string }>;
}

export const checklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  stage: z.number().int().min(1).max(8),
  isMandatory: z.boolean(),
  category: z.string(),
});

export const checklistTemplateSchema = z.object({
  stage: z.number().int().min(1).max(8),
  stageName: z.string(),
  items: z.array(checklistItemSchema),
});

export const userChecklistItemStateSchema = z.object({
  completed: z.boolean(),
  completedAt: z.string().optional(),
});

export const userChecklistSchema = z.object({
  userId: z.string(),
  items: z.record(userChecklistItemStateSchema),
});

export type ChecklistItemSchema = z.infer<typeof checklistItemSchema>;
export type ChecklistTemplateSchema = z.infer<typeof checklistTemplateSchema>;
export type UserChecklistSchema = z.infer<typeof userChecklistSchema>;
