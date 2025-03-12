/**
 * Utility function to fetch API data with fallback mechanisms
 */
export const apiFetch = async (endpoint, options = {}) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
  
  try {
    const response = await fetch(`${baseUrl}${apiEndpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};