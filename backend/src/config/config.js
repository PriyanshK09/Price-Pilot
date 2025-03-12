require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  scraperApi: {
    apiKey: process.env.SCRAPER_API_KEY || '',
    baseUrl: process.env.SCRAPER_API_URL || 'https://api.scraperapi.com'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pricepilot',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://pricepilot.com', 'https://www.pricepilot.com'] 
      : ['http://localhost:3000', 'http://127.0.0.1:3000']
  },
  cache: {
    memoryTTL: 60 * 30, // 30 minutes
    dbRefreshInterval: 60 * 60 * 2, // 2 hours in seconds
    staleCheckInterval: 60 * 30 // Check for stale data every 10 minutes
  }
};