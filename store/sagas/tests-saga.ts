// ============================================
// TESTS SAGA
// ============================================
// Handles test management side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  fetchTestsRequest,
  fetchTestsSuccess,
  fetchTestsFailure,
  startTestRequest,
  startTestSuccess,
  submitTestRequest,
  submitTestSuccess,
  createTestRequest,
  createTestSuccess,
  createTestFailure,
  fetchAvailableTestsRequest,
  fetchAvailableTestsSuccess,
  fetchAvailableTestsFailure,
  fetchCompletedTestsRequest,
  fetchCompletedTestsSuccess,
  fetchCompletedTestsFailure,
} from '../slices/tests-slice'
import { testsApi } from '@/lib/api'
import type { ApiResponse, StartTestRequest, SubmitTestRequest, CreateTestRequest, AvailableTest, CompletedTest } from '@/lib/api/types'
import type { Test, TestAttempt } from '@/types'

/**
 * Handle fetch all tests request
 * Calls: GET /api/tests
 */
function* handleFetchTests(): SagaIterator {
  try {
    const response: ApiResponse<Test[]> = yield call([testsApi, testsApi.getAllTests])

    if (response.success) {
      yield put(fetchTestsSuccess(response.data))
    } else {
      yield put(fetchTestsFailure(response.error?.message || 'Không thể tải danh sách bài test'))
    }
  } catch (error) {
    yield put(fetchTestsFailure('Đã có lỗi xảy ra khi tải danh sách bài test'))
  }
}

/**
 * Handle fetch available tests
 */
function* handleFetchAvailableTests(action: ReturnType<typeof fetchAvailableTestsRequest>): SagaIterator {
  try {
    const response: ApiResponse<AvailableTest[]> = yield call([testsApi, testsApi.getAvailableTests], action.payload)

    if (response.success) {
      yield put(fetchAvailableTestsSuccess(response.data))
    } else {
      yield put(fetchAvailableTestsFailure(response.error?.message || 'Không thể tải danh sách bài test có sẵn'))
    }
  } catch (error) {
    yield put(fetchAvailableTestsFailure('Đã có lỗi xảy ra khi tải danh sách bài test có sẵn'))
  }
}

/**
 * Handle fetch completed tests
 */
function* handleFetchCompletedTests(action: ReturnType<typeof fetchCompletedTestsRequest>): SagaIterator {
  try {
    const response: ApiResponse<CompletedTest[]> = yield call([testsApi, testsApi.getCompletedTests], action.payload)

    if (response.success) {
      yield put(fetchCompletedTestsSuccess(response.data))
    } else {
      yield put(fetchCompletedTestsFailure(response.error?.message || 'Không thể tải lịch sử bài test'))
    }
  } catch (error) {
    yield put(fetchCompletedTestsFailure('Đã có lỗi xảy ra khi tải lịch sử bài test'))
  }
}

/**
 * Handle start test request
 * Calls: POST /api/tests/:id/start
 */
function* handleStartTest(action: ReturnType<typeof startTestRequest>): SagaIterator {
  try {
    const response: ApiResponse<{ test: Test; attempt: TestAttempt } | null> = yield call(
      [testsApi, testsApi.startTest],
      action.payload as StartTestRequest
    )

    if (response.success && response.data) {
      yield put(startTestSuccess(response.data))
    } else {
      console.error('Start test failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error starting test:', error)
  }
}

/**
 * Handle submit test request
 * Calls: POST /api/tests/attempts/:id/submit
 */
function* handleSubmitTest(action: ReturnType<typeof submitTestRequest>): SagaIterator {
  try {
    const response: ApiResponse<TestAttempt> = yield call(
      [testsApi, testsApi.submitTest],
      action.payload as SubmitTestRequest
    )

    if (response.success) {
      yield put(submitTestSuccess(response.data))
    } else {
      console.error('Submit test failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error submitting test:', error)
  }
}

/**
 * Handle create test request
 * Calls: POST /api/tests
 */
function* handleCreateTest(action: ReturnType<typeof createTestRequest>): SagaIterator {
  try {
    const response: ApiResponse<Test> = yield call(
      [testsApi, testsApi.createTest],
      action.payload as CreateTestRequest
    )

    if (response.success) {
      yield put(createTestSuccess(response.data))
    } else {
      yield put(createTestFailure(response.error?.message || 'Không thể tạo bài kiểm tra'))
    }
  } catch (error) {
    yield put(createTestFailure('Đã có lỗi xảy ra khi tạo bài kiểm tra'))
  }
}

/**
 * Root tests saga
 */
export function* testsSaga(): SagaIterator {
  yield takeLatest(fetchTestsRequest.type, handleFetchTests)
  yield takeLatest(fetchAvailableTestsRequest.type, handleFetchAvailableTests)
  yield takeLatest(fetchCompletedTestsRequest.type, handleFetchCompletedTests)
  yield takeLatest(startTestRequest.type, handleStartTest)
  yield takeLatest(submitTestRequest.type, handleSubmitTest)
  yield takeLatest(createTestRequest.type, handleCreateTest)
}
