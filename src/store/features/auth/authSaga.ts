import { call, put, takeLatest } from 'redux-saga/effects';

import {
    logInRequest,
    logInSuccess,
    logInFailure,
    signUpRequest,
    signUpSuccess,
    signUpFailure,
    logOutRequest,
    logOutSuccess,
    logOutFailure,
    meRequest,
    meSuccess,
    meFailure
} from './authSlice';

import { logInAPI, signUpAPI, logOutAPI, meAPI } from '../../../helper/api/backend';

function* logInSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(logInAPI, action.payload);
        yield put(logInSuccess(res.data));
    } catch (error: any) {
        yield put(logInFailure(error?.response?.data?.message || 'Error al iniciar sesión'));
    }
}

function* signUpSaga(action: any): Generator<any, any, any> {
    try {
        const res = yield call(signUpAPI, action.payload);
        yield put(signUpSuccess(res.data));
    } catch (error: any) {
        yield put(signUpFailure(error?.response?.data?.message || 'Error al registrarse'));
    }
}

function* logOutSaga(): Generator<any, any, any> {
    try {
        yield call(logOutAPI); // si tienes un endpoint
    } catch (e) {
        // ignora errores del backend si solo borras token
    }

    // Borrar token directamente
    localStorage.removeItem('token');

    // Redirigir inmediatamente
    window.location.href = '/login'; // fuerza recarga completa

    // Luego actualizas el estado redux
    yield put(logOutSuccess());
}



function* meSaga(): Generator<any, any, any> {
    const token = localStorage.getItem('token');
    if (!token) {
        yield put(meFailure("Token no encontrado"));
        return;
    }

    try {
        const user = yield call(meAPI);
        yield put(meSuccess(user));
    } catch (error) {
        yield put(meFailure("Error al obtener usuario"));
    }
}


export function* watchAuthSaga() {
    yield takeLatest(logInRequest.type, logInSaga);
    yield takeLatest(signUpRequest.type, signUpSaga);
    yield takeLatest(logOutRequest.type, logOutSaga);
    yield takeLatest(meRequest.type, meSaga);
}