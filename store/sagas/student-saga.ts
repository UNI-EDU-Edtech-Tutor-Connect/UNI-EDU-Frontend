import { call, put, takeLatest, all } from "redux-saga/effects"
import type { SagaIterator } from "redux-saga"
import { studentApi } from "@/lib/api/student.api"
import { testsApi } from "@/lib/api/tests.api"
import {
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
} from "../slices/student-slice"
import type { PayloadAction } from "@reduxjs/toolkit"

function* fetchScheduleSaga(): SagaIterator {
    try {
        const response = yield call([studentApi, studentApi.getSchedule])
        if (response.success) {
            yield put(fetchStudentScheduleSuccess(response.data))
        } else {
            yield put(fetchStudentScheduleFailure(response.message || "Failed to fetch schedule"))
        }
    } catch (error: any) {
        yield put(fetchStudentScheduleFailure(error.message))
    }
}

function* fetchPracticeTestsSaga(): SagaIterator {
    try {
        const response = yield call([studentApi, studentApi.getPracticeTests])
        if (response.success) {
            yield put(fetchPracticeTestsSuccess(response.data))
        } else {
            yield put(fetchPracticeTestsFailure(response.message || "Failed to fetch practice tests"))
        }
    } catch (error: any) {
        yield put(fetchPracticeTestsFailure(error.message))
    }
}

function* fetchTestQuestionsSaga(action: PayloadAction<string>): SagaIterator {
    try {
        const response = yield call([studentApi, studentApi.getTestQuestions], action.payload)
        if (response.success) {
            yield put(fetchTestQuestionsSuccess(response.data))
        } else {
            yield put(fetchTestQuestionsFailure(response.message || "Failed to fetch questions"))
        }
    } catch (error: any) {
        yield put(fetchTestQuestionsFailure(error.message))
    }
}

function* fetchStudentTestsSaga(): SagaIterator {
    try {
        // Assume we have userId in context or we can pass it. For now hardcode or use selector if needed.
        // But better is to let API handle "current user".
        const userId = "student-001" // Mock ID
        const availResponse = yield call([testsApi, testsApi.getAvailableTests], userId)
        const completedResponse = yield call([testsApi, testsApi.getCompletedTests], userId)

        if (availResponse.success && completedResponse.success) {
            yield put(fetchStudentTestsSuccess({
                available: availResponse.data,
                completed: completedResponse.data
            }))
        } else {
            yield put(fetchStudentTestsFailure("Failed to fetch tests"))
        }
    } catch (error: any) {
        yield put(fetchStudentTestsFailure(error.message))
    }
}

export function* studentSaga(): SagaIterator {
    yield all([
        takeLatest(fetchStudentScheduleRequest.type, fetchScheduleSaga),
        takeLatest(fetchPracticeTestsRequest.type, fetchPracticeTestsSaga),
        takeLatest(fetchTestQuestionsRequest.type, fetchTestQuestionsSaga),
        takeLatest(fetchStudentTestsRequest.type, fetchStudentTestsSaga),
    ])
}
