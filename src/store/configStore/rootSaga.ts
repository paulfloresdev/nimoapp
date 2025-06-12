import { all, fork } from 'redux-saga/effects'

import { watchAuthSaga } from '../features/auth/authSaga';
import { watchYearsWithSaga } from '../features/yearsWith/yearsWithSaga';

export default function* rootSaga() {
    yield all([
        fork(watchAuthSaga),
        fork(watchYearsWithSaga)
    ])
}