/**
 * contactService.js - Service layer xử lý API
 * Tương đương Data Access Layer trong C#
 */

import { apiService } from './apiService';

export const contactService = {
  /**
   * Gửi tin nhắn liên hệ
   * @param {Object} contactData - Dữ liệu liên hệ
   * @returns {Promise<Object>} Response từ server
   */
  async sendMessage(contactData) {
    try {
      const response = await apiService.post('/api/contact', {
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        message: contactData.message.trim(),
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  },

  /**
   * Lấy danh sách tin nhắn (cho admin)
   * @returns {Promise<Array>} Danh sách tin nhắn
   */
  async getMessages() {
    try {
      const response = await apiService.get('/api/contact');
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  },

  /**
   * Xóa tin nhắn (cho admin)
   * @param {string} messageId - ID của tin nhắn
   * @returns {Promise<boolean>} Kết quả xóa
   */
  async deleteMessage(messageId) {
    try {
      await apiService.delete(`/api/contact/${messageId}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }
};
