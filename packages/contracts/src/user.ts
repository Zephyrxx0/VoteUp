import { z } from 'zod';

export const EncryptedVoterDataSchema = z.object({
  ciphertext: z.string(),
  iv: z.string(),
  salt: z.string(),
});

export const UserProfileSchema = z.object({
  history: z.array(z.string()),
  badges: z.array(z.string()),
  encryptedVoterData: EncryptedVoterDataSchema.optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
