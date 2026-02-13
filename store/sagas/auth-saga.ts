// ============================================
// AUTH SAGA
// ============================================
// Handles authentication side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  demoLogin,
  demoLoginSuccess,
} from '../slices/auth-slice'
import { authApi } from '@/lib/api'
import type { ApiResponse, LoginResponse, RegisterRequest } from '@/lib/api/types'
import type { User, UserRole } from '@/types'

/**
 * Handle login request
 * Calls: POST /api/auth/login
 */
function* handleLogin(action: ReturnType<typeof loginRequest>): SagaIterator {
  try {
    const response: ApiResponse<LoginResponse> = yield call(
      [authApi, authApi.login],
      action.payload
    )

    if (response.success) {
      // Store token in localStorage (in real app)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }

      yield put(loginSuccess(response.data.user))
    } else {
      yield put(loginFailure(response.error?.message || 'Đăng nhập thất bại'))
    }
  } catch (error) {
    yield put(loginFailure('Đã có lỗi xảy ra khi đăng nhập'))
  }
}

/**
 * Handle registration request
 * Calls: POST /api/auth/register
 */
function* handleRegister(action: ReturnType<typeof registerRequest>): SagaIterator {
  try {
    const response: ApiResponse<User> = yield call(
      [authApi, authApi.register],
      action.payload as RegisterRequest
    )

    if (response.success) {
      yield put(registerSuccess(response.data))
    } else {
      yield put(registerFailure(response.error?.message || 'Đăng ký thất bại'))
    }
  } catch (error) {
    yield put(registerFailure('Đã có lỗi xảy ra khi đăng ký'))
  }
}

/**
 * Handle demo login for testing different roles
 */
function* handleDemoLogin(action: ReturnType<typeof demoLogin>): SagaIterator {
  try {
    const response: ApiResponse<LoginResponse> = yield call(
      [authApi, authApi.demoLogin],
      action.payload as UserRole
    )

    if (response.success) {
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }

      yield put(demoLoginSuccess(response.data.user))
    } else {
      yield put(loginFailure(response.error?.message || 'Demo login thất bại'))
    }
  } catch (error) {
    yield put(loginFailure('Đã có lỗi xảy ra'))
  }
}

/**
 * Root auth saga
 */
export function* authSaga(): SagaIterator {
  yield takeLatest(loginRequest.type, handleLogin)
  yield takeLatest(registerRequest.type, handleRegister)
  yield takeLatest(demoLogin.type, handleDemoLogin)
}
