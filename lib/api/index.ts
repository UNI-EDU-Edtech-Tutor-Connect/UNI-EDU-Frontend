// ============================================
// API SERVICES - MAIN EXPORT
// ============================================
// Central export file for all API services
// 
// Usage:
// import { authApi, usersApi, classesApi } from '@/lib/api'
// 
// Example:
// const response = await authApi.login({ email, password })
// if (response.success) {
//   console.log(response.data.user)
// } else {
//   console.error(response.error?.message)
// }

// Configuration
export * from './config'

// Types
export * from './types'

// API Services
export { authApi } from './auth.api'
export { usersApi } from './users.api'
export { classesApi } from './classes.api'
export { testsApi } from './tests.api'
export { transactionsApi } from './transactions.api'
export { notificationsApi } from './notifications.api'
export { statsApi } from './stats.api'
export { subjectsApi } from './subjects.api'
export { studentApi } from './student.api'

