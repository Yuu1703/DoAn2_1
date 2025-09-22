/**
 * api.js - Shared API utilities
 * Base functions cho tất cả API calls
 */

/**
 * Base fetch wrapper với error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function apiCall(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * GET request helper
 * @param {string} url - API endpoint
 * @returns {Promise<any>}
 */
export async function get(url) {
  return apiCall(url);
}

/**
 * POST request helper
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<any>}
 */
export async function post(url, data) {
  return apiCall(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request helper
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<any>}
 */
export async function put(url, data) {
  return apiCall(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request helper
 * @param {string} url - API endpoint
 * @returns {Promise<any>}
 */
export async function del(url) {
  return apiCall(url, {
    method: 'DELETE',
  });
}
