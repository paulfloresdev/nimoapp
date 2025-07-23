import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MonthTransactionsParams, MonthTransactionsPayload, MonthTransactionsState } from "../../../types/monthTransactions";
import { MonthBalancePayload } from "../../../types/monthBalance";

const initialState: MonthTransactionsState = {
    data: null,
    message: null,
    loading: false,
    error: null,
}

const monthTransactionsSlice = createSlice({
    name: "month_transactions",
    initialState,
    reducers: {
        getMonthTransactionsRequest: (state, action: PayloadAction<MonthTransactionsParams>) => {
            state.loading = true;
            state.error = null;
        },
        getMonthTransactionsSuccess: (state, action: PayloadAction<MonthTransactionsPayload>) => {
            state.loading = false;
            state.data = action.payload.data;
            state.message = action.payload.message;
        },
        getMonthTransactionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getMonthTransactionsRequest,
    getMonthTransactionsSuccess,
    getMonthTransactionsFailure
} = monthTransactionsSlice.actions;

export default monthTransactionsSlice.reducer;