import { call, put, takeLatest } from 'redux-saga/effects'

import {
    indexBanksRequest,
    indexBanksSuccess,
    indexBanksFailure,
} from './banksSlice';

import { indexBanksAPI } from '../../../helper/api/backend';

//  Index
function* indexBanksSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(indexBanksAPI);
        yield put(indexBanksSuccess(res.data));
    } catch (error: any) {
        console.error(error);
        yield put(indexBanksFailure(error?.response?.data?.message || "error"));
    }
}

export function* watchBanksSaga() {
    yield takeLatest(indexBanksRequest.type, indexBanksSaga);
}