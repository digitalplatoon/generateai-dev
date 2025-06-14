
interface CacheEntry {
  id: string;
  cache_key: string;
  response_data: any;
  model_used: string;
  settings_hash: string;
  expires_at: string;
  created_at: string;
}

export class ResponseCacheService {
  private static readonly CACHE_DURATION_HOURS = 24;
  private static readonly MAX_CACHE_SIZE = 1000;

  static generateCacheKey(messages: any[], settings: any): string {
    const messageContent = messages.map(m => `${m.role}:${m.content}`).join('|');
    const settingsString = JSON.stringify({
      model: settings.model,
      temperature: Math.round(settings.temperature * 10) / 10, // Round to 1 decimal
      max_tokens: settings.max_tokens
    });
    
    // Create a simple hash
    const content = messageContent + settingsString;
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `cache_${Math.abs(hash).toString(36)}`;
  }

  static generateSettingsHash(settings: any): string {
    const normalized = {
      model: settings.model || 'gpt-4o-mini',
      temperature: Math.round((settings.temperature || 0.7) * 10) / 10,
      max_tokens: settings.max_tokens || 1000
    };
    return btoa(JSON.stringify(normalized)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  static async getCachedResponse(messages: any[], settings: any): Promise<any | null> {
    try {
      const cacheKey = this.generateCacheKey(messages, settings);
      
      // Use a direct SQL query approach for now
      const response = await fetch('/api/cache/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cache_key: cacheKey })
      });

      if (!response.ok) {
        console.log('No cache hit for key:', cacheKey);
        return null;
      }

      const data = await response.json();
      console.log('Cache hit for key:', cacheKey);
      return data.response_data;
    } catch (error) {
      console.error('Error retrieving cached response:', error);
      return null;
    }
  }

  static async cacheResponse(
    messages: any[], 
    settings: any, 
    response: any, 
    modelUsed: string
  ): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(messages, settings);
      const settingsHash = this.generateSettingsHash(settings);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.CACHE_DURATION_HOURS);

      // Clean up old cache entries occasionally
      if (Math.random() < 0.1) { // 10% chance
        await this.cleanupCache();
      }

      // Store the cached response using direct API
      await fetch('/api/cache/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cache_key: cacheKey,
          response_data: response,
          model_used: modelUsed,
          settings_hash: settingsHash,
          expires_at: expiresAt.toISOString()
        })
      });

      console.log('Response cached with key:', cacheKey);
    } catch (error) {
      console.error('Error in cache storage:', error);
    }
  }

  static async cleanupCache(): Promise<void> {
    try {
      // Clean up expired entries via API
      await fetch('/api/cache/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_size: this.MAX_CACHE_SIZE })
      });

      console.log('Cache cleanup completed');
    } catch (error) {
      console.error('Error during cache cleanup:', error);
    }
  }

  static async invalidateCache(pattern?: string): Promise<void> {
    try {
      await fetch('/api/cache/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern })
      });
      
      console.log('Cache invalidated');
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  }
}
