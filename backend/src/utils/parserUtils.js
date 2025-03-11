/**
 * Parse price text into numeric value and currency
 * @param {string} priceText - Price text (e.g., "₹12,345.00")
 * @returns {Object} - { price: number, currency: string }
 */
function parseProductPrice(priceText) {
  if (!priceText) {
    return { price: null, currency: null };
  }
  
  // Extract currency symbol
  const currencyMatch = priceText.match(/[₹$€£¥]/);
  const currency = currencyMatch ? currencyMatch[0] : 'INR';
  
  // Extract price value - handle various formats
  // Remove all non-numeric characters except decimal point and comma
  const cleanPrice = priceText.replace(/[^0-9,\.]/g, '');
  const price = parseFloat(cleanPrice.replace(/,/g, ''));
  
  if (isNaN(price)) {
    return { price: null, currency };
  }
  
  return { price, currency };
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current discounted price
 * @returns {number} - Discount percentage
 */
function calculateDiscount(originalPrice, currentPrice) {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Extract clean image URL from Google Shopping
 * @param {string} src - Raw image source
 * @returns {string} - Clean image URL
 */
function extractImageUrl(src) {
  // If no source, use placeholder
  if (!src) {
    return null; // Return null to use fallback
  }
  
  // Google Shopping images may be encoded
  try {
    // If it's a data URL, return as is
    if (src.startsWith('data:')) {
      return src;
    }
    
    // Google often embeds image URLs in parameters
    if (src.includes('&url=')) {
      const match = src.match(/&url=(.*?)(&|$)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
    
    // If it's an encoded URL in src attribute
    if (src.startsWith('https%3A')) {
      return decodeURIComponent(src);
    }
    
    return src;
  } catch (error) {
    console.error('Error extracting image URL:', error);
    return src; // Return original even if extraction fails
  }
}

/**
 * Parse string to extract brand from title
 * @param {string} title - Product title
 * @returns {string} - Brand name or null
 */
const extractBrand = (title) => {
  if (!title) return null;
  
  // List of common brands to check against
  const commonBrands = [
    'Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 
    'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Toshiba', 
    'Nokia', 'Motorola', 'Xiaomi', 'OnePlus', 'Oppo',
    'Vivo', 'Realme', 'Redmi', 'Huawei', 'Bosch',
    'Philips', 'Panasonic', 'Canon', 'Nikon', 'JBL',
    'Bose', 'Sennheiser', 'Nike', 'Adidas', 'Puma'
  ];
  
  // Check if title starts with any brand
  for (const brand of commonBrands) {
    if (title.toLowerCase().startsWith(brand.toLowerCase())) {
      return brand;
    }
    
    // Check for brand followed by space, dash, or model
    const brandRegex = new RegExp(`\\b${brand}\\b`, 'i');
    if (brandRegex.test(title)) {
      return brand;
    }
  }
  
  return null;
};

module.exports = {
  parseProductPrice,
  calculateDiscount,
  extractImageUrl,
  extractBrand
};