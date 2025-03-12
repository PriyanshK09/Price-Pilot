const SearchResult = require('../models/SearchResult');
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
      discounted: req.query.discounted === '1',
      filterOnServer: req.query.filterOnServer === '1' // New parameter to control filtering location
    };
    
    try {
      // First, check memory cache without filters for super-fast responses
      const baseQuery = query.trim().toLowerCase();
      const baseCacheKey = `search:${baseQuery}`;
      
      // Check if we need to apply filters on the server or client
      if (options.filterOnServer) {
        // Use full filtering on server (traditional approach)
        const fullCacheKey = `${baseCacheKey}:${JSON.stringify(options)}`;
        const cachedInMemory = cacheService.get(fullCacheKey);
        
        if (cachedInMemory) {
          console.log(`Memory cache hit for filtered query: ${query}`);
          return res.json(cachedInMemory);
        }
        
        // Check MongoDB cache for the filtered query
        const cachedInDb = await dbService.getSearchResults(query, options);
        
        if (cachedInDb) {
          console.log(`MongoDB cache hit for filtered query: ${query}`);
          const results = {
            products: cachedInDb.products,
            pagination: cachedInDb.pagination
          };
          
          // Store in memory cache for 5 minutes
          cacheService.set(fullCacheKey, results, 300);
          return res.json(results);
        }
      } else {
        // Try to get unfiltered results first
        const baseOptions = { page: 1, sort: 'relevance' };
        const cachedBaseResults = cacheService.get(baseCacheKey) || 
                                  await dbService.getSearchResults(query, baseOptions);
        
        if (cachedBaseResults) {
          console.log(`Cache hit for base query: ${query}, applying filters on client`);
          
          // Extract all products and filter/sort on the server but return 
          // with proper pagination for client efficiency
          let allProducts = cachedBaseResults.products || [];
          
          // Extract available filters
          const filters = extractFiltersFromProducts(allProducts);
          
          // Apply filters
          let filteredProducts = allProducts;
          
          if (options.priceMin !== null) {
            filteredProducts = filteredProducts.filter(p => p.currentPrice >= options.priceMin);
          }
          
          if (options.priceMax !== null) {
            filteredProducts = filteredProducts.filter(p => p.currentPrice <= options.priceMax);
          }
          
          if (options.discounted) {
            filteredProducts = filteredProducts.filter(p => p.discountPercent > 0);
          }
          
          if (options.categories && options.categories.length > 0) {
            filteredProducts = filteredProducts.filter(p => 
              p.category && options.categories.includes(p.category)
            );
          }
          
          if (options.brands && options.brands.length > 0) {
            filteredProducts = filteredProducts.filter(p => 
              p.brand && options.brands.includes(p.brand)
            );
          }
          
          // Apply sorting
          if (options.sort === 'price_low') {
            filteredProducts.sort((a, b) => a.currentPrice - b.currentPrice);
          } else if (options.sort === 'price_high') {
            filteredProducts.sort((a, b) => b.currentPrice - a.currentPrice);
          } else if (options.sort === 'discount') {
            filteredProducts.sort((a, b) => b.discountPercent - a.discountPercent);
          } else if (options.sort === 'rating') {
            filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (options.sort === 'newest') {
            // If you have a date field, sort by it here
            // Otherwise, use default relevance
          }
          
          // Calculate pagination
          const totalResults = filteredProducts.length;
          const totalPages = Math.ceil(totalResults / 12); // Assuming 12 products per page
          const startIndex = (options.page - 1) * 12;
          const endIndex = startIndex + 12;
          const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
          
          const results = {
            products: paginatedProducts,
            pagination: {
              currentPage: options.page,
              totalPages: totalPages,
              totalResults: totalResults
            },
            filters: filters
          };
          
          // Cache the filtered results but with a shorter TTL
          const filteredCacheKey = `${baseCacheKey}:${JSON.stringify(options)}`;
          cacheService.set(filteredCacheKey, results, 300);
          
          return res.json(results);
        }
      }
      
      // If we get here, no cached data was found, so fetch from source
      console.log(`No cache hit for query: ${query}, fetching from source...`);
      const results = await scrapingService.searchProducts(query, options);
      
      // Check if any products were found
      if (!results.products || results.products.length === 0) {
        console.log('No products found, using mock data');
        const mockResults = generateMockResults(query, options);
        
        // Store mock results in cache
        cacheService.set(`search:${query}`, mockResults, 300);
        
        return res.json(mockResults);
      }
      
      // Extract available filters
      results.filters = extractFiltersFromProducts(results.products);
      
      // Store results in memory cache (5 minutes for filtered, 30 minutes for base)
      cacheService.set(`search:${query}:${JSON.stringify(options)}`, results, 300);
      cacheService.set(`search:${query}`, results, 1800);
      
      // Store in MongoDB for longer-term cache
      await dbService.saveSearchResults(query, options, results);
      
      return res.json(results);
      
    } catch (error) {
      console.error('Search API error:', error);
      
      // Return mock data as fallback
      const mockResults = generateMockResults(query, options);
      
      // Still cache mock results but with shorter expiry
      cacheService.set(`search:${query}:${JSON.stringify(options)}`, mockResults, 300);
      
      return res.json(mockResults);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Extract filters from products
 */
function extractFiltersFromProducts(products) {
  const categories = new Map();
  const brands = new Map();
  
  products.forEach(product => {
    // Extract categories
    if (product.category) {
      const count = categories.get(product.category) || 0;
      categories.set(product.category, count + 1);
    }
    
    // Extract brands
    if (product.brand || product.store) {
      const brandName = product.brand || product.store;
      const count = brands.get(brandName) || 0;
      brands.set(brandName, count + 1);
    }
  });
  
  // Convert maps to arrays of objects
  const categoryFilters = Array.from(categories.entries()).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count
  }));
  
  const brandFilters = Array.from(brands.entries()).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count
  }));
  
  return {
    categories: categoryFilters,
    brands: brandFilters
  };
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
 * Get trending searches
 */
const getTrendingSearches = async (req, res) => {
  try {
    // Get trending searches from database
    const trendingSearches = await SearchResult.aggregate([
      { 
        $group: { 
          _id: "$query", 
          count: { $sum: 1 },
          lastSearched: { $max: "$updatedAt" }
        }
      },
      { $match: { _id: { $regex: /^.{3,}$/ } } },
      { $sort: { count: -1, lastSearched: -1 } },
      { $limit: 10 },
      { 
        $project: { 
          _id: 0,
          query: "$_id", 
          count: 1
        }
      }
    ]);

    // Return trending searches
    return res.json({
      success: true,
      trendingSearches: trendingSearches.length > 0 
        ? trendingSearches.map(item => item.query)
        : [
            'iPhone 15 Pro',
            'Samsung S24 Ultra', 
            'MacBook Air M3',
            'Sony WH-1000XM5',
            'Dyson V11',
            'iPad Pro',
            'OLED TV',
            'PS5 Slim'
          ]
    });

  } catch (error) {
    console.error('Error in getTrendingSearches:', error);
    return res.status(200).json({
      success: true,
      trendingSearches: [
        'iPhone 15 Pro',
        'Samsung S24 Ultra',
        'MacBook Air M3',
        'Sony WH-1000XM5',
        'Dyson V11',
        'iPad Pro',
        'OLED TV',
        'PS5 Slim'
      ]
    });
  }
};

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
  getPriceHistory,
  getTrendingSearches
};