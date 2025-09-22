/**
 * Utility functions cho việc fetch data từ API
 */

/**
 * Hàm fetch data chung
 * @param {string} url - URL endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function fetchData(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
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
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

/**
 * GET request
 * @param {string} url - API endpoint
 * @returns {Promise<any>}
 */
export async function getData(url) {
  return fetchData(url);
}

/**
 * POST request
 * @param {string} url - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise<any>}
 */
export async function postData(url, data) {
  return fetchData(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 * @param {string} url - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise<any>}
 */
export async function putData(url, data) {
  return fetchData(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 * @param {string} url - API endpoint
 * @returns {Promise<any>}
 */
export async function deleteData(url) {
  return fetchData(url, {
    method: 'DELETE',
  });
}

/**
 * Fetch data với timeout
 * @param {string} url - API endpoint
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<any>}
 */
export async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetchData(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
