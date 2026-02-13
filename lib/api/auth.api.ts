// ============================================
// AUTH API SERVICE
// ============================================
// Mock API service for authentication
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest } from './types'
import type { User, UserRole } from '@/types'
import {
    mockAdmin,
    mockTutors,
    mockTeachers,
    mockStudents,
    mockParents
} from '../mock-data'

class AuthApiService {
    /**
     * Login with email and password
     * POST /api/auth/login
     */
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        // Simulate network delay
        await delay(API_CONFIG.MOCK_DELAY)

        const { email } = credentials
        let user: User | null = null

        // Mock authentication logic - TODO: Replace with real API call
        if (email.includes('admin')) {
            user = mockAdmin
        } else if (email.includes('tutor')) {
            user = mockTutors[0]
        } else if (email.includes('teacher')) {
            user = mockTeachers[0]
        } else if (email.includes('student')) {
            user = mockStudents[0]
        } else if (email.includes('parent')) {
            user = mockParents[0]
        } else if (email.includes('accountant')) {
            user = { ...mockAdmin, id: 'accountant-001', role: 'accountant' as UserRole, fullName: 'Kế toán viên' }
        } else if (email.includes('office')) {
            user = { ...mockAdmin, id: 'office-001', role: 'office' as UserRole, fullName: 'Nhân viên văn phòng' }
        } else if (email.includes('test_user')) {
            user = { ...mockAdmin, id: 'test-user-001', role: 'test_user' as UserRole, fullName: 'Người tạo đề' }
        } else if (email.includes('test_manager')) {
            user = { ...mockAdmin, id: 'test-manager-001', role: 'test_manager' as UserRole, fullName: 'Quản lý đề thi' }
        }

        if (user) {
            return {
                success: true,
                data: {
                    user,
                    accessToken: `mock-access-token-${Date.now()}`,
                    refreshToken: `mock-refresh-token-${Date.now()}`,
                    expiresIn: 3600, // 1 hour
                },
                message: 'Đăng nhập thành công',
            }
        }

        return {
            success: false,
            data: null as any,
            error: {
                code: 'AUTH_INVALID_CREDENTIALS',
                message: 'Email hoặc mật khẩu không đúng',
            },
        }
    }

    /**
     * Register new user
     * POST /api/auth/register
     */
    async register(data: RegisterRequest): Promise<ApiResponse<User>> {
        await delay(API_CONFIG.MOCK_DELAY * 1.5)

        // Validate email uniqueness (mock)
        const existingUser = [...mockTutors, ...mockTeachers, ...mockStudents, ...mockParents]
            .find(u => u.email === data.email)

        if (existingUser) {
            return {
                success: false,
                data: null as any,
                error: {
                    code: 'AUTH_EMAIL_EXISTS',
                    message: 'Email đã được sử dụng',
                },
            }
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            email: data.email,
            fullName: data.fullName,
            phone: data.phone,
            role: data.role,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            twoFactorEnabled: false,
            language: 'vi',
        }

        return {
            success: true,
            data: newUser,
            message: 'Đăng ký thành công',
        }
    }

    /**
     * Demo login - quick login with a specific role
     */
    async demoLogin(role: UserRole): Promise<ApiResponse<LoginResponse>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        let user: User

        switch (role) {
            case 'admin':
                user = mockAdmin
                break
            case 'tutor':
                user = mockTutors[0]
                break
            case 'teacher':
                user = mockTeachers[0]
                break
            case 'student':
                user = mockStudents[0]
                break
            case 'parent':
                user = mockParents[0]
                break
            case 'accountant':
                user = { ...mockAdmin, id: 'accountant-001', role: 'accountant', fullName: 'Kế toán viên' }
                break
            case 'office':
                user = { ...mockAdmin, id: 'office-001', role: 'office', fullName: 'Nhân viên văn phòng' }
                break
            case 'test_user':
                user = { ...mockAdmin, id: 'test-user-001', role: 'test_user', fullName: 'Người tạo đề' }
                break
            case 'test_manager':
                user = { ...mockAdmin, id: 'test-manager-001', role: 'test_manager', fullName: 'Quản lý đề thi' }
                break
            default:
                user = mockStudents[0]
        }

        return {
            success: true,
            data: {
                user,
                accessToken: `mock-access-token-${Date.now()}`,
                refreshToken: `mock-refresh-token-${Date.now()}`,
                expiresIn: 3600,
            },
            message: 'Đăng nhập demo thành công',
        }
    }

    /**
     * Logout current user
     * POST /api/auth/logout
     */
    async logout(): Promise<ApiResponse<null>> {
        await delay(API_CONFIG.MOCK_DELAY / 4)

        return {
            success: true,
            data: null,
            message: 'Đăng xuất thành công',
        }
    }

    /**
     * Get current user info
     * GET /api/auth/me
     */
    async getCurrentUser(): Promise<ApiResponse<User>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        // In a real app, this would use the stored token
        // For mock, return null to indicate not logged in
        return {
            success: false,
            data: null as any,
            error: {
                code: 'AUTH_NOT_AUTHENTICATED',
                message: 'Chưa đăng nhập',
            },
        }
    }
}

export const authApi = new AuthApiService()
