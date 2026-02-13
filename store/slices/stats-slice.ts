// ============================================
// STATS SLICE
// ============================================
// Redux slice for dashboard statistics

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
    AdminStats,
    TutorStats,
    StudentStats,
    OfficeStats,
    AccountantStats
} from '@/types'
import type { ChildReport } from '@/lib/api/types' // Import ChildReport

interface StatsState {
    adminStats: AdminStats | null
    tutorStats: TutorStats | null
    studentStats: StudentStats | null
    officeStats: OfficeStats | null
    accountantStats: AccountantStats | null
    childReport: ChildReport | null // Added childReport state
    isLoading: boolean
    error: string | null
}

const initialState: StatsState = {
    adminStats: null,
    tutorStats: null,
    studentStats: null,
    officeStats: null,
    accountantStats: null,
    childReport: null,
    isLoading: false,
    error: null,
}

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        // Fetch admin stats
        fetchAdminStatsRequest: (state) => {
            state.isLoading = true
            state.error = null
        },
        fetchAdminStatsSuccess: (state, action: PayloadAction<AdminStats>) => {
            state.isLoading = false
            state.adminStats = action.payload
        },
        fetchAdminStatsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },

        // Fetch tutor stats
        fetchTutorStatsRequest: (state, action: PayloadAction<string>) => {
            state.isLoading = true
            state.error = null
        },
        fetchTutorStatsSuccess: (state, action: PayloadAction<TutorStats>) => {
            state.isLoading = false
            state.tutorStats = action.payload
        },
        fetchTutorStatsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },

        // Fetch student stats
        fetchStudentStatsRequest: (state, action: PayloadAction<string>) => {
            state.isLoading = true
            state.error = null
        },
        fetchStudentStatsSuccess: (state, action: PayloadAction<StudentStats>) => {
            state.isLoading = false
            state.studentStats = action.payload
        },
        fetchStudentStatsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },

        // Fetch office stats
        fetchOfficeStatsRequest: (state) => {
            state.isLoading = true
            state.error = null
        },
        fetchOfficeStatsSuccess: (state, action: PayloadAction<OfficeStats>) => {
            state.isLoading = false
            state.officeStats = action.payload
        },
        fetchOfficeStatsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },

        // Fetch accountant stats
        fetchAccountantStatsRequest: (state) => {
            state.isLoading = true
            state.error = null
        },
        fetchAccountantStatsSuccess: (state, action: PayloadAction<AccountantStats>) => {
            state.isLoading = false
            state.accountantStats = action.payload
        },
        fetchAccountantStatsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },

        // Fetch child report
        fetchChildReportRequest: (state, action: PayloadAction<{ childId: string; period: string }>) => {
            state.isLoading = true
            state.error = null
        },
        fetchChildReportSuccess: (state, action: PayloadAction<ChildReport>) => {
            state.isLoading = false
            state.childReport = action.payload
        },
        fetchChildReportFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },

        // Clear stats
        clearStats: (state) => {
            state.adminStats = null
            state.tutorStats = null
            state.studentStats = null
            state.officeStats = null
            state.accountantStats = null
            state.childReport = null
        },
    },
})

export const {
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
    clearStats,
} = statsSlice.actions

export const statsReducer = statsSlice.reducer
