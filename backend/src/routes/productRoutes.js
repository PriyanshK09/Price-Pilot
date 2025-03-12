const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search products
router.get('/search', productController.searchProducts);

// Get trending searches
router.get('/trending/searches', productController.getTrendingSearches);

// Other product routes
router.get('/trending', productController.getTrendingProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/price-history', productController.getPriceHistory);

// Add the trending searches route
router.get('/api/products/trending/searches', productController.getTrendingSearches);

module.exports = router;