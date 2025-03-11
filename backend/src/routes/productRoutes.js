const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search products
router.get('/search', productController.searchProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get price history for a product
router.get('/:id/price-history', productController.getPriceHistory);

// Get trending products
router.get('/trending/list', productController.getTrendingProducts);

module.exports = router;