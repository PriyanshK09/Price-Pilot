const mongoose = require('mongoose');

const SearchResultSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  options: {
    sort: String,
    page: Number,
    priceMin: Number,
    priceMax: Number,
    categories: [String],
    brands: [String],
    discounted: Boolean
  },
  products: [
    {
      id: String,
      title: String,
      image: String,
      currentPrice: Number,
      originalPrice: Number,
      discountPercent: Number,
      store: String,
      productUrl: String,
      rating: Number,
      reviewCount: Number,
      inStock: Boolean,
      currency: {
        type: String,
        default: 'INR'
      },
      delivery: String
    }
  ],
  pagination: {
    currentPage: Number,
    totalPages: Number,
    totalResults: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastRefreshed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index on query and options for faster lookups
// SearchResultSchema.index({ 
//   query: 1, 
//   'options.sort': 1, 
//   'options.page': 1, 
//   'options.priceMin': 1,
//   'options.priceMax': 1
// });

// Create an index on lastRefreshed to quickly find stale data
SearchResultSchema.index({ lastRefreshed: 1 });

// Create a TTL index to automatically remove documents after 7 days
SearchResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

// Add a unique index on the query field
SearchResultSchema.index({ query: 1 }, { unique: true });

module.exports = mongoose.model('SearchResult', SearchResultSchema);