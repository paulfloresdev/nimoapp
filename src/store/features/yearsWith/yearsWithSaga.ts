import { call, put, takeLatest } from 'redux-saga/effects'
import {
    getYearsWithRequest,
    getYearsWithSuccess,
    getYearsWithFailure
} from './yearsWithSlice';

import { getYearsWithAPI } from '../../../helper/api/backend';

function* yearsWithSaga(): Generator<any, any, any> {
    try {
        const res = yield call(getYearsWithAPI); // Llamada a la API
        yield put(getYearsWithSuccess(res.data));  // Se pasan los datos correctos
    } catch (error: any) {
        console.error("Error en meSaga:", error);
        yield put(getYearsWithFailure(error?.response?.data?.message || 'No se pudo obtener el usuario'));
    }
}

export function* watchYearsWithSaga() {
    yield takeLatest(getYearsWithRequest.type, yearsWithSaga);
}
