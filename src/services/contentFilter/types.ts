
import { z } from 'zod';

// Content filtering schema
export const contentFilterSchema = z.object({
  text: z.string().min(1).max(10000),
  strictMode: z.boolean().default(false)
});

export interface FilterResult {
  allowed: boolean;
  confidence: number;
  reason?: string;
  category?: 'malicious' | 'suspicious' | 'spam' | 'inappropriate';
  suggestions?: string[];
}
