import { call, put, takeLatest } from 'redux-saga/effects'

import {
    indexContactRequest,
    indexContactSuccess,
    indexContactFailure,
    storeContactRequest,
    storeContactSuccess,
    storeContactFailure,
    updateContactRequest,
    updateContactSuccess,
    updateContactFailure,
    destroyContactRequest,
    destroyContactSuccess,
    destroyContactFailure
} from "./contactsSlice";

import { indexContactsAPI, storeContactsAPI, updateContactsAPI, destroyContactsAPI } from '../../../helper/api/backend';
import { PayloadAction } from '@reduxjs/toolkit';
import { StoreAndUpdateContactPayload, UpdateContactParams } from '../../../types/contacts';

function* indexContactSaga(action: PayloadAction<string | undefined>): Generator<any, any, any> {
    try {
        const res = yield call(indexContactsAPI, action.payload);
        yield put(indexContactSuccess(res));
    } catch (error: any) {
        console.error("Error en indexContactsSaga:", error);
        yield put(indexContactFailure(error?.response?.data?.message || 'No se pudieron obtener los contactos'));
    }
}

function* storeContactSaga(action: PayloadAction<StoreAndUpdateContactPayload>): Generator<any, any, any> {
    try {
        const res = yield call(storeContactsAPI, action.payload);
        yield put(storeContactSuccess(res));
    } catch (error: any) {
        console.error("Error en storeContactSaga:", error);
        yield put(storeContactFailure(error?.response?.data?.message || 'No se pudo almacenar el contacto'));
    }
}

function* updateContactSaga(action: PayloadAction<UpdateContactParams>): Generator<any, any, any> {
    try {
        const res = yield call(updateContactsAPI, action.payload);
        yield put(updateContactSuccess(res));
    } catch (error: any) {
        console.error("Error en updateContactSaga:", error);
        yield put(updateContactFailure(error?.response?.data?.message || 'No se pudo actualizar el contacto'));
    }
}

function* destroyContactSaga(action: PayloadAction<string>): Generator<any, any, any> {
    try {
        const res = yield call(destroyContactsAPI, action.payload);
        yield put(destroyContactSuccess(res.message));
    } catch (error: any) {
        console.error("Error en destroyContactSaga:", error);
        yield put(destroyContactFailure(error?.response?.data?.message || 'No se pudo eliminar el contacto'));
    }
}

export function* watchContactsSaga() {
    yield takeLatest(indexContactRequest.type, indexContactSaga);
    yield takeLatest(storeContactRequest.type, storeContactSaga);
    yield takeLatest(updateContactRequest.type, updateContactSaga);
    yield takeLatest(destroyContactRequest.type, destroyContactSaga);
}