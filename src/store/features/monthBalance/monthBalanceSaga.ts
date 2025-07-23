import { call, put, takeLatest } from 'redux-saga/effects'

import {
    getMonthBalanceRequest,
    getMonthBalanceSuccess,
    getMonthBalanceFailure
} from "./monthBalanceSlice";

import { getMonthBalanceAPI } from '../../../helper/api/backend';
import { PayloadAction } from '@reduxjs/toolkit';
import { MonthBalanceParams } from '../../../types/monthBalance';

function* monthBalanceSaga(action: PayloadAction<MonthBalanceParams>): Generator<any, any, any> {
    try {
        const res = yield call(getMonthBalanceAPI, action.payload);
        yield put(getMonthBalanceSuccess(res));
    } catch (error: any) {
        console.error("Error en monthBalanceSaga:", error);
        yield put(getMonthBalanceFailure(error?.response?.data?.message || 'No se pudo obtener el balance del mes'));
    }
}

export function* watchMonthBalanceSaga() {
    yield takeLatest(getMonthBalanceRequest.type, monthBalanceSaga);
}
