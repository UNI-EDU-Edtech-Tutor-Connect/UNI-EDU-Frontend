import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark"
  language: "vi" | "en"
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: "light",
  language: "vi",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<"vi" | "en">) => {
      state.language = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, setTheme, setLanguage } = uiSlice.actions
export const uiReducer = uiSlice.reducer
