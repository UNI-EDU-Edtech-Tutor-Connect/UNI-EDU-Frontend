# API Service Layer Documentation

## 📁 Cấu Trúc Thư Mục

```
lib/api/
├── index.ts              # Main export file
├── config.ts             # API configuration & helpers
├── types.ts              # Request/Response type definitions
├── auth.api.ts           # Authentication API service
├── users.api.ts          # User management API service
├── classes.api.ts        # Class management API service
├── tests.api.ts          # Test management API service
├── transactions.api.ts   # Transaction API service
├── notifications.api.ts  # Notifications API service
├── stats.api.ts          # Statistics API service
└── subjects.api.ts       # Subjects API service
```

## 🚀 Hướng Dẫn Sử Dụng

### Import API Services

```typescript
import { authApi, usersApi, classesApi } from '@/lib/api'
```

### Gọi API

```typescript
// Đăng nhập
const response = await authApi.login({ 
  email: 'user@example.com', 
  password: 'password' 
})

if (response.success) {
  console.log('User:', response.data.user)
  console.log('Token:', response.data.accessToken)
} else {
  console.error('Error:', response.error?.message)
}
```

### Với Redux Saga

```typescript
import { call, put } from 'redux-saga/effects'
import { authApi } from '@/lib/api'

function* handleLogin(action) {
  try {
    const response = yield call([authApi, authApi.login], action.payload)
    
    if (response.success) {
      yield put(loginSuccess(response.data.user))
    } else {
      yield put(loginFailure(response.error?.message))
    }
  } catch (error) {
    yield put(loginFailure('Đã có lỗi xảy ra'))
  }
}
```

## 📋 API Endpoints

### Authentication (`authApi`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `login(credentials)` | POST /auth/login | Đăng nhập |
| `register(data)` | POST /auth/register | Đăng ký |
| `demoLogin(role)` | - | Đăng nhập demo theo role |
| `logout()` | POST /auth/logout | Đăng xuất |
| `getCurrentUser()` | GET /auth/me | Lấy thông tin user hiện tại |

### Users (`usersApi`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllUsers(filters?)` | GET /users | Lấy tất cả users |
| `getTutors(filters?)` | GET /users/tutors | Lấy danh sách gia sư |
| `getTeachers(filters?)` | GET /users/teachers | Lấy danh sách giáo viên |
| `getStudents(filters?)` | GET /users/students | Lấy danh sách học sinh |
| `getParents(filters?)` | GET /users/parents | Lấy danh sách phụ huynh |
| `approveUser(request)` | PUT /users/:id/approve | Phê duyệt user |
| `getUserById(id)` | GET /users/:id | Lấy user theo ID |

### Classes (`classesApi`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllClasses(filters?)` | GET /classes | Lấy tất cả lớp học |
| `getClassById(id)` | GET /classes/:id | Lấy lớp học theo ID |
| `createClass(data)` | POST /classes | Tạo yêu cầu lớp học |
| `registerForClass(data)` | POST /classes/:id/register | Đăng ký nhận lớp |
| `getSessions(classId?)` | GET /sessions | Lấy danh sách buổi học |
| `updateAttendance(data)` | PUT /sessions/:id/attendance | Cập nhật điểm danh |

### Tests (`testsApi`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllTests(filters?)` | GET /tests | Lấy tất cả bài test |
| `getTestById(id)` | GET /tests/:id | Lấy bài test theo ID |
| `startTest(data)` | POST /tests/:id/start | Bắt đầu làm bài |
| `submitTest(data)` | POST /tests/attempts/:id/submit | Nộp bài |
| `createTest(data)` | POST /tests | Tạo bài test mới |

### Transactions (`transactionsApi`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllTransactions(filters?)` | GET /transactions | Lấy tất cả giao dịch |
| `createPayment(data)` | POST /transactions | Tạo giao dịch mới |
| `getStats()` | GET /transactions/stats | Lấy thống kê |
| `processPayout(id)` | PUT /transactions/:id/process | Xử lý thanh toán |
| `refundTransaction(id, reason?)` | POST /transactions/:id/refund | Hoàn tiền |

### Notifications (`notificationsApi`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getNotifications(userId?)` | GET /notifications | Lấy thông báo |
| `markAsRead(id)` | PUT /notifications/:id/read | Đánh dấu đã đọc |
| `markAllAsRead(userId)` | PUT /notifications/read-all | Đánh dấu tất cả đã đọc |

## ⚙️ Cấu Hình

### Thay đổi Base URL

Chỉnh sửa trong `lib/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  MOCK_DELAY: 800, // Remove in production
  VERSION: 'v1',
  TIMEOUT: 30000,
}
```

### Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

## 🔄 Chuyển Đổi Sang Backend Thật

Khi có backend thật, bạn cần:

1. **Cập nhật config.ts**: Đặt `MOCK_DELAY = 0` hoặc xóa delay
2. **Cập nhật API services**: Thay thế mock implementation bằng fetch/axios calls

### Ví dụ chuyển đổi:

**Mock (hiện tại):**
```typescript
async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  await delay(API_CONFIG.MOCK_DELAY)
  // Mock logic...
}
```

**Production (backend thật):**
```typescript
async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return response.json()
}
```

## 📝 Response Format

Tất cả API responses tuân theo format chuẩn:

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}
```

## 🧪 Testing

Mỗi API service có method `resetMockData()` để reset về trạng thái ban đầu:

```typescript
import { usersApi, classesApi } from '@/lib/api'

// Reset mock data
usersApi.resetMockData()
classesApi.resetMockData()
```
