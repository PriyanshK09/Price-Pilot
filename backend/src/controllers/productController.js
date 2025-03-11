const scrapingService = require('../services/scrapingService');
const cacheService = require('../services/cacheService');
const Product = require('../models/Product');
const { ApiError } = require('../middleware/errorHandler');
const { generateMockProducts } = require('../utils/mockData'); // Import the mock data utility

class ProductController {
  /**
   * Search for products
   */
  async searchProducts(req, res, next) {
    try {
      const { q: query } = req.query;
      
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ 
          success: false, 
          message: 'Search query must be at least 2 characters'
        });
      }
      
      // Extract other search parameters
      const options = {
        page: parseInt(req.query.page) || 1,
        sort: req.query.sort || 'relevance',
        priceMin: req.query.priceMin ? parseInt(req.query.priceMin) : null,
        priceMax: req.query.priceMax ? parseInt(req.query.priceMax) : null,
        categories: req.query.categories || null,
        brands: req.query.brands || null,
        discounted: req.query.discounted === '1'
      };
      
      // Check cache first
      const cacheKey = `search:${query}:${JSON.stringify(options)}`;
      const cachedResults = cacheService.get(cacheKey);
      
      if (cachedResults) {
        console.log(`Cache hit for query: ${query}`);
        return res.json(cachedResults);
      }
      
      try {
        // If not in cache, perform web scraping
        console.log(`Cache miss for query: ${query}, fetching from source...`);
        const results = await scrapingService.searchProducts(query, options);
        
        // Check if any products were found
        if (!results.products || results.products.length === 0) {
          console.log('No products found, using mock data');
          const mockResults = generateMockResults(query, options);
          cacheService.set(cacheKey, mockResults, 300); // Short cache for mock data
          return res.json(mockResults);
        }
        
        // Store real results in cache (with 1 hour expiry)
        cacheService.set(cacheKey, results, 3600);
        return res.json(results);
        
      } catch (error) {
        console.error('Search API error:', error);
        
        // Return mock data as fallback
        const mockResults = generateMockResults(query, options);
        cacheService.set(cacheKey, mockResults, 300); // Short cache for mock data
        return res.json(mockResults);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product details by ID
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      
      // First check the database
      let product = await Product.findById(id);
      
      if (!product) {
        throw new ApiError('Product not found', 404);
      }
      
      // Check if we need to refresh the data
      const lastUpdated = new Date(product.updatedAt);
      const now = new Date();
      const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate > 24) {
        // Refresh data from scraping service
        // This would typically use product URL to get fresh details
        // For now, just return the database copy
        console.log('Product data is stale but not refreshing in this example');
      }
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get trending products
   */
  async getTrendingProducts(req, res, next) {
    try {
      // This would be based on your business logic
      // For example, most viewed products or most price-dropped products
      
      // For now, return a sample of products
      const products = await Product.find()
        .sort({ 'rating.average': -1 })
        .limit(10);
        
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get price history for a product
   */
  async getPriceHistory(req, res, next) {
    try {
      const { id } = req.params;
      
      // Query price history data
      // Would connect to the PriceHistory model
      
      res.json({
        message: 'Price history endpoint - to be implemented',
        productId: id
      });
    } catch (error) {
      next(error);
    }
  }
}

/**
 * Generate mock results with proper pagination
 */
function generateMockResults(query, options) {
  const { page = 1 } = options;
  const mockProducts = generateMockProducts(query, 12);
  
  return {
    products: mockProducts,
    pagination: {
      currentPage: page,
      totalPages: 5,
      totalResults: 60
    }
  };
}

module.exports = new ProductController();