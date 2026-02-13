import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { TutorProfile, TeacherProfile, StudentProfile, ParentProfile } from "@/types"
import type { TutorStudent, ParentChild, ParentChildDetail } from "@/lib/api/types"

interface UsersState {
  tutors: TutorProfile[]
  teachers: TeacherProfile[]
  students: StudentProfile[]
  parents: ParentProfile[]
  tutorStudents: TutorStudent[]
  parentChildren: ParentChildDetail[] // Changed to ParentChildDetail
  childDetails: Record<string, ParentChildDetail>
  pendingApprovals: (TutorProfile | TeacherProfile)[]
  isLoading: boolean
  error: string | null
}

const initialState: UsersState = {
  tutors: [],
  teachers: [],
  students: [],
  parents: [],
  tutorStudents: [],
  parentChildren: [],
  childDetails: {},
  pendingApprovals: [],
  isLoading: false,
  error: null,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Fetch users
    fetchUsersRequest: (state) => {
      state.isLoading = true
    },
    fetchUsersSuccess: (
      state,
      action: PayloadAction<{
        tutors: TutorProfile[]
        teachers: TeacherProfile[]
        students: StudentProfile[]
        parents: ParentProfile[]
      }>,
    ) => {
      state.isLoading = false
      state.tutors = action.payload.tutors
      state.teachers = action.payload.teachers
      state.students = action.payload.students
      state.parents = action.payload.parents
      state.pendingApprovals = [
        ...action.payload.tutors.filter((t) => t.approvalStatus === "pending"),
        ...action.payload.teachers.filter((t) => t.approvalStatus === "pending"),
      ]
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Fetch tutor students
    fetchTutorStudentsRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true
    },
    fetchTutorStudentsSuccess: (state, action: PayloadAction<TutorStudent[]>) => {
      state.isLoading = false
      state.tutorStudents = action.payload
    },
    fetchTutorStudentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Fetch parent children
    fetchParentChildrenRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true
    },
    fetchParentChildrenSuccess: (state, action: PayloadAction<ParentChildDetail[]>) => { // Changed to ParentChildDetail
      state.isLoading = false
      state.parentChildren = action.payload
    },
    fetchParentChildrenFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Fetch child details
    fetchChildDetailsRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true
    },
    fetchChildDetailsSuccess: (state, action: PayloadAction<ParentChildDetail>) => {
      state.isLoading = false
      state.childDetails[action.payload.id] = action.payload
    },
    fetchChildDetailsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Approve user
    approveUserRequest: (state, action: PayloadAction<{ userId: string; approved: boolean }>) => {
      state.isLoading = true
    },
    approveUserSuccess: (state, action: PayloadAction<{ userId: string; approved: boolean }>) => {
      state.isLoading = false
      const { userId, approved } = action.payload
      state.pendingApprovals = state.pendingApprovals.filter((u) => u.id !== userId)

      const tutorIndex = state.tutors.findIndex((t) => t.id === userId)
      if (tutorIndex !== -1) {
        state.tutors[tutorIndex].approvalStatus = approved ? "approved" : "rejected"
      }

      const teacherIndex = state.teachers.findIndex((t) => t.id === userId)
      if (teacherIndex !== -1) {
        state.teachers[teacherIndex].approvalStatus = approved ? "approved" : "rejected"
      }
    },
  },
})

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchTutorStudentsRequest,
  fetchTutorStudentsSuccess,
  fetchTutorStudentsFailure,
  fetchParentChildrenRequest,
  fetchParentChildrenSuccess,
  fetchParentChildrenFailure,
  fetchChildDetailsRequest,
  fetchChildDetailsSuccess,
  fetchChildDetailsFailure,
  approveUserRequest,
  approveUserSuccess
} = usersSlice.actions

export const usersReducer = usersSlice.reducer
