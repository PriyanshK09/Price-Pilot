/**
 * Search History Service
 * Handles storing and retrieving user search history from localStorage
 */

const STORAGE_KEY = 'price_pilot_recent_searches';
const MAX_SEARCHES = 5; // Maximum number of recent searches to store

/**
 * Get recent searches from localStorage
 * @returns {Array} Array of recent search strings
 */
export const getRecentSearches = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error reading search history from localStorage:', error);
  }
  return [];
};

/**
 * Add a search term to recent searches
 * @param {string} searchTerm - The search term to add
 */
export const addRecentSearch = (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length < 2) return;
  
  try {
    const trimmedTerm = searchTerm.trim();
    const currentSearches = getRecentSearches();
    
    // Remove the term if it already exists (to avoid duplicates)
    const filteredSearches = currentSearches.filter(
      term => term.toLowerCase() !== trimmedTerm.toLowerCase()
    );
    
    // Add the new term to the beginning
    const newSearches = [trimmedTerm, ...filteredSearches].slice(0, MAX_SEARCHES);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
  } catch (error) {
    console.error('Error saving search history to localStorage:', error);
  }
};

/**
 * Clear all recent searches
 */
export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing search history from localStorage:', error);
  }
};