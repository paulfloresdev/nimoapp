import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MonthsWithParams, MonthsWithPayload, MonthsWithState } from "../../../types/transactions";

const initialState: MonthsWithState = {
    data: null,
    message: null,
    loading: false,
    error: null,
}

const monthsWithSlice = createSlice({
    name: "months_with",
    initialState,
    reducers: {
        getMonthsWithRequest: (state, action: PayloadAction<MonthsWithParams>) => {
            state.loading = true;
            state.error = null;
        },
        getMonthsWithSuccess: (state, action: PayloadAction<MonthsWithPayload>) => {
            state.loading = false;
            state.data = action.payload.data;
            state.message = action.payload.message;
        },
        getMonthsWithFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getMonthsWithRequest,
    getMonthsWithSuccess,
    getMonthsWithFailure
} = monthsWithSlice.actions;

export default monthsWithSlice.reducer;