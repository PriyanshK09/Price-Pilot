require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  scraperApi: {
    apiKey: process.env.SCRAPER_API_KEY,
    baseUrl: 'https://api.scraperapi.com',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour in seconds
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/price-pilot',
  },
  rateLimiter: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }
};