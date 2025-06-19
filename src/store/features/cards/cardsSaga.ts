import { call, put, takeLatest } from 'redux-saga/effects'

import {
    indexCardsRequest,
    indexCardsSuccess,
    indexCardsFailure
} from './cardsSlice';

import { indexCardsAPI } from '../../../helper/api/backend';

//  Index
function* indexCardsSaga(action: any): Generator<any, any, any> {
    try{
        const res = yield call(indexCardsAPI);
        yield put(indexCardsSuccess(res.data));
    } catch (error: any) {
        console.error(error);
        yield put(indexCardsFailure(error?.response?.data?.message || "error"));
    }
}

export function* watchCardsSaga() {
    yield takeLatest(indexCardsRequest.type, indexCardsSaga);
}