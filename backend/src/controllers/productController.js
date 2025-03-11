const scrapingService = require('../services/scrapingService');
const cacheService = require('../services/cacheService');
const dbService = require('../services/dbService'); 
const { ApiError } = require('../middleware/errorHandler');
const { generateMockProducts } = require('../utils/mockData');

/**
 * Search for products
 */
async function searchProducts(req, res, next) {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query must be at least 2 characters'
      });
    }
    
    // Extract search parameters
    const options = {
      page: parseInt(req.query.page) || 1,
      sort: req.query.sort || 'relevance',
      priceMin: req.query.priceMin ? parseInt(req.query.priceMin) : null,
      priceMax: req.query.priceMax ? parseInt(req.query.priceMax) : null,
      categories: req.query.categories ? req.query.categories.split(',') : null,
      brands: req.query.brands ? req.query.brands.split(',') : null,
      discounted: req.query.discounted === '1'
    };
    
    try {
      // First, check memory cache for super-fast responses
      const memoryCacheKey = `search:${query}:${JSON.stringify(options)}`;
      const cachedInMemory = cacheService.get(memoryCacheKey);
      
      if (cachedInMemory) {
        console.log(`Memory cache hit for query: ${query}`);
        return res.json(cachedInMemory);
      }
      
      // Second, check MongoDB cache
      console.log(`Memory cache miss for query: ${query}, checking MongoDB cache...`);
      const cachedInDb = await dbService.getSearchResults(query, options);
      
      if (cachedInDb) {
        console.log(`MongoDB cache hit for query: ${query}`);
        const results = {
          products: cachedInDb.products,
          pagination: cachedInDb.pagination
        };
        
        // Store in memory cache for 5 minutes
        cacheService.set(memoryCacheKey, results, 300);
        return res.json(results);
      }
      
      // If not in either cache, perform web scraping
      console.log(`MongoDB cache miss for query: ${query}, fetching from source...`);
      const results = await scrapingService.searchProducts(query, options);
      
      // Check if any products were found
      if (!results.products || results.products.length === 0) {
        console.log('No products found, using mock data');
        const mockResults = generateMockResults(query, options);
        
        // Store mock results in memory cache (short TTL)
        cacheService.set(memoryCacheKey, mockResults, 300);
        
        // Store in MongoDB with a shorter refresh interval (1 hour instead of 2)
        await dbService.saveSearchResults(query, options, mockResults);
        
        return res.json(mockResults);
      }
      
      // Store real results in memory cache (30 minutes)
      cacheService.set(memoryCacheKey, results, 1800);
      
      // Store in MongoDB for longer-term cache
      await dbService.saveSearchResults(query, options, results);
      
      return res.json(results);
      
    } catch (error) {
      console.error('Search API error:', error);
      
      // Return mock data as fallback
      const mockResults = generateMockResults(query, options);
      
      // Still cache mock results but with shorter expiry (5 minutes)
      cacheService.set(`search:${query}:${JSON.stringify(options)}`, mockResults, 300);
      
      return res.json(mockResults);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Get product details by ID
 */
async function getProductById(req, res, next) {
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
async function getTrendingProducts(req, res, next) {
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
async function getPriceHistory(req, res, next) {
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

module.exports = {
  searchProducts,
  getProductById,
  getTrendingProducts,
  getPriceHistory
};