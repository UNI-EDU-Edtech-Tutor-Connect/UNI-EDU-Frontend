import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Notification } from "@/types"

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    fetchNotificationsRequest: (state, action: PayloadAction<string>) => {
      // payload is userId
      state.isLoading = true
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<Notification[]>) => {
      state.isLoading = false
      state.notifications = action.payload
      state.unreadCount = action.payload.filter((n) => !n.read).length
    },

    markAsReadRequest: (state, action: PayloadAction<string>) => { },
    markAsReadSuccess: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload)
      if (notif && !notif.read) {
        notif.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true))
      state.unreadCount = 0
    },
  },
})

export const {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  markAsReadRequest,
  markAsReadSuccess,
  markAllAsRead,
} = notificationsSlice.actions

export const notificationsReducer = notificationsSlice.reducer
