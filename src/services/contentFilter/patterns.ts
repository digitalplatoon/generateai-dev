
// Malicious content patterns for security filtering
export const MALICIOUS_PATTERNS = [
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

export const SUSPICIOUS_KEYWORDS = [
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

export const SPAM_INDICATORS = [
  'click here now',
  'limited time offer',
  'act fast',
  'free money',
  'get rich quick',
  'work from home',
  'lose weight fast',
  'miracle cure'
];
