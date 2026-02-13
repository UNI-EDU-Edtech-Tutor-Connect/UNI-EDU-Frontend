// ============================================
// AUDIT LOG SAGA
// ============================================
// Side effects for audit logs

import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
    fetchAuditLogsRequest,
    fetchAuditLogsSuccess,
    fetchAuditLogsFailure,
} from '../slices/audit-log-slice'
import { auditLogApi } from '@/lib/api/audit-log.api'
import type { SagaIterator } from 'redux-saga'

function* fetchAuditLogs(action: PayloadAction<{ search?: string; action?: string; module?: string; severity?: string } | undefined>): SagaIterator {
    try {
        const response = yield call([auditLogApi, auditLogApi.getAuditLogs], action.payload)

        if (response.success) {
            yield put(fetchAuditLogsSuccess({ items: response.data.items, total: response.data.total }))
        } else {
            yield put(fetchAuditLogsFailure(response.message || 'Failed to fetch audit logs'))
        }
    } catch (error: any) {
        yield put(fetchAuditLogsFailure(error.message || 'An error occurred'))
    }
}

export function* auditLogSaga(): SagaIterator {
    yield takeLatest(fetchAuditLogsRequest.type, fetchAuditLogs)
}
