import { z } from 'zod';

export const EncryptedVoterDataSchema = z.object({
  ciphertext: z.string(),
  iv: z.string(),
  salt: z.string(),
});

export const UserProfileSchema = z.object({
  history: z.array(z.string()),
  badges: z.array(z.string()),
  homeCountry: z.string().optional(),
  newCountry: z.string().optional(),
  preferredLanguage: z.string().optional(),
  registrationStatus: z.string().optional(),
  encryptedVoterData: EncryptedVoterDataSchema.optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
