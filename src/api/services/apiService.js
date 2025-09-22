/**
 * Service xử lý API calls
 */

import { apiConfig } from '@/config/app';

class ApiService {
  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
  }

  /**
   * Thực hiện request HTTP
   * @param {string} url - Endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} url - Endpoint URL
   * @returns {Promise<any>}
   */
  async get(url) {
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} url - Endpoint URL
   * @param {Object} data - Request body
   * @returns {Promise<any>}
   */
  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   * @param {string} url - Endpoint URL
   * @param {Object} data - Request body
   * @returns {Promise<any>}
   */
  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   * @param {string} url - Endpoint URL
   * @returns {Promise<any>}
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
