
import { FilterResult } from './types';

export class RepetitionFilter {
  static check(content: string): FilterResult {
    const words = content.split(/\s+/);
    const wordCount = words.length;
    
    if (wordCount < 10) return { allowed: true, confidence: 0.9 };

    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const uniqueRatio = uniqueWords / wordCount;

    // Check for prompt stuffing (low unique word ratio)
    if (uniqueRatio < 0.3 && wordCount > 50) {
      return {
        allowed: false,
        confidence: 0.85,
        reason: 'Potential prompt stuffing detected',
        category: 'malicious',
        suggestions: ['Avoid repeating the same words multiple times', 'Be more concise in your request']
      };
    }

    // Check for character repetition
    const charRepetition = /(.)\1{10,}/.test(content);
    if (charRepetition) {
      return {
        allowed: false,
        confidence: 0.9,
        reason: 'Excessive character repetition detected',
        category: 'spam',
        suggestions: ['Remove repeated characters']
      };
    }

    return { allowed: true, confidence: 0.8 };
  }
}
