
import { FilterResult } from './types';
import { SPAM_INDICATORS } from './patterns';

export class SpamContentFilter {
  static check(content: string): FilterResult {
    const lowerContent = content.toLowerCase();
    let spamScore = 0;

    for (const indicator of SPAM_INDICATORS) {
      if (lowerContent.includes(indicator)) {
        spamScore += 1;
      }
    }

    if (spamScore >= 2) {
      return {
        allowed: false,
        confidence: 0.8,
        reason: 'Spam content detected',
        category: 'spam',
        suggestions: ['Focus on asking genuine questions', 'Avoid promotional language']
      };
    }

    return { allowed: true, confidence: 0.6 };
  }
}
