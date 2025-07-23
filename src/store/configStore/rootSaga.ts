import { all, fork } from 'redux-saga/effects'

import { watchAuthSaga } from '../features/auth/authSaga';
import { watchYearsWithSaga } from '../features/yearsWith/yearsWithSaga';
import { watchCardsSaga } from '../features/cards/cardsSaga';
import { watchTransactionsSaga } from '../features/transactions/transactionsSaga';
import { watchIncomeRelationsSaga } from '../features/incomeRelations/incomeRelationsSaga';
import { watchMonthsWithSaga } from '../features/monthsWith/monthsWithSaga';
import { watchMonthBalanceSaga } from '../features/monthBalance/monthBalanceSaga';
import { watchCardBalanceSaga } from '../features/cardBalance/cardBalanceSaga';
import { watchMonthTransactionsSaga } from '../features/monthTransactions/monthTransactionsSaga';
import { watchContactsSaga } from '../features/contacts/contactsSaga';
import { watchBanksSaga } from '../features/banks/banksSaga';

export default function* rootSaga() {
    yield all([
        fork(watchAuthSaga),
        fork(watchYearsWithSaga),
        fork(watchCardsSaga),
        fork(watchTransactionsSaga),
        fork(watchIncomeRelationsSaga),
        fork(watchMonthsWithSaga),
        fork(watchMonthBalanceSaga),
        fork(watchCardBalanceSaga),
        fork(watchMonthTransactionsSaga),
        fork(watchContactsSaga),
        fork(watchBanksSaga),
    ])
}