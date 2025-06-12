import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice';
import yearsWithReducer from '../features/yearsWith/yearsWithSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    years_with: yearsWithReducer
});

export default rootReducer;