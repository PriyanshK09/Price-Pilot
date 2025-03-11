// Create a utility function for generating mock data

/**
 * Generate mock product data for testing or fallback
 * @param {string} query - Search query
 * @param {number} count - Number of products to generate
 * @returns {Array} - Array of mock product objects
 */
function generateMockProducts(query = '', count = 20) {
  const mockProducts = [];
  const stores = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Vijay Sales'];
  const ratings = [4.1, 4.3, 4.5, 4.7, 4.9, 5.0];
  const categories = ['Electronics', 'Laptops', 'Smartphones', 'Audio', 'Cameras', 'Gaming'];
  
  for (let i = 1; i <= count; i++) {
    const hasDiscount = Math.random() > 0.3;
    const discountPercent = hasDiscount ? Math.floor(Math.random() * 40) + 5 : 0;
    const originalPrice = Math.floor(Math.random() * 150000) + 1000;
    const currentPrice = hasDiscount 
      ? Math.round(originalPrice * (1 - discountPercent / 100)) 
      : originalPrice;
    
    const productName = query ? 
      `${query.charAt(0).toUpperCase() + query.slice(1)} Pro ${i} (2024 Model)` : 
      `Pro Product ${i} (2024 Model)`;
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const searchTermForImage = query || category.toLowerCase();
    
    mockProducts.push({
      id: `prod-${i}-${Date.now()}`,
      title: productName,
      image: `https://source.unsplash.com/random/300x300/?${encodeURIComponent(searchTermForImage)}&sig=${i}`,
      currentPrice,
      originalPrice: hasDiscount ? originalPrice : null,
      discountPercent: hasDiscount ? discountPercent : 0,
      store: stores[Math.floor(Math.random() * stores.length)],
      rating: ratings[Math.floor(Math.random() * ratings.length)],
      reviewCount: Math.floor(Math.random() * 2000) + 10,
      inStock: Math.random() > 0.1,
      currency: 'INR',
      searchQuery: query
    });
  }
  
  return mockProducts;
}

module.exports = {
  generateMockProducts
};