import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ClassRequest, ClassSession } from "@/types"

interface ClassesState {
  classRequests: ClassRequest[]
  sessions: ClassSession[]
  isLoading: boolean
  error: string | null
}

const initialState: ClassesState = {
  classRequests: [],
  sessions: [],
  isLoading: false,
  error: null,
}

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    fetchClassesRequest: (state) => {
      state.isLoading = true
    },
    fetchClassesSuccess: (state, action: PayloadAction<{ classes: ClassRequest[]; sessions: ClassSession[] }>) => {
      state.isLoading = false
      state.classRequests = action.payload.classes
      state.sessions = action.payload.sessions
    },
    fetchClassesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Create class request
    createClassRequest: (state, action: PayloadAction<Partial<ClassRequest>>) => {
      state.isLoading = true
    },
    createClassSuccess: (state, action: PayloadAction<ClassRequest>) => {
      state.isLoading = false
      state.classRequests.push(action.payload)
    },

    // Register for class (tutor)
    registerForClassRequest: (state, action: PayloadAction<{ classId: string; tutorId: string }>) => {
      state.isLoading = true
    },
    registerForClassSuccess: (
      state,
      action: PayloadAction<{ classId: string; tutorId: string; tutorName: string }>,
    ) => {
      state.isLoading = false
      const classIndex = state.classRequests.findIndex((c) => c.id === action.payload.classId)
      if (classIndex !== -1) {
        state.classRequests[classIndex].status = "pending_payment"
        state.classRequests[classIndex].assignedTutorId = action.payload.tutorId
        state.classRequests[classIndex].assignedTutorName = action.payload.tutorName
      }
    },
    // Update session attendance
    updateSessionAttendanceRequest: (
      state,
      action: PayloadAction<{ sessionId: string; status: "attended" | "absent"; notes?: string }>
    ) => {
      state.isLoading = true
    },
    updateSessionAttendanceSuccess: (state, action: PayloadAction<ClassSession>) => {
      state.isLoading = false
      const sessionIndex = state.sessions.findIndex((s) => s.id === action.payload.id)
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = action.payload
      }
    },
    updateSessionAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchClassesRequest,
  fetchClassesSuccess,
  fetchClassesFailure,
  createClassRequest,
  createClassSuccess,
  registerForClassRequest,
  registerForClassSuccess,
  updateSessionAttendanceRequest,
  updateSessionAttendanceSuccess,
  updateSessionAttendanceFailure,
} = classesSlice.actions

export const classesReducer = classesSlice.reducer
