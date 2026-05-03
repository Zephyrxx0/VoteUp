import { z } from 'zod';
import { CountryCode, LanguageCode } from './primitives';

export type ElectionSystemType = 
  | 'fptp_parliamentary' 
  | 'proportional_parliamentary'
  | 'presidential_republic'
  | 'mixed_member_proportional'
  | 'preferential_voting';

export interface ElectionRef {
  id: string;
  name: string;
  date: string;
}

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  electionSystemType: ElectionSystemType;
  electionBody: string;
  electionBodyUrl: string;
  defaultLanguage: LanguageCode;
  officialSourceUrls: string[];
  isDestinationSupported: boolean;
  isHomeSupported: boolean;
  activeElections: ElectionRef[];
}

export const countrySchema = z.object({
  code: z.string().length(2),
  name: z.string(),
  flag: z.string(),
  electionSystemType: z.enum([
    'fptp_parliamentary', 
    'proportional_parliamentary',
    'presidential_republic',
    'mixed_member_proportional',
    'preferential_voting'
  ]),
  electionBody: z.string(),
  electionBodyUrl: z.string().url(),
  defaultLanguage: z.string(),
  officialSourceUrls: z.array(z.string().url()),
  isDestinationSupported: z.boolean(),
  isHomeSupported: z.boolean(),
  activeElections: z.array(z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
  }))
});
