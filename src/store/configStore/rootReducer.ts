import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice';
import yearsWithReducer from '../features/yearsWith/yearsWithSlice';
import cardsReducer from '../features/cards/cardsSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import incomeRelationsReducer from '../features/incomeRelations/incomeRelationsSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    years_with: yearsWithReducer,
    cards: cardsReducer,
    transactions: transactionsReducer,
    income_relations: incomeRelationsReducer,
});

export default rootReducer;