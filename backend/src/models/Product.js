const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
  },
  productUrl: {
    type: String,
  },
  category: {
    type: String,
    index: true,
  },
  brand: {
    type: String,
    index: true,
  },
  searchQueries: [{
    type: String,
    index: true,
  }],
  offers: [{
    store: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    url: {
      type: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  }],
  rating: {
    average: {
      type: Number,
    },
    count: {
      type: Number,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for search
ProductSchema.index({ title: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);