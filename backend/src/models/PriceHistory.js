const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
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
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

// Compound index for efficient queries
PriceHistorySchema.index({ productId: 1, store: 1, date: 1 });

module.exports = mongoose.model('PriceHistory', PriceHistorySchema);