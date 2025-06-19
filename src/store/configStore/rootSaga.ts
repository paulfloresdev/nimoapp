import { all, fork } from 'redux-saga/effects'

import { watchAuthSaga } from '../features/auth/authSaga';
import { watchYearsWithSaga } from '../features/yearsWith/yearsWithSaga';
import { watchCardsSaga } from '../features/cards/cardsSaga';
import { watchTransactionsSaga } from '../features/transactions/transactionsSaga';
import { watchIncomeRelationsSaga } from '../features/incomeRelations/incomeRelationsSaga';

export default function* rootSaga() {
    yield all([
        fork(watchAuthSaga),
        fork(watchYearsWithSaga),
        fork(watchCardsSaga),
        fork(watchTransactionsSaga),
        fork(watchIncomeRelationsSaga),
    ])
}