import { call, put, takeLatest } from 'redux-saga/effects'

import {
    storeTransactionsRequest
    , storeTransactionsSuccess
    , storeTransactionsFailure
    , updateTransactionsRequest
    , updateTransactionsSuccess
    , updateTransactionsFailure
    , destroyTransactionsRequest
    , destroyTransactionsSuccess
    , destroyTransactionsFailure
} from './transactionsSlice';

import { storeTransactionsAPI, updateTransactionsAPI, destroyTransactionsAPI } from '../../../helper/api/backend';  
import { PayloadAction } from '@reduxjs/toolkit';
import { UpdateTransactionPayload } from '../../../types/transactions';

//  Store
function* storeTransactionsSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(storeTransactionsAPI, action.payload);
        yield put(storeTransactionsSuccess(res));
    } catch (error: any) {
        console.error(error);
        yield put(storeTransactionsFailure(error?.response?.data?.message || "Error al almacenar transacción"));
    }
}

//  Update
function* updateTransactionsSaga(action: PayloadAction<UpdateTransactionPayload>): Generator<any, any, any> {
    try {
        const { id, data } = action.payload;
        const res = yield call(updateTransactionsAPI, id, data);
        yield put(updateTransactionsSuccess(res.data));
    } catch (error: any) {
        console.error(error);
        yield put(updateTransactionsFailure(error?.response?.data?.message || "Error al actualizar transacción"));
    }
}

//  Destroy
function* destroyTransactionsSaga(action: PayloadAction<string>): Generator<any, any, any> {
    try {
        const res = yield call(destroyTransactionsAPI, action.payload);
        yield put(destroyTransactionsSuccess(res.data));
    } catch (error: any) {
        console.error(error);
        yield put(destroyTransactionsFailure(error?.response?.data?.message || "Error al eliminar transacción"));
    }
}

export function* watchTransactionsSaga() {
    yield takeLatest(storeTransactionsRequest.type, storeTransactionsSaga);
    yield takeLatest(updateTransactionsRequest.type, updateTransactionsSaga);
    yield takeLatest(destroyTransactionsRequest.type, destroyTransactionsSaga);
}