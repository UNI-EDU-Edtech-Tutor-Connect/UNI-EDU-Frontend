import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ScheduleItem, TestWithStats, Question, TestAttempt } from "@/types"
import type { AvailableTest, CompletedTest } from "@/lib/api/types"


interface StudentState {
    schedule: ScheduleItem[]
    practiceTests: TestWithStats[]
    currentTestQuestions: Question[]
    availableTests: AvailableTest[] // from testsApi
    completedTests: CompletedTest[] // from testsApi
    loading: boolean
    error: string | null
}

const initialState: StudentState = {
    schedule: [],
    practiceTests: [],
    currentTestQuestions: [],
    availableTests: [],
    completedTests: [],
    loading: false,
    error: null,
}

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        fetchStudentScheduleRequest: (state) => {
            state.loading = true
            state.error = null
        },
        fetchStudentScheduleSuccess: (state, action: PayloadAction<ScheduleItem[]>) => {
            state.loading = false
            state.schedule = action.payload
        },
        fetchStudentScheduleFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        fetchPracticeTestsRequest: (state) => {
            state.loading = true
            state.error = null
        },
        fetchPracticeTestsSuccess: (state, action: PayloadAction<TestWithStats[]>) => {
            state.loading = false
            state.practiceTests = action.payload
        },
        fetchPracticeTestsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        fetchTestQuestionsRequest: (state, action: PayloadAction<string>) => {
            state.loading = true
            state.error = null
        },
        fetchTestQuestionsSuccess: (state, action: PayloadAction<Question[]>) => {
            state.loading = false
            state.currentTestQuestions = action.payload
        },
        fetchTestQuestionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        // For general tests page
        fetchStudentTestsRequest: (state) => {
            state.loading = true
            state.error = null
        },
        fetchStudentTestsSuccess: (state, action: PayloadAction<{ available: AvailableTest[], completed: CompletedTest[] }>) => {
            state.loading = false
            state.availableTests = action.payload.available
            state.completedTests = action.payload.completed
        },
        fetchStudentTestsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        }
    },
})

export const {
    fetchStudentScheduleRequest,
    fetchStudentScheduleSuccess,
    fetchStudentScheduleFailure,
    fetchPracticeTestsRequest,
    fetchPracticeTestsSuccess,
    fetchPracticeTestsFailure,
    fetchTestQuestionsRequest,
    fetchTestQuestionsSuccess,
    fetchTestQuestionsFailure,
    fetchStudentTestsRequest,
    fetchStudentTestsSuccess,
    fetchStudentTestsFailure
} = studentSlice.actions

export default studentSlice.reducer
