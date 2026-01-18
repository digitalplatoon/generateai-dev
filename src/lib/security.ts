
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Content sanitization
export const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
};

export const sanitizeText = (text: string): string => {
  return text.trim().replace(/[<>]/g, '');
};

// Input validation schemas
export const chatMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message too long')
    .refine(msg => msg.trim().length > 0, 'Message cannot be only whitespace'),
});

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long'),
  company: z.string()
    .max(100, 'Company name too long')
    .optional(),
  inquiryType: z.enum(['general', 'support', 'partnership', 'enterprise', 'press']),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long'),
});

export const authSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .optional(),
});

/**
 * CLIENT-SIDE RATE LIMITING
 * 
 * IMPORTANT: This is for UX purposes only - to prevent accidental rapid requests
 * and provide immediate feedback to users. This is NOT a security measure.
 * 
 * Attackers can easily bypass this by:
 * - Clearing browser state
 * - Opening multiple tabs/sessions
 * - Modifying client-side code
 * 
 * REAL rate limiting is enforced server-side:
 * - Edge functions check authentication before processing
 * - rag_rate_limits table tracks server-side limits
 * - check_rag_rate_limit database function enforces limits
 */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (now - userLimit.timestamp > windowMs) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
};

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.timestamp > 300000) { // Clean up entries older than 5 minutes
      rateLimitMap.delete(key);
    }
  }
}, 300000);

// Security headers utility
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co",
});
