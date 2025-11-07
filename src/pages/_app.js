/**
 * Custom App Component - Wrapper cho tất cả các pages
 */

import "../styles/globals.css";
import Head from "next/head";
import { UserProvider } from "@/context/UserContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head />

      {/* ✅ Bọc toàn bộ ứng dụng trong UserProvider */}
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}
