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
   npm install

# hoặc

    yarn install

3. **Tạo file biến môi trường**
   cp .env
   VITE_BACKEND_URL=http://localhost:8080
   VITE_APP_NAME=ReactPsiApp
   VITE_PORT=8080

4. **Chạy ứng dụng**

   npm run dev

# hoặc

    yarn dev

5. **Chuyển nhánh**
   git checkout <Tên nhánh cần chuyển>

6. **Tạo nhánh**

   git checkout -b "<Tên nhánh cần tạo>"

<p style="color:red; font-weight:bold;">
Lưu ý: Không code trên nhánh <code>master</code>. Nhánh <code>main</code> phải để chỉ có <code>readme.md</code>. Khi làm một chức năng mới phải chuyển nhánh và pull về cũng như khi xong chức năng phải đẩy code lên GitHub.
</p>
