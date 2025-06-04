# ReactPsiApp

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" width="60" height="60" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://vitejs.dev/logo.svg" alt="Vite Logo" width="60" height="60" />
</p>

Dự án React sử dụng Vite làm build tool, SCSS và Tailwind CSS để phát triển giao diện.

---

## Yêu cầu

- Node.js phiên bản 16 trở lên
- Git

---

## Cài đặt và chạy dự án

1. **Clone repository**

   ```bash
   git clone https://github.com/ntd0623/FE-PSI.git
   cd FE-PSI
   ```

2. **Cài đặt dependencies**

   ```bash
   npm install
   ```

   hoặc

   ```bash
   yarn install
   ```

3. **Tạo file biến môi trường**

   Tạo file `.env` với nội dung:

   ```
   VITE_BACKEND_URL=http://localhost:8080
   VITE_APP_NAME=ReactPsiApp
   VITE_PORT=8080
   ```

4. **Chạy ứng dụng**

   ```bash
   npm run dev
   ```

   hoặc

   ```bash
   yarn dev
   ```

5. **Chuyển nhánh**

   ```bash
   git checkout <Tên-nhánh-cần-chuyển>
   ```

6. **Tạo nhánh mới**

   ```bash
   git checkout -b <Tên-nhánh-cần-tạo>
   ```

---

<p style="color:red; font-weight:bold;">
Lưu ý: Không code trên nhánh <code>master</code>. Nhánh <code>main</code> chỉ để chứa file <code>README.md</code>. Khi làm chức năng mới, phải chuyển sang nhánh mới, pull code về, và khi xong chức năng phải đẩy code lên GitHub đúng quy trình.
</p>
