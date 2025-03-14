const dbService = require('./dbService');
const scrapingService = require('./scrapingService');
const config = require('../config/config');

class RefreshWorker {
  constructor() {
    this.isRunning = false;
    this.interval = config.cache.staleCheckInterval * 1000; // Convert to milliseconds
  }
  
  /**
   * Start the refresh worker
   */
  async start() {
    console.log(`Starting refresh worker with ${this.interval / 60000} minute interval`);
    setInterval(() => this.refreshStaleData(), this.interval);
  }
  
  /**
   * Stop the refresh worker
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  /**
   * Refresh stale data in the database
   */
  async refreshStaleData() {
    if (this.isRunning) {
      console.log('Refresh worker is already running, skipping this run');
      return;
    }
    
    this.isRunning = true;
    console.log('Refresh worker checking for stale search results...');
    
    try {
      // Get stale results (older than 2 hours)
      const staleResults = await dbService.getStaleSearchResults(5); // Limit to 5 at a time
      
      if (staleResults.length === 0) {
        console.log('No stale search results found');
        this.isRunning = false;
        return;
      }
      
      console.log(`Found ${staleResults.length} stale search results to refresh`);
      
      // Process each stale result
      for (const result of staleResults) {
        if (await this.shouldRefreshResult(result)) {
          try {
            console.log(`Refreshing search results for query: "${result.query}"`);
            
            // Extract options
            const options = {
              page: result.options.page || 1,
              sort: result.options.sort || 'relevance',
              priceMin: result.options.priceMin || null,
              priceMax: result.options.priceMax || null,
              categories: result.options.categories || [],
              brands: result.options.brands || [],
              discounted: result.options.discounted || false
            };
            
            // Get fresh data from scraping service
            const freshResults = await scrapingService.searchProducts(result.query, options);
            
            if (freshResults && freshResults.products && freshResults.products.length > 0) {
              // Save the refreshed data
              await dbService.saveSearchResults(result.query, options, freshResults);
              console.log(`Successfully refreshed results for query: "${result.query}"`);
            } else {
              // If scraping fails, just update the timestamp to prevent constant retries
              await dbService.updateRefreshTimestamp(result._id);
              console.log(`Failed to get fresh data for query: "${result.query}", updated timestamp only`);
            }
            
            // Add a small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            
          } catch (error) {
            console.error(`Error refreshing search results for query "${result.query}":`, error);
            // Update timestamp anyway to prevent constant retries of failing queries
            await dbService.updateRefreshTimestamp(result._id);
          }
        } else {
          console.log(`Skipping refresh for "${result.query}" - Not yet needed`);
        }
      }
      
    } catch (error) {
      console.error('Error in refresh worker:', error);
    } finally {
      this.isRunning = false;
      console.log('Refresh worker completed');
    }
  }

  async shouldRefreshResult(result) {
    if (!result.lastRefreshed) return true;

    const now = Date.now();
    const age = now - new Date(result.lastRefreshed).getTime();
    
    // Check if data is older than maxStaleAge
    if (age > config.cache.maxStaleAge * 1000) return true;

    // Check if minimum refresh interval has passed
    return age > config.cache.minRefreshInterval * 1000;
  }
}

module.exports = new RefreshWorker();