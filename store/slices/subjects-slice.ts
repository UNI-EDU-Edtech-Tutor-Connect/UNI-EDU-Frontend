// ============================================
// SUBJECTS SLICE
// ============================================
// Redux slice for subjects data

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Subject } from '@/types'

interface SubjectsState {
    subjects: Subject[]
    isLoading: boolean
    error: string | null
}

const initialState: SubjectsState = {
    subjects: [],
    isLoading: false,
    error: null,
}

const subjectsSlice = createSlice({
    name: 'subjects',
    initialState,
    reducers: {
        // Fetch subjects
        fetchSubjectsRequest: (state) => {
            state.isLoading = true
            state.error = null
        },
        fetchSubjectsSuccess: (state, action: PayloadAction<Subject[]>) => {
            state.isLoading = false
            state.subjects = action.payload
        },
        fetchSubjectsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export const {
    fetchSubjectsRequest,
    fetchSubjectsSuccess,
    fetchSubjectsFailure,
} = subjectsSlice.actions

export const subjectsReducer = subjectsSlice.reducer
