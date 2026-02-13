// ============================================
// CLASSES SAGA
// ============================================
// Handles class management side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  fetchClassesRequest,
  fetchClassesSuccess,
  fetchClassesFailure,
  createClassRequest,
  createClassSuccess,
  registerForClassRequest,
  registerForClassSuccess,
  updateSessionAttendanceRequest,
  updateSessionAttendanceSuccess,
  updateSessionAttendanceFailure,
} from '../slices/classes-slice'
import { classesApi } from '@/lib/api'
import type { ApiResponse, CreateClassRequest, RegisterForClassRequest, UpdateAttendanceRequest } from '@/lib/api/types'
import type { ClassRequest, ClassSession } from '@/types'

/**
 * Handle fetch all classes request
 * Calls: GET /api/classes
 */
function* handleFetchClasses(): SagaIterator {
  try {
    const response: ApiResponse<{
      classes: ClassRequest[]
      sessions: ClassSession[]
    }> = yield call([classesApi, classesApi.getAllClasses])

    if (response.success) {
      yield put(fetchClassesSuccess(response.data))
    } else {
      yield put(fetchClassesFailure(response.error?.message || 'Không thể tải danh sách lớp học'))
    }
  } catch (error) {
    yield put(fetchClassesFailure('Đã có lỗi xảy ra khi tải danh sách lớp học'))
  }
}

/**
 * Handle create class request
 * Calls: POST /api/classes
 */
function* handleCreateClass(action: ReturnType<typeof createClassRequest>): SagaIterator {
  try {
    const response: ApiResponse<ClassRequest> = yield call(
      [classesApi, classesApi.createClass],
      action.payload as CreateClassRequest
    )

    if (response.success) {
      yield put(createClassSuccess(response.data))
    } else {
      // Could add a failure action here
      console.error('Create class failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error creating class:', error)
  }
}

/**
 * Handle register for class (tutor)
 * Calls: POST /api/classes/:id/register
 */
function* handleRegisterForClass(action: ReturnType<typeof registerForClassRequest>): SagaIterator {
  try {
    const response: ApiResponse<{
      classId: string
      tutorId: string
      tutorName: string
    }> = yield call(
      [classesApi, classesApi.registerForClass],
      action.payload as RegisterForClassRequest
    )

    if (response.success) {
      yield put(registerForClassSuccess(response.data))
    } else {
      console.error('Register for class failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error registering for class:', error)
  }
}

/**
 * Handle update session attendance
 * Calls: PUT /api/sessions/:id/attendance
 */
function* handleUpdateSessionAttendance(
  action: ReturnType<typeof updateSessionAttendanceRequest>
): SagaIterator {
  try {
    const response: ApiResponse<ClassSession> = yield call(
      [classesApi, classesApi.updateAttendance],
      action.payload as UpdateAttendanceRequest
    )

    if (response.success) {
      yield put(updateSessionAttendanceSuccess(response.data))
    } else {
      yield put(updateSessionAttendanceFailure(response.error?.message || 'Không thể cập nhật điểm danh'))
    }
  } catch (error) {
    yield put(updateSessionAttendanceFailure('Đã có lỗi xảy ra khi cập nhật điểm danh'))
  }
}

/**
 * Root classes saga
 */
export function* classesSaga(): SagaIterator {
  yield takeLatest(fetchClassesRequest.type, handleFetchClasses)
  yield takeLatest(createClassRequest.type, handleCreateClass)
  yield takeLatest(registerForClassRequest.type, handleRegisterForClass)
  yield takeLatest(updateSessionAttendanceRequest.type, handleUpdateSessionAttendance)
}
