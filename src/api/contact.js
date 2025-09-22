/**
 * contact.js - API functions cho contact
 * Cách phổ biến trong React/Next.js
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Send contact message
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} API response
 */
export async function sendContactMessage(contactData) {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        message: contactData.message.trim(),
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(`Failed to send message: ${error.message}`);
  }
}

/**
 * Get contact messages (for admin)
 * @returns {Promise<Array>} List of messages
 */
export async function getContactMessages() {
  try {
    const response = await fetch(`${API_BASE}/contact`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
}
