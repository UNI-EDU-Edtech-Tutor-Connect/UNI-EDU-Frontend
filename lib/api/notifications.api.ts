// ============================================
// NOTIFICATIONS API SERVICE
// ============================================
// Mock API service for notifications
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type { ApiResponse, PaginatedResponse } from './types'
import type { Notification } from '@/types'
import { mockNotifications } from '../mock-data'

// Local mock data storage for mutations
let notificationsData = [...mockNotifications]

class NotificationsApiService {
    /**
     * Get all notifications for user
     * GET /api/notifications
     */
    async getNotifications(userId?: string): Promise<ApiResponse<Notification[]>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        let notifications = [...notificationsData]

        if (userId) {
            notifications = notifications.filter(n => n.userId === userId)
        }

        // Sort by date, newest first
        notifications.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        return {
            success: true,
            data: notifications,
            message: 'Lấy thông báo thành công',
        }
    }

    /**
     * Get notifications with pagination
     * GET /api/notifications
     */
    async getNotificationsPaginated(
        userId: string,
        page = 1,
        pageSize = 20
    ): Promise<ApiResponse<PaginatedResponse<Notification>>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const userNotifications = notificationsData.filter(n => n.userId === userId)
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedItems = userNotifications.slice(start, end)

        return {
            success: true,
            data: {
                items: paginatedItems,
                total: userNotifications.length,
                page,
                pageSize,
                totalPages: Math.ceil(userNotifications.length / pageSize),
            },
        }
    }

    /**
     * Get unread count
     * GET /api/notifications/unread-count
     */
    async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
        await delay(API_CONFIG.MOCK_DELAY / 4)

        const unreadCount = notificationsData.filter(
            n => n.userId === userId && !n.read
        ).length

        return {
            success: true,
            data: unreadCount,
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/:id/read
     */
    async markAsRead(notificationId: string): Promise<ApiResponse<string>> {
        await delay(API_CONFIG.MOCK_DELAY / 4)

        const notificationIndex = notificationsData.findIndex(n => n.id === notificationId)

        if (notificationIndex === -1) {
            return {
                success: false,
                data: notificationId,
                error: {
                    code: 'NOTIFICATION_NOT_FOUND',
                    message: 'Không tìm thấy thông báo',
                },
            }
        }

        notificationsData[notificationIndex] = {
            ...notificationsData[notificationIndex],
            read: true,
        }

        return {
            success: true,
            data: notificationId,
            message: 'Đã đánh dấu đã đọc',
        }
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/read-all
     */
    async markAllAsRead(userId: string): Promise<ApiResponse<null>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        notificationsData = notificationsData.map(n =>
            n.userId === userId ? { ...n, read: true } : n
        )

        return {
            success: true,
            data: null,
            message: 'Đã đánh dấu tất cả đã đọc',
        }
    }

    /**
     * Create notification (for admin/system use)
     * POST /api/notifications
     */
    async createNotification(data: Omit<Notification, 'id' | 'createdAt'>): Promise<ApiResponse<Notification>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const newNotification: Notification = {
            ...data,
            id: `notif-${Date.now()}`,
            createdAt: new Date().toISOString(),
        }

        notificationsData.unshift(newNotification)

        return {
            success: true,
            data: newNotification,
            message: 'Tạo thông báo thành công',
        }
    }

    /**
     * Delete notification
     * DELETE /api/notifications/:id
     */
    async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
        await delay(API_CONFIG.MOCK_DELAY / 4)

        const notificationIndex = notificationsData.findIndex(n => n.id === notificationId)

        if (notificationIndex === -1) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'NOTIFICATION_NOT_FOUND',
                    message: 'Không tìm thấy thông báo',
                },
            }
        }

        notificationsData.splice(notificationIndex, 1)

        return {
            success: true,
            data: null,
            message: 'Xóa thông báo thành công',
        }
    }

    /**
     * Reset mock data (for testing)
     */
    resetMockData(): void {
        notificationsData = [...mockNotifications]
    }
}

export const notificationsApi = new NotificationsApiService()
