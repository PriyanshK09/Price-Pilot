/**
 * Simple in-memory cache service
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.initCleanupInterval();
  }
  
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} - Cached value or undefined if not found
   */
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    const item = this.cache.get(key);
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  set(key, value, ttl = 3600) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000)
    });
  }
  
  /**
   * Remove value from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }
  
  /**
   * Clear all cached values
   */
  clear() {
    this.cache.clear();
  }
  
  /**
   * Initialize automatic cleanup interval
   * Removes expired items every hour
   */
  initCleanupInterval() {
    // Clean up expired cache items every hour
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiry) {
          this.cache.delete(key);
        }
      }
    }, 3600 * 1000);
  }
}

module.exports = new CacheService();