
import { FilterResult } from './types';
import { MALICIOUS_PATTERNS, SUSPICIOUS_KEYWORDS } from './patterns';

export class MaliciousContentFilter {
  static check(content: string): FilterResult {
    const lowerContent = content.toLowerCase();

    // Check regex patterns
    for (const pattern of MALICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        return {
          allowed: false,
          confidence: 0.9,
          reason: 'Malicious pattern detected',
          category: 'malicious',
          suggestions: ['Try rephrasing your request without technical jargon', 'Be more specific about what you need help with']
        };
      }
    }

    // Check suspicious keywords
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (lowerContent.includes(keyword)) {
        return {
          allowed: false,
          confidence: 0.85,
          reason: `Suspicious instruction detected: "${keyword}"`,
          category: 'malicious',
          suggestions: ['Rephrase your question more naturally', 'Ask directly for what you need help with']
        };
      }
    }

    return { allowed: true, confidence: 0.8 };
  }
}
