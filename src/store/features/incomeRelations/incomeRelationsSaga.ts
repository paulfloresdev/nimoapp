import { call, put, takeLatest } from 'redux-saga/effects'

import {
    storeIncomeRelationsRequest,
    storeIncomeRelationsSuccess,
    storeIncomeRelationsFailure,
    indexIncomeRelationsRequest,
    indexIncomeRelationsSuccess,
    indexIncomeRelationsFailure,
    verifyIncomeRelationsRequest,
    verifyIncomeRelationsSuccess,
    verifyIncomeRelationsFailure
} from './incomeRelationsSlice';
import { storeIncomeRelationsAPI, indexIncomeRelationsAPI, verifyIncomeRelationsAPI } from '../../../helper/api/backend';

function* indexIncomeRelationSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(indexIncomeRelationsAPI, action.payload);
        console.log(res);
        yield put(indexIncomeRelationsSuccess(res));
    } catch (error: any) {
        console.error(error);
        yield put(indexIncomeRelationsFailure(error?.response?.data?.message || "Error al obtener relaciones de ingresos"));
    }
}

function* storeIncomeRelationSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(storeIncomeRelationsAPI, action.payload);
        yield put(storeIncomeRelationsSuccess(res));
    } catch (error: any) {
        console.error(error);
        yield put(storeIncomeRelationsFailure(error?.response?.data?.message || "Error al almacenar relación de ingresos"));
    }
}

function* verifyIncomeRelationSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(verifyIncomeRelationsAPI, action.payload);
        yield put(verifyIncomeRelationsSuccess(res));
    } catch (error: any) {
        console.error(error);
        yield put(verifyIncomeRelationsFailure(error?.response?.data?.message || "Error al verificar relación de ingresos"));
    }
}

export function* watchIncomeRelationsSaga() {
    yield takeLatest(indexIncomeRelationsRequest.type, indexIncomeRelationSaga);
    yield takeLatest(storeIncomeRelationsRequest.type, storeIncomeRelationSaga);
    yield takeLatest(verifyIncomeRelationsRequest.type, verifyIncomeRelationSaga);
}

