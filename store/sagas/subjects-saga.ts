// ============================================
// SUBJECTS SAGA
// ============================================
// Handles subjects side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
    fetchSubjectsRequest,
    fetchSubjectsSuccess,
    fetchSubjectsFailure,
} from '../slices/subjects-slice'
import { subjectsApi } from '@/lib/api'
import type { ApiResponse } from '@/lib/api/types'
import type { Subject } from '@/types'

/**
 * Handle fetch subjects request
 * Calls: GET /api/subjects
 */
function* handleFetchSubjects(): SagaIterator {
    try {
        const response: ApiResponse<Subject[]> = yield call([subjectsApi, subjectsApi.getAllSubjects])

        if (response.success) {
            yield put(fetchSubjectsSuccess(response.data))
        } else {
            yield put(fetchSubjectsFailure(response.error?.message || 'Không thể tải danh sách môn học'))
        }
    } catch (error) {
        yield put(fetchSubjectsFailure('Đã có lỗi xảy ra khi tải danh sách môn học'))
    }
}

/**
 * Root subjects saga
 */
export function* subjectsSaga(): SagaIterator {
    yield takeLatest(fetchSubjectsRequest.type, handleFetchSubjects)
}
