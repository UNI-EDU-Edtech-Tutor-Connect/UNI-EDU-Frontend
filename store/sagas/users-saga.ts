// ============================================
// USERS SAGA
// ============================================
// Handles user management side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  approveUserRequest,
  approveUserSuccess,
  fetchTutorStudentsRequest,
  fetchTutorStudentsSuccess,
  fetchTutorStudentsFailure,
  fetchParentChildrenRequest,
  fetchParentChildrenSuccess,
  fetchParentChildrenFailure,
  fetchChildDetailsRequest,
  fetchChildDetailsSuccess,
  fetchChildDetailsFailure
} from '../slices/users-slice'
import { usersApi } from '@/lib/api'
import type { ApiResponse, TutorStudent, ParentChildDetail } from '@/lib/api/types'
import type { TutorProfile, TeacherProfile, StudentProfile, ParentProfile } from '@/types'

/**
 * Handle fetch all users request
 * Calls: GET /api/users
 */
function* handleFetchUsers(): SagaIterator {
  try {
    const response: ApiResponse<{
      tutors: TutorProfile[]
      teachers: TeacherProfile[]
      students: StudentProfile[]
      parents: ParentProfile[]
    }> = yield call([usersApi, usersApi.getAllUsers])

    if (response.success) {
      yield put(fetchUsersSuccess(response.data))
    } else {
      yield put(fetchUsersFailure(response.error?.message || 'Không thể tải danh sách người dùng'))
    }
  } catch (error) {
    yield put(fetchUsersFailure('Đã có lỗi xảy ra khi tải danh sách người dùng'))
  }
}

/**
 * Handle fetch tutor students request
 * Calls: GET /api/tutors/:id/students
 */
function* handleFetchTutorStudents(action: ReturnType<typeof fetchTutorStudentsRequest>): SagaIterator {
  try {
    const response: ApiResponse<TutorStudent[]> = yield call([usersApi, usersApi.getTutorStudents], action.payload)

    if (response.success) {
      yield put(fetchTutorStudentsSuccess(response.data))
    } else {
      yield put(fetchTutorStudentsFailure(response.error?.message || 'Không thể tải danh sách học sinh'))
    }
  } catch (error) {
    yield put(fetchTutorStudentsFailure('Đã có lỗi xảy ra khi tải danh sách học sinh'))
  }
}

/**
 * Handle fetch parent children request
 */
function* handleFetchParentChildren(action: ReturnType<typeof fetchParentChildrenRequest>): SagaIterator {
  try {
    const response: ApiResponse<ParentChildDetail[]> = yield call([usersApi, usersApi.getParentChildren], action.payload)
    if (response.success) {
      yield put(fetchParentChildrenSuccess(response.data))
    } else {
      yield put(fetchParentChildrenFailure(response.message || 'Không thể tải danh sách con cái'))
    }
  } catch {
    yield put(fetchParentChildrenFailure('Đã có lỗi xảy ra khi tải danh sách con cái'))
  }
}

/**
 * Handle fetch child details request
 */
function* handleFetchChildDetails(action: ReturnType<typeof fetchChildDetailsRequest>): SagaIterator {
  try {
    const response: ApiResponse<ParentChildDetail> = yield call([usersApi, usersApi.getChildDetails], action.payload)
    if (response.success) {
      yield put(fetchChildDetailsSuccess(response.data))
    } else {
      yield put(fetchChildDetailsFailure(response.message || 'Không thể tải thông tin chi tiết con cái'))
    }
  } catch {
    yield put(fetchChildDetailsFailure('Đã có lỗi xảy ra khi tải thông tin chi tiết con cái'))
  }
}

/**
 * Handle approve/reject user request
 * Calls: PUT /api/users/:id/approve
 */
function* handleApproveUser(action: ReturnType<typeof approveUserRequest>): SagaIterator {
  try {
    const response: ApiResponse<{ userId: string; approved: boolean }> = yield call(
      [usersApi, usersApi.approveUser],
      action.payload
    )

    if (response.success) {
      yield put(approveUserSuccess(response.data))
    } else {
      // Could add a failure action here
      console.error('Approve user failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error approving user:', error)
  }
}

/**
 * Root users saga
 */
export function* usersSaga(): SagaIterator {
  yield takeLatest(fetchUsersRequest.type, handleFetchUsers)
  yield takeLatest(fetchTutorStudentsRequest.type, handleFetchTutorStudents)
  yield takeLatest(fetchParentChildrenRequest.type, handleFetchParentChildren)
  yield takeLatest(fetchChildDetailsRequest.type, handleFetchChildDetails)
  yield takeLatest(approveUserRequest.type, handleApproveUser)
}
