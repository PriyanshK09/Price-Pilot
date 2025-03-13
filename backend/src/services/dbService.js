const SearchResult = require('../models/SearchResult');
const mongoose = require('mongoose');
const { ApiError } = require('../middleware/errorHandler');

class DbService {
  /**
   * Create cache key object for MongoDB query
   * @param {string} query - Search query
   * @param {object} options - Search options 
   */
  createCacheKey(query, options) {
    return {
      query: query.toLowerCase().trim(),
      'options.page': options.page || 1,
      'options.sort': options.sort || 'relevance',
      ...((options.priceMin !== null && options.priceMin !== undefined) ? { 'options.priceMin': options.priceMin } : {}),
      ...((options.priceMax !== null && options.priceMax !== undefined) ? { 'options.priceMax': options.priceMax } : {}),
      ...((options.categories) ? { 'options.categories': { $all: Array.isArray(options.categories) ? options.categories : [options.categories] } } : {}),
      ...((options.brands) ? { 'options.brands': { $all: Array.isArray(options.brands) ? options.brands : [options.brands] } } : {}),
      ...((options.discounted !== undefined) ? { 'options.discounted': options.discounted } : {})
    };
  }

  /**
   * Get cached search results from MongoDB
   * @param {string} query - Search query
   * @param {object} options - Search options
   * @returns {Promise<object|null>} - Cached search results or null
   */
  async getSearchResults(query, options) {
    try {
      const cacheKey = this.createCacheKey(query, options);
      
      // Get results that are not stale (refreshed within the last 2 hours)
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
      
      const cachedResult = await SearchResult.findOne({
        ...cacheKey,
        lastRefreshed: { $gt: twoHoursAgo }
      });
      
      return cachedResult;
    } catch (error) {
      console.error('Error getting search results from MongoDB:', error);
      return null;
    }
  }

  /**
   * Save search results to MongoDB
   * @param {string} query - Search query
   * @param {object} options - Search options
   * @param {object} results - Search results to cache
   * @returns {Promise<object>} - Saved document
   */
  async saveSearchResults(query, options, results) {
    try {
      // Normalize the query to ensure consistent matching
      const normalizedQuery = query.toLowerCase().trim();

      // Use findOneAndUpdate with upsert
      const searchResult = await SearchResult.findOneAndUpdate(
        { 
          // Match only by query, ignoring other options
          query: normalizedQuery 
        },
        {
          // Update all fields
          $set: {
            query: normalizedQuery,
            options: {
              sort: options.sort || 'relevance',
              page: options.page || 1,
              priceMin: options.priceMin || null,
              priceMax: options.priceMax || null,
              categories: options.categories || [],
              brands: options.brands || [],
              discounted: options.discounted || false
            },
            products: results.products,
            pagination: results.pagination,
            lastRefreshed: new Date(),
            updatedAt: new Date()
          }
        },
        {
          upsert: true, // Create if doesn't exist
          new: true, // Return the updated document
          setDefaultsOnInsert: true // Apply schema defaults for new documents
        }
      );

      return searchResult;
    } catch (error) {
      console.error('Error saving search results to MongoDB:', error);
      throw new ApiError('Failed to save search results to database', 500);
    }
  }
  
  /**
   * Find stale search results that need refreshing
   * @param {number} limit - Maximum number of records to return
   * @returns {Promise<Array>} - Array of stale search records
   */
  async getStaleSearchResults(limit = 10) {
    try {
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
      
      return await SearchResult.find({
        lastRefreshed: { $lt: twoHoursAgo }
      })
      .sort({ lastRefreshed: 1 })
      .limit(limit);
    } catch (error) {
      console.error('Error fetching stale search results:', error);
      return [];
    }
  }
  
  /**
   * Update the last refreshed timestamp for a search result
   * @param {string} id - Document ID to update
   */
  async updateRefreshTimestamp(id) {
    try {
      await SearchResult.findByIdAndUpdate(id, {
        lastRefreshed: new Date()
      });
    } catch (error) {
      console.error('Error updating refresh timestamp:', error);
    }
  }
}

module.exports = new DbService();