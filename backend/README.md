# Clinical Trials Backend

Backend NestJS 11 cho ứng dụng quản lý danh mục thử nghiệm lâm sàng.

## Công nghệ sử dụng

- NestJS 11
- Sequelize ORM
- SQLite Database
- OpenAPI (Swagger)
- Class Validator

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── portfolio/           # Portfolio module
│   │   ├── entities/       # Database models
│   │   ├── dtos/          # Data transfer objects
│   │   └── controllers/   # REST endpoints
│   ├── investigator/       # Investigator module
│   ├── database/          # Database configuration
│   └── mocks/            # Mock data
├── test/                 # Unit & e2e tests
├── package.json
└── README.md
```

## Database Schema

### Portfolio
- `id`: int (auto-increment)
- `title`: string (unique)
- `description`: string
- `category`: enum ('Phase 1', 'Phase 2', 'Phase 3', 'Other')
- `isActive`: boolean
- `progress`: int (0-100)
- `tags`: string[]
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Investigator
- `id`: int (auto-increment)
- `name`: string
- `email`: string (unique)
- `specialty`: string
- `portfolioId`: int (foreign key)
- `createdAt`: timestamp
- `updatedAt`: timestamp

## API Endpoints

### Portfolios
- `GET /portfolios` - Lấy danh sách dự án
- `GET /portfolios/:id` - Lấy chi tiết dự án
- `POST /portfolios` - Tạo dự án mới
- `PUT /portfolios/:id` - Cập nhật dự án
- `DELETE /portfolios/:id` - Xóa dự án

### Investigators
- `GET /investigators` - Lấy danh sách nhà nghiên cứu
- `GET /portfolios/:id/investigators` - Lấy nhà nghiên cứu theo dự án
- `POST /investigators` - Thêm nhà nghiên cứu mới
- `PUT /investigators/:id` - Cập nhật nhà nghiên cứu
- `DELETE /investigators/:id` - Xóa nhà nghiên cứu

## Cài đặt

```bash
# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm run start:dev

# Build production
pnpm run build

# Chạy unit tests
pnpm run test

# Chạy e2e tests
pnpm run test:e2e
```

## Development server

Chạy `pnpm run start:dev` để khởi động dev server. API sẽ có sẵn tại `http://localhost:3000`. Swagger UI có thể truy cập tại `http://localhost:3000/api`.

## Lưu ý

Used Cursor AI for code generation and debugging per `.cursor/rules/clinical-trials-standards.mdc`.
