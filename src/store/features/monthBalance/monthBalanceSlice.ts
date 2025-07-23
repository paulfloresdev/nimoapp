import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MonthBalanceParams, MonthBalancePayload, MonthBalanceState } from "../../../types/monthBalance";

const initialState: MonthBalanceState = {
    data: null,
    message: null,
    loading: false,
    error: null,
}

const monthBalanceSlice = createSlice({
    name: "month_balance",
    initialState,
    reducers: {
        getMonthBalanceRequest: (state, action: PayloadAction<MonthBalanceParams>) => {
            state.loading = true;
            state.error = null;
        },
        getMonthBalanceSuccess: (state, action: PayloadAction<MonthBalancePayload>) => {
            state.loading = false;
            state.data = action.payload.data;
            state.message = action.payload.message;
        },
        getMonthBalanceFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getMonthBalanceRequest,
    getMonthBalanceSuccess,
    getMonthBalanceFailure
} = monthBalanceSlice.actions;

export default monthBalanceSlice.reducer;