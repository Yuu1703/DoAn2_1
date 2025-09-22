/**
 * ContactLogic.js - Logic xử lý cho trang Contact
 * Tương đương "code-behind" trong C#
 */

import { useState } from 'react';
import { validateEmail, validateRequired } from '../utils/validation';
import { contactService } from '../services/contactService';

export function useContactLogic() {
  // State - Tương đương Properties trong C#
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(''); // 'success', 'error', ''

  // Methods - Tương đương Methods trong C#
  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error khi user nhập
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation rules
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!validateRequired(formData.message)) {
      newErrors.message = 'Vui lòng nhập tin nhắn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm()) return false;
    
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      await contactService.sendMessage(formData);
      
      // Reset form sau khi thành công
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

  // Return state và methods - Tương đương public interface
  return {
    // Properties (readonly)
    formData,
    isSubmitting,
    errors,
    submitStatus,
    
    // Methods
    handleInputChange,
    submitForm,
    resetForm
  };
}
