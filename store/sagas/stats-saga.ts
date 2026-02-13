// ============================================
// STATS SAGA
// ============================================
// Handles statistics fetching side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
    fetchAdminStatsRequest,
    fetchAdminStatsSuccess,
    fetchAdminStatsFailure,
    fetchTutorStatsRequest,
    fetchTutorStatsSuccess,
    fetchTutorStatsFailure,
    fetchStudentStatsRequest,
    fetchStudentStatsSuccess,
    fetchStudentStatsFailure,
    fetchOfficeStatsRequest,
    fetchOfficeStatsSuccess,
    fetchOfficeStatsFailure,
    fetchAccountantStatsRequest,
    fetchAccountantStatsSuccess,
    fetchAccountantStatsFailure,
    fetchChildReportRequest,
    fetchChildReportSuccess,
    fetchChildReportFailure,
} from '../slices/stats-slice'
import { statsApi } from '@/lib/api'
import type { ApiResponse, ChildReport } from '@/lib/api/types'
import type {
    AdminStats,
    TutorStats,
    StudentStats,
    OfficeStats,
    AccountantStats
} from '@/types'

/**
 * Handle fetch admin stats request
 * Calls: GET /api/stats/admin
 */
function* handleFetchAdminStats(): SagaIterator {
    try {
        const response: ApiResponse<AdminStats> = yield call([statsApi, statsApi.getAdminStats])

        if (response.success) {
            yield put(fetchAdminStatsSuccess(response.data))
        } else {
            yield put(fetchAdminStatsFailure(response.error?.message || 'Không thể tải thống kê Admin'))
        }
    } catch (error) {
        yield put(fetchAdminStatsFailure('Đã có lỗi xảy ra khi tải thống kê'))
    }
}

/**
 * Handle fetch tutor stats request
 * Calls: GET /api/stats/tutor
 */
function* handleFetchTutorStats(action: ReturnType<typeof fetchTutorStatsRequest>): SagaIterator {
    try {
        const response: ApiResponse<TutorStats> = yield call(
            [statsApi, statsApi.getTutorStats],
            action.payload
        )

        if (response.success) {
            yield put(fetchTutorStatsSuccess(response.data))
        } else {
            yield put(fetchTutorStatsFailure(response.error?.message || 'Không thể tải thống kê Gia sư'))
        }
    } catch (error) {
        yield put(fetchTutorStatsFailure('Đã có lỗi xảy ra khi tải thống kê'))
    }
}

/**
 * Handle fetch student stats request
 * Calls: GET /api/stats/student
 */
function* handleFetchStudentStats(action: ReturnType<typeof fetchStudentStatsRequest>): SagaIterator {
    try {
        const response: ApiResponse<StudentStats> = yield call(
            [statsApi, statsApi.getStudentStats],
            action.payload
        )

        if (response.success) {
            yield put(fetchStudentStatsSuccess(response.data))
        } else {
            yield put(fetchStudentStatsFailure(response.error?.message || 'Không thể tải thống kê Học sinh'))
        }
    } catch (error) {
        yield put(fetchStudentStatsFailure('Đã có lỗi xảy ra khi tải thống kê'))
    }
}

/**
 * Handle fetch office stats request
 * Calls: GET /api/stats/office
 */
function* handleFetchOfficeStats(): SagaIterator {
    try {
        const response: ApiResponse<OfficeStats> = yield call([statsApi, statsApi.getOfficeStats])

        if (response.success) {
            yield put(fetchOfficeStatsSuccess(response.data))
        } else {
            yield put(fetchOfficeStatsFailure(response.error?.message || 'Không thể tải thống kê Văn phòng'))
        }
    } catch (error) {
        yield put(fetchOfficeStatsFailure('Đã có lỗi xảy ra khi tải thống kê'))
    }
}

/**
 * Handle fetch accountant stats request
 * Calls: GET /api/stats/accountant
 */
function* handleFetchAccountantStats(): SagaIterator {
    try {
        const response: ApiResponse<AccountantStats> = yield call([statsApi, statsApi.getAccountantStats])

        if (response.success) {
            yield put(fetchAccountantStatsSuccess(response.data))
        } else {
            yield put(fetchAccountantStatsFailure(response.error?.message || 'Không thể tải thống kê Kế toán'))
        }
    } catch (error) {
        yield put(fetchAccountantStatsFailure('Đã có lỗi xảy ra khi tải thống kê'))
    }
}

/**
 * Handle fetch child report request
 * Calls: GET /api/stats/child/:id
 */
function* handleFetchChildReport(action: ReturnType<typeof fetchChildReportRequest>): SagaIterator {
    try {
        const { childId, period } = action.payload
        const response: ApiResponse<ChildReport> = yield call([statsApi, statsApi.getChildReport], childId, period)

        if (response.success) {
            yield put(fetchChildReportSuccess(response.data))
        } else {
            yield put(fetchChildReportFailure(response.error?.message || 'Không thể tải báo cáo học tập'))
        }
    } catch (error) {
        yield put(fetchChildReportFailure('Đã có lỗi xảy ra khi tải báo cáo học tập'))
    }
}

/**
 * Root stats saga
 */
export function* statsSaga(): SagaIterator {
    yield takeLatest(fetchAdminStatsRequest.type, handleFetchAdminStats)
    yield takeLatest(fetchTutorStatsRequest.type, handleFetchTutorStats)
    yield takeLatest(fetchStudentStatsRequest.type, handleFetchStudentStats)
    yield takeLatest(fetchOfficeStatsRequest.type, handleFetchOfficeStats)
    yield takeLatest(fetchAccountantStatsRequest.type, handleFetchAccountantStats)
    yield takeLatest(fetchChildReportRequest.type, handleFetchChildReport)
}
