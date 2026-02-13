import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Transaction, Wallet, AccountantStats } from "@/types"

interface TransactionsState {
  transactions: Transaction[]
  wallets: Record<string, Wallet>
  stats: AccountantStats | null
  isLoading: boolean
  error: string | null
}

const initialState: TransactionsState = {
  transactions: [],
  wallets: {},
  stats: null,
  isLoading: false,
  error: null,
}

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    fetchTransactionsRequest: (state) => {
      state.isLoading = true
    },
    fetchUserTransactionsRequest: (state, action: PayloadAction<string>) => {
      // payload is userId
      state.isLoading = true
    },
    fetchTransactionsSuccess: (
      state,
      action: PayloadAction<{ transactions: Transaction[]; stats: AccountantStats }>,
    ) => {
      state.isLoading = false
      state.transactions = action.payload.transactions
      state.stats = action.payload.stats
    },
    fetchUserTransactionsSuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.isLoading = false
      state.transactions = action.payload
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    createPaymentRequest: (state, action: PayloadAction<Partial<Transaction>>) => {
      state.isLoading = true
    },
    createPaymentSuccess: (state, action: PayloadAction<Transaction>) => {
      state.isLoading = false
      state.transactions.unshift(action.payload)
    },
    createPaymentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    processPayoutRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true
    },
    processPayoutSuccess: (state, action: PayloadAction<Transaction>) => {
      state.isLoading = false
      const index = state.transactions.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.transactions[index] = action.payload
      }
    },
    processPayoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    refundTransactionRequest: (state, action: PayloadAction<{ transactionId: string; reason: string }>) => {
      state.isLoading = true
    },
    refundTransactionSuccess: (state, action: PayloadAction<Transaction>) => {
      state.isLoading = false
      state.transactions.unshift(action.payload)
    },
    refundTransactionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  fetchUserTransactionsRequest,
  fetchUserTransactionsSuccess,
  createPaymentRequest,
  createPaymentSuccess,
  createPaymentFailure,
  processPayoutRequest,
  processPayoutSuccess,
  processPayoutFailure,
  refundTransactionRequest,
  refundTransactionSuccess,
  refundTransactionFailure,
} = transactionsSlice.actions

export const transactionsReducer = transactionsSlice.reducer
