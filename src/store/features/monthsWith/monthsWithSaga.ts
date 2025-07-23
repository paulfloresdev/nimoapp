import { call, put, takeLatest } from 'redux-saga/effects'

import {
    getMonthsWithRequest,
    getMonthsWithSuccess,
    getMonthsWithFailure
} from "./monthsWithSlice";

import { getMonthsWithAPI } from '../../../helper/api/backend';
import { PayloadAction } from '@reduxjs/toolkit';
import { MonthsWithParams } from '../../../types/transactions';

function* monthsWithSaga(action: PayloadAction<MonthsWithParams>): Generator<any, any, any> {
    try {
        const res = yield call(getMonthsWithAPI, action.payload); // Llamada a la API
        yield put(getMonthsWithSuccess(res));  // Se pasan los datos correctos
    } catch (error: any) {
        console.error("Error en meSaga:", error);
        yield put(getMonthsWithFailure(error?.response?.data?.message || 'No se pudo obtener el usuario'));
    }
}

export function* watchMonthsWithSaga() {
    yield takeLatest(getMonthsWithRequest.type, monthsWithSaga);
}