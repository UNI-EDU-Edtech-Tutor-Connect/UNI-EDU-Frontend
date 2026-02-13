// ============================================
// AUDIT LOG SLICE
// ============================================
// Redux slice for audit logs

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuditLog } from '@/types'

interface AuditLogState {
    logs: AuditLog[]
    total: number
    isLoading: boolean
    error: string | null
}

const initialState: AuditLogState = {
    logs: [],
    total: 0,
    isLoading: false,
    error: null,
}

const auditLogSlice = createSlice({
    name: 'auditLog',
    initialState,
    reducers: {
        fetchAuditLogsRequest: (state, action: PayloadAction<{ search?: string; action?: string; module?: string; severity?: string } | undefined>) => {
            state.isLoading = true
            state.error = null
        },
        fetchAuditLogsSuccess: (state, action: PayloadAction<{ items: AuditLog[]; total: number }>) => {
            state.isLoading = false
            state.logs = action.payload.items
            state.total = action.payload.total
        },
        fetchAuditLogsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export const {
    fetchAuditLogsRequest,
    fetchAuditLogsSuccess,
    fetchAuditLogsFailure,
} = auditLogSlice.actions

export const auditLogReducer = auditLogSlice.reducer
