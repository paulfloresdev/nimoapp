import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bank } from "../../../types/cards";
import { BanksState } from "../../../types/banks";

const initialState: BanksState = {
    data: null,
    loading: false,
    error: null,
}

const banksSlice = createSlice({
    name: "banks",
    initialState,
    reducers: {
        //  Index
        indexBanksRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        indexBanksSuccess: (state, action: PayloadAction<Bank[]>) => {
            state.loading = false;
            state.data = action.payload;
        },
        indexBanksFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
    indexBanksRequest,
    indexBanksSuccess,
    indexBanksFailure,
} = banksSlice.actions;

export default banksSlice.reducer;