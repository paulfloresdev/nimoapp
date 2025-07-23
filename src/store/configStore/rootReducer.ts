import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice';
import yearsWithReducer from '../features/yearsWith/yearsWithSlice';
import cardsReducer from '../features/cards/cardsSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import incomeRelationsReducer from '../features/incomeRelations/incomeRelationsSlice';
import monthsWithReducer from '../features/monthsWith/monthsWithSlice';
import monthBalanceReducer from '../features/monthBalance/monthBalanceSlice';
import cardBalanceReducer from '../features/cardBalance/cardBalanceSlice';
import monthTransactionsReducer from '../features/monthTransactions/monthTransactionsSlice';
import contactsSlice from '../features/contacts/contactsSlice';
import banksSlice from '../features/banks/banksSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    years_with: yearsWithReducer,
    cards: cardsReducer,
    transactions: transactionsReducer,
    income_relations: incomeRelationsReducer,
    months_with: monthsWithReducer,
    month_balance: monthBalanceReducer,
    card_balance: cardBalanceReducer,
    month_transactions: monthTransactionsReducer,
    contacts: contactsSlice,
    banks: banksSlice,
});

export default rootReducer;