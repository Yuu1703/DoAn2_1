/**
 * ContactForm.js - Standard React Component
 * Clean component với props interface đơn giản
 */

import styles from '../styles/Contact.module.css';

export default function ContactForm({
  // Props từ useContact hook
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
  onReset
}) {
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange(name, value);
  };

  return (
    <div className={styles.contactForm}>
      <h2>Gửi tin nhắn</h2>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Họ và tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
            disabled={isLoading}
          />
          {errors.name && (
            <span className={styles.errorText}>{errors.name}</span>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
            disabled={isLoading}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        {/* Message Field */}
        <div className={styles.formGroup}>
          <label htmlFor="message">Tin nhắn:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className={`${styles.formTextarea} ${errors.message ? styles.error : ''}`}
            disabled={isLoading}
          />
          {errors.message && (
            <span className={styles.errorText}>{errors.message}</span>
          )}
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
          </button>
          
          <button 
            type="button" 
            className={styles.resetButton}
            onClick={onReset}
            disabled={isLoading}
          >
            Đặt lại
          </button>
        </div>
      </form>
    </div>
  );
}
