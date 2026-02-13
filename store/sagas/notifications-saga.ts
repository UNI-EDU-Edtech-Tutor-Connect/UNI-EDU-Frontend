// ============================================
// NOTIFICATIONS SAGA
// ============================================
// Handles notification side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  markAsReadRequest,
  markAsReadSuccess,
} from '../slices/notifications-slice'
import { notificationsApi } from '@/lib/api'
import type { ApiResponse } from '@/lib/api/types'
import type { Notification } from '@/types'

/**
 * Handle fetch notifications request
 * Calls: GET /api/notifications
 */
function* handleFetchNotifications(action: ReturnType<typeof fetchNotificationsRequest>): SagaIterator {
  try {
    const response: ApiResponse<Notification[]> = yield call(
      [notificationsApi, notificationsApi.getNotifications],
      action.payload
    )

    if (response.success) {
      yield put(fetchNotificationsSuccess(response.data))
    } else {
      console.error('Fetch notifications failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

/**
 * Handle mark notification as read
 * Calls: PUT /api/notifications/:id/read
 */
function* handleMarkAsRead(action: ReturnType<typeof markAsReadRequest>): SagaIterator {
  try {
    const response: ApiResponse<string> = yield call(
      [notificationsApi, notificationsApi.markAsRead],
      action.payload
    )

    if (response.success) {
      yield put(markAsReadSuccess(action.payload))
    } else {
      console.error('Mark as read failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

/**
 * Root notifications saga
 */
export function* notificationsSaga(): SagaIterator {
  yield takeLatest(fetchNotificationsRequest.type, handleFetchNotifications)
  yield takeLatest(markAsReadRequest.type, handleMarkAsRead)
}
