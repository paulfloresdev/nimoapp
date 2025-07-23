import { call, put, takeLatest } from 'redux-saga/effects'

import {
    indexCardsRequest,
    indexCardsSuccess,
    indexCardsFailure,
    storeCardsRequest,
    storeCardsSuccess,
    storeCardsFailure,
    updateCardsRequest,
    updateCardsSuccess,
    updateCardsFailure,
    destroyCardsRequest,
    destroyCardsSuccess,
    destroyCardsFailure
} from './cardsSlice';

import { indexCardsAPI, storeCardsAPI, updateCardsAPI, destroyCardsAPI } from '../../../helper/api/backend';
import { PayloadAction } from '@reduxjs/toolkit';
import { UpdateCardsParams } from '../../../types/cards';

//  Index
function* indexCardsSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(indexCardsAPI);
        yield put(indexCardsSuccess(res.data));
    } catch (error: any) {
        console.error(error);
        yield put(indexCardsFailure(error?.response?.data?.message || "error"));
    }
}

function* storeCardsSaga(action: any): Generator<any, any, any> {
    try {
        console.log("storeCardsSaga", action.payload);
        const res = yield call(storeCardsAPI, action.payload);
        console.log("res", res);
        yield put(storeCardsSuccess(res));
    } catch (error: any) {
        console.error(error);
        yield put(storeCardsFailure(error?.response?.data?.message || "Error al almacenar transacción"));
    }
}

function* updateCardsSaga(action: PayloadAction<UpdateCardsParams>): Generator<any, any, any> {
    try {
        const { id, data } = action.payload;
        const res = yield call(updateCardsAPI, id, data);
        yield put(updateCardsSuccess(res.data));
    } catch (error: any) {
        console.error(error);
        yield put(updateCardsFailure(error?.response?.data?.message || "Error al actualizar transacción"));
    }
}

function* destroyCardsSaga(action: PayloadAction<string>): Generator<any, any, any> {
    try {
        const res = yield call(destroyCardsAPI, action.payload);
        yield put(destroyCardsSuccess(res.data));
    } catch (error: any) {
        console.error(error);
        yield put(destroyCardsFailure(error?.response?.data?.message || "Error al eliminar transacción"));
    }
}

export function* watchCardsSaga() {
    yield takeLatest(indexCardsRequest.type, indexCardsSaga);
    yield takeLatest(storeCardsRequest.type, storeCardsSaga);
    yield takeLatest(updateCardsRequest.type, updateCardsSaga);
    yield takeLatest(destroyCardsRequest.type, destroyCardsSaga);
}