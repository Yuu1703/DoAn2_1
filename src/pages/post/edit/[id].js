import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostForm from '@/components/post/Postform';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        setInitialData(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Submit update: supports FormData (multipart) and JSON
  const onSubmit = async (form) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && form instanceof FormData;
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? form : JSON.stringify(form),
      });
      if (!res.ok) {
        alert('Cập nhật thất bại');
        return;
      }
      alert('Cập nhật thành công');
      router.push('/destinations');
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra');
    }
  };

  return (
    <>
      <Head>
        <title>Chỉnh sửa bài đăng</title>
      </Head>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
        {loading ? (
          <p>Đang tải...</p>
        ) : initialData ? (
          <PostForm initialData={initialData} onSubmitJson={onSubmit} onSubmitFormData={onSubmit} />
        ) : (
          <p>Không tìm thấy bài đăng</p>
        )}
      </main>
      <Footer />
    </>
  );
}
