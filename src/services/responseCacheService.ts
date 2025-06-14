import { supabase } from '@/integrations/supabase/client';

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
      
      // First check if we have a cached response
      const { data, error } = await supabase
        .from('ai_response_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.log('No cache hit for key:', cacheKey);
        return null;
      }

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

      // Store the cached response
      const { error } = await supabase
        .from('ai_response_cache')
        .upsert({
          cache_key: cacheKey,
          response_data: response,
          model_used: modelUsed,
          settings_hash: settingsHash,
          expires_at: expiresAt.toISOString()
        });

      if (error) {
        console.error('Error caching response:', error);
      } else {
        console.log('Response cached with key:', cacheKey);
      }
    } catch (error) {
      console.error('Error in cache storage:', error);
    }
  }

  static async cleanupCache(): Promise<void> {
    try {
      // Remove expired entries
      await supabase
        .from('ai_response_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());

      // Keep only the most recent entries if we exceed max size
      const { data: count } = await supabase
        .from('ai_response_cache')
        .select('id', { count: 'exact' });

      if (count && count.length > this.MAX_CACHE_SIZE) {
        const { data: oldEntries } = await supabase
          .from('ai_response_cache')
          .select('id')
          .order('created_at', { ascending: true })
          .limit(count.length - this.MAX_CACHE_SIZE);

        if (oldEntries && oldEntries.length > 0) {
          const idsToDelete = oldEntries.map(entry => entry.id);
          await supabase
            .from('ai_response_cache')
            .delete()
            .in('id', idsToDelete);
        }
      }

      console.log('Cache cleanup completed');
    } catch (error) {
      console.error('Error during cache cleanup:', error);
    }
  }

  static async invalidateCache(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        await supabase
          .from('ai_response_cache')
          .delete()
          .like('cache_key', `%${pattern}%`);
      } else {
        await supabase
          .from('ai_response_cache')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      }
      console.log('Cache invalidated');
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  }
}
