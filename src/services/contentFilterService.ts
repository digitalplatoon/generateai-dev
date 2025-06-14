
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

export class ContentFilterService {
  private static readonly MALICIOUS_PATTERNS = [
    // Prompt injection patterns
    /(?:prompt|instruction|system)[\s\S]*(?:ignore|forget|disregard|override)/i,
    /(?:new|different|alternative)[\s\S]*(?:instructions|prompt|system)/i,
    
    // Jailbreak attempts
    /(?:jailbreak|bypass|hack|exploit)[\s\S]*(?:system|safety|filter)/i,
    /(?:pretend|roleplay|act as)[\s\S]*(?:admin|root|developer|system)/i,
    
    // Code injection
    /(?:script|javascript|html|sql|injection|execute|eval|run)[\s\S]*(?:code|command)/i,
    
    // Social engineering
    /(?:confidential|secret|private)[\s\S]*(?:information|data|key|token)/i,
    /(?:access|login|password)[\s\S]*(?:admin|system|database)/i
  ];

  private static readonly SUSPICIOUS_KEYWORDS = [
    'ignore previous instructions',
    'forget everything above',
    'disregard safety guidelines',
    'new instructions begin',
    'system override activated',
    'admin mode enabled',
    'developer mode on',
    'debug mode active',
    'bypass content filter',
    'jailbreak prompt',
    'act as admin',
    'pretend to be system',
    'role play as',
    'you are now',
    'new personality',
    'different character'
  ];

  private static readonly SPAM_INDICATORS = [
    'click here now',
    'limited time offer',
    'act fast',
    'free money',
    'get rich quick',
    'work from home',
    'lose weight fast',
    'miracle cure'
  ];

  static filterContent(text: string, strictMode: boolean = false): FilterResult {
    try {
      // Validate input
      const validatedInput = contentFilterSchema.parse({ text, strictMode });
      const content = validatedInput.text;
      
      // Check for malicious patterns
      const maliciousResult = this.checkMaliciousContent(content);
      if (!maliciousResult.allowed) {
        return maliciousResult;
      }

      // Check for suspicious content
      const suspiciousResult = this.checkSuspiciousContent(content, strictMode);
      if (!suspiciousResult.allowed) {
        return suspiciousResult;
      }

      // Check for spam
      const spamResult = this.checkSpamContent(content);
      if (!spamResult.allowed && strictMode) {
        return spamResult;
      }

      // Check for repetition/stuffing
      const repetitionResult = this.checkRepetition(content);
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

  private static checkMaliciousContent(content: string): FilterResult {
    const lowerContent = content.toLowerCase();

    // Check regex patterns
    for (const pattern of this.MALICIOUS_PATTERNS) {
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
    for (const keyword of this.SUSPICIOUS_KEYWORDS) {
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

  private static checkSuspiciousContent(content: string, strictMode: boolean): FilterResult {
    const lowerContent = content.toLowerCase();
    
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

  private static checkSpamContent(content: string): FilterResult {
    const lowerContent = content.toLowerCase();
    let spamScore = 0;

    for (const indicator of this.SPAM_INDICATORS) {
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

  private static checkRepetition(content: string): FilterResult {
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

  static sanitizeContent(content: string): string {
    return content
      // Remove excessive whitespace
      .replace(/\s{3,}/g, ' ')
      // Remove excessive punctuation
      .replace(/[!?]{3,}/g, '!!')
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Trim
      .trim();
  }
}
