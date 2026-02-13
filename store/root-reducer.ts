// ============================================
// ROOT REDUCER
// ============================================
// Combines all slice reducers into a single root reducer

import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth-slice'
import { usersReducer } from './slices/users-slice'
import { classesReducer } from './slices/classes-slice'
import { testsReducer } from './slices/tests-slice'
import { transactionsReducer } from './slices/transactions-slice'
import { notificationsReducer } from './slices/notifications-slice'
import { statsReducer } from './slices/stats-slice'
import { subjectsReducer } from './slices/subjects-slice'
import { uiReducer } from './slices/ui-slice'
import { auditLogReducer } from './slices/audit-log-slice'

import officeReducer from "./slices/office-slice"
import studentReducer from "./slices/student-slice"

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  classes: classesReducer,
  tests: testsReducer,
  transactions: transactionsReducer,
  notifications: notificationsReducer,
  stats: statsReducer,
  subjects: subjectsReducer,
  ui: uiReducer,
  auditLog: auditLogReducer,
  office: officeReducer,
  student: studentReducer,
})


