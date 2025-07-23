import { call, put, takeLatest } from 'redux-saga/effects'

import {
    getCardBalanceRequest,
    getCardBalanceSuccess,
    getCardBalanceFailure
} from "./cardBalanceSlice";

import { getCardBalanceAPI } from '../../../helper/api/backend';
import { PayloadAction } from '@reduxjs/toolkit';
import { CardBalanceParams } from '../../../types/cardBalance';

function* cardBalanceSaga(action: PayloadAction<CardBalanceParams>): Generator<any, any, any> {
    try {
        const res = yield call(getCardBalanceAPI, action.payload);
        yield put(getCardBalanceSuccess(res));
    } catch (error: any) {
        console.error("Error en cardBalanceSaga:", error);
        yield put(getCardBalanceFailure(error?.response?.data?.message || 'No se pudo obtener el balance de la tarjeta'));
    }
}

export function* watchCardBalanceSaga() {
    yield takeLatest(getCardBalanceRequest.type, cardBalanceSaga);
}