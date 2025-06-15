
import { contentFilterSchema, FilterResult } from './types';
import { MaliciousContentFilter } from './maliciousFilter';
import { SuspiciousContentFilter } from './suspiciousFilter';
import { SpamContentFilter } from './spamFilter';
import { RepetitionFilter } from './repetitionFilter';
import { ContentSanitizer } from './sanitizer';

export type { FilterResult };
export { ContentSanitizer };

export class ContentFilterService {
  static filterContent(text: string, strictMode: boolean = false): FilterResult {
    try {
      // Validate input
      const validatedInput = contentFilterSchema.parse({ text, strictMode });
      const content = validatedInput.text;
      
      // Check for malicious patterns
      const maliciousResult = MaliciousContentFilter.check(content);
      if (!maliciousResult.allowed) {
        return maliciousResult;
      }

      // Check for suspicious content
      const suspiciousResult = SuspiciousContentFilter.check(content, strictMode);
      if (!suspiciousResult.allowed) {
        return suspiciousResult;
      }

      // Check for spam
      const spamResult = SpamContentFilter.check(content);
      if (!spamResult.allowed && strictMode) {
        return spamResult;
      }

      // Check for repetition/stuffing
      const repetitionResult = RepetitionFilter.check(content);
      if (!repetitionResult.allowed) {
        return repetitionResult;
      }

      return {
        allowed: true,
        confidence: 0.95,
        reason: 'Content passed all filters'
      };

    } catch (error) {
      console.error('Content filtering error:', error);
      return {
        allowed: false,
        confidence: 0.0,
        reason: 'Content validation failed',
        category: 'malicious'
      };
    }
  }

  static sanitizeContent = ContentSanitizer.sanitize;
}
