import { call, put, takeLatest } from 'redux-saga/effects'

import {
    getMonthTransactionsRequest,
    getMonthTransactionsSuccess,
    getMonthTransactionsFailure
} from "./monthTransactionsSlice";

import { getMonthTransactionsAPI } from '../../../helper/api/backend';
import { PayloadAction } from '@reduxjs/toolkit';
import { MonthTransactionsParams } from '../../../types/monthTransactions';

function* monthTransactionsSaga(action: PayloadAction<MonthTransactionsParams>): Generator<any, any, any> {
    try {
        const res = yield call(getMonthTransactionsAPI, action.payload);
        yield put(getMonthTransactionsSuccess(res));
    } catch (error: any) {
        console.error("Error en monthTransactionsSaga:", error);
        yield put(getMonthTransactionsFailure(error?.response?.data?.message || 'No se pudieron obtener las transacciones del mes'));
    }
}

export function* watchMonthTransactionsSaga() {
    yield takeLatest(getMonthTransactionsRequest.type, monthTransactionsSaga);
}
