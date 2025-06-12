import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { YearsWithState } from "../../../types/yearsWith";

const initialState: YearsWithState = {
    data: null,
    loading: false,
    error: null,
}

const yearsWithSlice = createSlice({
    name: 'years_with',
    initialState,
    reducers: {
        getYearsWithRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getYearsWithSuccess: (state, action: PayloadAction<number[]>) => {
            state.loading = false;
            state.data = action.payload;
        },
        getYearsWithFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getYearsWithRequest,
    getYearsWithSuccess,
    getYearsWithFailure
} = yearsWithSlice.actions;

export default yearsWithSlice.reducer;
export type { YearsWithState }