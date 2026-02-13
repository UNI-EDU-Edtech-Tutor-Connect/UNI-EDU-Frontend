// ============================================
// TRANSACTIONS SAGA
// ============================================
// Handles transaction management side effects using Redux Saga
// Uses API service layer for all data fetching

import { call, put, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  fetchUserTransactionsRequest,
  fetchUserTransactionsSuccess,
  createPaymentRequest,
  createPaymentSuccess,
  processPayoutRequest,
  processPayoutSuccess,
  processPayoutFailure,
  refundTransactionRequest,
  refundTransactionSuccess,
  refundTransactionFailure,
} from '../slices/transactions-slice'
import { transactionsApi } from '@/lib/api'
import type { ApiResponse, CreatePaymentRequest } from '@/lib/api/types'
import type { Transaction, AccountantStats } from '@/types'

/**
 * Handle fetch all transactions request
 * Calls: GET /api/transactions
 */
function* handleFetchTransactions(): SagaIterator {
  try {
    const response: ApiResponse<{
      transactions: Transaction[]
      stats: AccountantStats
    }> = yield call([transactionsApi, transactionsApi.getAllTransactions])

    if (response.success) {
      yield put(fetchTransactionsSuccess(response.data))
    } else {
      yield put(fetchTransactionsFailure(response.error?.message || 'Không thể tải danh sách giao dịch'))
    }
  } catch (error) {
    yield put(fetchTransactionsFailure('Đã có lỗi xảy ra khi tải danh sách giao dịch'))
  }
}

/**
 * Handle create payment request
 * Calls: POST /api/transactions
 */
function* handleCreatePayment(action: ReturnType<typeof createPaymentRequest>): SagaIterator {
  try {
    const response: ApiResponse<Transaction> = yield call(
      [transactionsApi, transactionsApi.createPayment],
      action.payload as CreatePaymentRequest
    )

    if (response.success) {
      yield put(createPaymentSuccess(response.data))
    } else {
      console.error('Create payment failed:', response.error?.message)
    }
  } catch (error) {
    console.error('Error creating payment:', error)
  }
}

/**
 * Handle process payout request
 * Calls: PUT /api/transactions/:id/process
 */
function* handleProcessPayout(action: ReturnType<typeof processPayoutRequest>): SagaIterator {
  try {
    const response: ApiResponse<Transaction> = yield call(
      [transactionsApi, transactionsApi.processPayout],
      action.payload
    )

    if (response.success) {
      yield put(processPayoutSuccess(response.data))
      // Refresh transactions list
      yield call(handleFetchTransactions)
    } else {
      yield put(processPayoutFailure(response.error?.message || 'Processing payout failed'))
    }
  } catch (error: any) {
    yield put(processPayoutFailure(error.message || 'Error processing payout'))
  }
}

/**
 * Handle refund transaction request
 * Calls: POST /api/transactions/:id/refund
 */
function* handleRefundTransaction(action: ReturnType<typeof refundTransactionRequest>): SagaIterator {
  try {
    const { transactionId, reason } = action.payload
    const response: ApiResponse<Transaction> = yield call(
      [transactionsApi, transactionsApi.refundTransaction],
      transactionId,
      reason
    )

    if (response.success) {
      yield put(refundTransactionSuccess(response.data))
      // Refresh transactions list
      yield call(handleFetchTransactions)
    } else {
      yield put(refundTransactionFailure(response.error?.message || 'Refund failed'))
    }
  } catch (error: any) {
    yield put(refundTransactionFailure(error.message || 'Error processing refund'))
  }
}

/**
 * Handle fetch user transactions request
 * Calls: GET /api/transactions?userId=:id
 */
function* handleFetchUserTransactions(action: ReturnType<typeof fetchUserTransactionsRequest>): SagaIterator {
  try {
    const response: ApiResponse<Transaction[]> = yield call([transactionsApi, transactionsApi.getUserTransactions], action.payload)

    if (response.success) {
      yield put(fetchUserTransactionsSuccess(response.data))
    } else {
      yield put(fetchTransactionsFailure(response.error?.message || 'Không thể tải danh sách giao dịch'))
    }
  } catch (error) {
    yield put(fetchTransactionsFailure('Đã có lỗi xảy ra khi tải danh sách giao dịch'))
  }
}

/**
 * Root transactions saga
 */
export function* transactionsSaga(): SagaIterator {
  yield takeLatest(fetchTransactionsRequest.type, handleFetchTransactions)
  yield takeLatest(fetchUserTransactionsRequest.type, handleFetchUserTransactions)
  yield takeLatest(createPaymentRequest.type, handleCreatePayment)
  yield takeLatest(processPayoutRequest.type, handleProcessPayout)
  yield takeLatest(refundTransactionRequest.type, handleRefundTransaction)
}
