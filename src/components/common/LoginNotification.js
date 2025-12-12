import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogIn } from 'lucide-react'; // ← THÊM ICON
import styles from '@/styles/LoginNotification.module.css';

export default function LoginNotification({ onClose }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleLogin = () => {
    const currentUrl = router.asPath;
    localStorage.setItem('redirectAfterLogin', currentUrl);
    router.push('/login');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.notification} onClick={(e) => e.stopPropagation()}>
        {/* ✅ THÊM ICON */}
        <div className={styles.iconWrapper}>
          <LogIn size={32} />
        </div>
        
        <p className={styles.message}>Bạn chưa đăng nhập</p>
        
        <button className={styles.loginBtn} onClick={handleLogin}>
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
}
