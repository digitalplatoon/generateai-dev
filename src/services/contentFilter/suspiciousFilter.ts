
import { FilterResult } from './types';

export class SuspiciousContentFilter {
  static check(content: string, strictMode: boolean): FilterResult {
    // Check for excessive capitalization
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.7 && content.length > 50) {
      return {
        allowed: !strictMode,
        confidence: 0.7,
        reason: 'Excessive capitalization detected',
        category: 'suspicious',
        suggestions: ['Try using normal capitalization']
      };
    }

    // Check for excessive punctuation
    const punctRatio = (content.match(/[!?]{2,}/g) || []).length;
    if (punctRatio > 3) {
      return {
        allowed: !strictMode,
        confidence: 0.6,
        reason: 'Excessive punctuation detected',
        category: 'suspicious',
        suggestions: ['Reduce the number of exclamation marks']
      };
    }

    return { allowed: true, confidence: 0.7 };
  }
}
