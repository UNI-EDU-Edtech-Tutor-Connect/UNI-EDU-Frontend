// ============================================
// ROOT SAGA
// ============================================
// Combines all sagas into a single root saga
// Uses fork to run all sagas concurrently

import { all, fork } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { authSaga } from './sagas/auth-saga'
import { usersSaga } from './sagas/users-saga'
import { classesSaga } from './sagas/classes-saga'
import { testsSaga } from './sagas/tests-saga'
import { transactionsSaga } from './sagas/transactions-saga'
import { notificationsSaga } from './sagas/notifications-saga'
import { statsSaga } from './sagas/stats-saga'
import { subjectsSaga } from './sagas/subjects-saga'
import { auditLogSaga } from './sagas/audit-log-saga'


import { officeSaga } from './sagas/office-saga'
import { studentSaga } from './sagas/student-saga'


/**
 * Root saga that combines all feature sagas
 * Each saga runs in a forked task for independent execution
 */
export function* rootSaga(): SagaIterator {
  yield all([
    fork(authSaga),
    fork(usersSaga),
    fork(classesSaga),
    fork(testsSaga),
    fork(transactionsSaga),
    fork(notificationsSaga),
    fork(statsSaga),
    fork(subjectsSaga),
    fork(auditLogSaga),
    fork(officeSaga),
    fork(studentSaga),
  ])
}

