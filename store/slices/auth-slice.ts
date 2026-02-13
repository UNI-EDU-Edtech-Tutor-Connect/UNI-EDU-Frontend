import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User, UserRole } from "@/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  loginModalOpen: boolean
  registerModalOpen: boolean
  selectedRole: UserRole | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginModalOpen: false,
  registerModalOpen: false,
  selectedRole: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginRequest: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.loginModalOpen = false
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Register actions
    registerRequest: (
      state,
      action: PayloadAction<{ email: string; password: string; fullName: string; phone: string; role: UserRole }>,
    ) => {
      state.isLoading = true
      state.error = null
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.registerModalOpen = false
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Logout
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },

    // Modal controls
    openLoginModal: (state) => {
      state.loginModalOpen = true
      state.registerModalOpen = false
    },
    closeLoginModal: (state) => {
      state.loginModalOpen = false
    },
    openRegisterModal: (state, action: PayloadAction<UserRole | null>) => {
      state.registerModalOpen = true
      state.loginModalOpen = false
      state.selectedRole = action.payload
    },
    closeRegisterModal: (state) => {
      state.registerModalOpen = false
      state.selectedRole = null
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Demo login for testing
    demoLogin: (state, action: PayloadAction<UserRole>) => {
      state.isLoading = true
    },
    demoLoginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
    },
  },
})

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  clearError,
  demoLogin,
  demoLoginSuccess,
} = authSlice.actions

export const authReducer = authSlice.reducer
