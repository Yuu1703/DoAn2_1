/**
 * useContact.js - Custom Hook chuẩn React
 * Cách phổ biến nhất để tách logic trong React
 */

import { useState } from 'react';

export function useContact() {
  // State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(''); // 'success', 'error', ''

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập tin nhắn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return false;
    
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock API call - replace with real API
      console.log('Sending contact form:', formData);
      
      // Reset form on success
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('success');
      return true;
      
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setSubmitStatus('');
  };

  // Return API (interface)
  return {
    // State
    formData,
    isSubmitting,
    errors,
    submitStatus,
    
    // Actions
    handleInputChange,
    handleSubmit,
    resetForm
  };
}
