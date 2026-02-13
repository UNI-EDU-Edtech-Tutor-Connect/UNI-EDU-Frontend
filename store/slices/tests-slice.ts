import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Test, TestAttempt } from "@/types"
import type { AvailableTest, CompletedTest } from "@/lib/api/types"

interface TestsState {
  tests: Test[]
  attempts: TestAttempt[]
  currentTest: Test | null
  currentAttempt: TestAttempt | null
  availableTests: AvailableTest[]
  completedTests: CompletedTest[]
  isLoading: boolean
  error: string | null
}

const initialState: TestsState = {
  tests: [],
  attempts: [],
  currentTest: null,
  currentAttempt: null,
  availableTests: [],
  completedTests: [],
  isLoading: false,
  error: null,
}

const testsSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    fetchTestsRequest: (state) => {
      state.isLoading = true
    },
    fetchTestsSuccess: (state, action: PayloadAction<Test[]>) => {
      state.isLoading = false
      state.tests = action.payload
    },
    fetchTestsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Available Tests
    fetchAvailableTestsRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true
    },
    fetchAvailableTestsSuccess: (state, action: PayloadAction<AvailableTest[]>) => {
      state.isLoading = false
      state.availableTests = action.payload
    },
    fetchAvailableTestsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Completed Tests
    fetchCompletedTestsRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true
    },
    fetchCompletedTestsSuccess: (state, action: PayloadAction<CompletedTest[]>) => {
      state.isLoading = false
      state.completedTests = action.payload
    },
    fetchCompletedTestsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    startTestRequest: (state, action: PayloadAction<{ testId: string; userId: string }>) => {
      state.isLoading = true
    },
    startTestSuccess: (state, action: PayloadAction<{ test: Test; attempt: TestAttempt }>) => {
      state.isLoading = false
      state.currentTest = action.payload.test
      state.currentAttempt = action.payload.attempt
    },

    submitTestRequest: (
      state,
      action: PayloadAction<{ attemptId: string; answers: Record<string, string | string[]> }>,
    ) => {
      state.isLoading = true
    },
    submitTestSuccess: (state, action: PayloadAction<TestAttempt>) => {
      state.isLoading = false
      state.attempts.push(action.payload)
      state.currentTest = null
      state.currentTest = null
      state.currentAttempt = null
    },

    createTestRequest: (state, action: PayloadAction<Partial<Test>>) => {
      state.isLoading = true
    },
    createTestSuccess: (state, action: PayloadAction<Test>) => {
      state.isLoading = false
      state.tests.push(action.payload)
    },
    createTestFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchTestsRequest,
  fetchTestsSuccess,
  fetchTestsFailure,
  fetchAvailableTestsRequest,
  fetchAvailableTestsSuccess,
  fetchAvailableTestsFailure,
  fetchCompletedTestsRequest,
  fetchCompletedTestsSuccess,
  fetchCompletedTestsFailure,
  startTestRequest,
  startTestSuccess,
  submitTestRequest,
  submitTestSuccess,
  createTestRequest,
  createTestSuccess,
  createTestFailure,
} = testsSlice.actions

export const testsReducer = testsSlice.reducer
