# Next.js Project

Đây là dự án web được xây dựng bằng [Next.js](https://nextjs.org) với JavaScript và Tailwind CSS.

## Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Ngôn ngữ**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Package Manager**: npm

## Cách chạy dự án

Cài đặt dependencies:
```bash
npm install
```

Chạy development server:
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

Bạn có thể bắt đầu chỉnh sửa bằng cách sửa file `src/app/page.js`. Trang sẽ tự động cập nhật khi bạn lưu file.

## Cấu trúc dự án

```
my-nextjs-project/
├── public/                     # Các tệp tài nguyên tĩnh
│   ├── images/                 # Thư mục chứa các hình ảnh
│   │   └── logo-placeholder.txt # Placeholder cho logo
│   └── favicon.ico             # Biểu tượng favicon
├── src/
│   ├── components/             # Các component React dùng lại
│   │   ├── Header.js           # Component Header
│   │   └── Footer.js           # Component Footer
│   ├── pages/                  # Các trang (Pages Router)
│   │   ├── _app.js             # Custom App component
│   │   ├── index.js            # Trang chủ (home)
│   │   ├── about.js            # Trang về (about)
│   │   └── contact.js          # Trang liên hệ (contact)
│   ├── styles/                 # Các tệp CSS, CSS Modules
│   │   ├── globals.css         # Kiểu chung (global styles)
│   │   ├── Header.module.css   # CSS module cho Header
│   │   ├── Footer.module.css   # CSS module cho Footer
│   │   ├── Home.module.css     # CSS module cho trang Home
│   │   ├── About.module.css    # CSS module cho trang About
│   │   └── Contact.module.css  # CSS module cho trang Contact
│   ├── utils/                  # Các hàm tiện ích chung
│   │   ├── fetchData.js        # Hàm fetch data từ API
│   │   ├── helpers.js          # Các hàm helper
│   │   └── index.js            # Export utilities
│   ├── services/               # API services
│   │   └── apiService.js       # HTTP client
│   ├── models/                 # Data models
│   │   └── User.js             # User model
│   ├── hooks/                  # Custom React Hooks
│   │   └── useLocalStorage.js  # localStorage hook
│   ├── context/                # React Context
│   │   └── AppContext.js       # App state management
│   ├── config/                 # Configuration files
│   │   └── app.js              # App configuration
│   └── lib/                    # External libraries setup
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies và scripts
├── next.config.js              # Cấu hình Next.js
├── jsconfig.json               # JavaScript configuration
└── README.md                   # Tài liệu dự án
```

## Cách phát triển

### 1. Tạo Components mới
```bash
# Tạo component trong thư mục ui
touch src/components/ui/NewComponent.js

# Tạo layout component
touch src/components/layout/NewLayout.js
```

### 2. Tạo Pages mới
```bash
# Tạo view mới
touch src/views/NewView.js

# Tạo page trong app router
mkdir src/app/new-page
touch src/app/new-page/page.js
```

### 3. Thêm API Services
```bash
# Tạo service mới
touch src/services/newService.js
```

### 4. Tạo Custom Hooks
```bash
# Tạo hook mới
touch src/hooks/useNewHook.js
```

## Quy tắc code

- **Components**: Sử dụng PascalCase (VD: `Button.js`)
- **Files**: Sử dụng camelCase (VD: `apiService.js`)
- **Folders**: Sử dụng kebab-case (VD: `new-feature/`)
- **Imports**: Sử dụng absolute imports với `@/` prefix

## Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build dự án cho production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint

## Tìm hiểu thêm

Để tìm hiểu thêm về Next.js:

- [Next.js Documentation](https://nextjs.org/docs) - tìm hiểu về tính năng và API của Next.js
- [Learn Next.js](https://nextjs.org/learn) - tutorial tương tác về Next.js
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - tài liệu về Tailwind CSS

## Deploy

Cách dễ nhất để deploy ứng dụng Next.js là sử dụng [Vercel Platform](https://vercel.com/new).

Xem thêm [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) để biết chi tiết.
