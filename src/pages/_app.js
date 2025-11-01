/**
 * Custom App Component - Wrapper cho tất cả các pages
 */

import "../styles/globals.css";
import Head from "next/head";
import { UserProvider } from "@/context/UserContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Pacifico&family=Righteous&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ✅ Bọc toàn bộ ứng dụng trong UserProvider */}
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}
