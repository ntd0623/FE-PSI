import React from "react";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-6 text-indigo-500">
        Chào mừng bạn đến với React + Tailwind
      </h1>
      <p className="text-lg max-w-xl text-center mb-8">
        Đây là trang chủ mẫu dùng Tailwind CSS để bạn dễ dàng tùy biến và phát
        triển tiếp.
      </p>
      <button className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
        Bắt đầu ngay
      </button>
    </main>
  );
}
