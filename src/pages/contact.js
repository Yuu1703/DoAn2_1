/**
 * contact.js - Contact page với standard React patterns
 * Sử dụng custom hooks và shared utilities
 */

import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { useContact } from "../hooks/useContact";
import styles from "../styles/Contact.module.css";

export default function Contact() {
  // Sử dụng custom hook theo React patterns
  const {
    formData,
    isSubmitting,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useContact();

  return (
    <>
      <Head>
        <title>Liên hệ - DoAn2_3</title>
        <meta name="description" content="Trang liên hệ với đội ngũ DoAn2_3" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Liên hệ với chúng tôi</h1>

          <div className={styles.content}>
            {/* Contact Info - Static UI */}
            <div className={styles.contactInfo}>
              <h2>Thông tin liên hệ</h2>
              <div className={styles.infoItem}>
                <strong>Email:</strong> contact@doan23.com
              </div>
              <div className={styles.infoItem}>
                <strong>Điện thoại:</strong> +84 123 456 789
              </div>
              <div className={styles.infoItem}>
                <strong>Địa chỉ:</strong> Việt Nam
              </div>
              <div className={styles.infoItem}>
                <strong>Thời gian làm việc:</strong> 8:00 - 17:00 (Thứ 2 - Thứ
                6)
              </div>
            </div>

            {/* Contact Form - Standard React Component */}
            <ContactForm
              formData={formData}
              errors={errors}
              // useContact exposes `isSubmitting` - alias to the prop name used by ContactForm
              isLoading={isSubmitting}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onReset={resetForm}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
