/**
 * Custom App Component - Wrapper cho tất cả các pages
 */

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
