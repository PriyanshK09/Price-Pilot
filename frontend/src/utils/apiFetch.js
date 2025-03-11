/**
 * Utility function to fetch API data with fallback mechanisms
 */
export const apiFetch = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Try different URL formations to handle proxy issues
  const urls = [
    `/api${endpoint}`,                      // Relative path with /api prefix
    `http://localhost:5000/api${endpoint}`, // Direct API URL
    `http://localhost:5000${endpoint}`,     // Direct API URL without /api prefix
  ];
  
  let lastError = null;
  
  for (const url of urls) {
    try {
      console.log(`Trying API fetch: ${url}`);
      const response = await fetch(url, mergedOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`API request failed for ${url}: ${response.status}`, errorText);
        continue;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`Non-JSON response from ${url}`);
        continue;
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`Error fetching from ${url}:`, error);
      lastError = error;
    }
  }
  
  // If we get here, all attempts failed
  throw lastError || new Error('Failed to fetch data from API');
};