import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardBalanceParams, CardBalancePayload, CardBalanceState } from "../../../types/cardBalance";

const initialState: CardBalanceState = {
    data: null,
    message: null,
    loading: false,
    error: null,
}

const cardBalanceSlice = createSlice({
    name: "card_balance",
    initialState,
    reducers: {
        getCardBalanceRequest: (state, action: PayloadAction<CardBalanceParams>) => {
            state.loading = true;
            state.error = null;
        },
        getCardBalanceSuccess: (state, action: PayloadAction<CardBalancePayload>) => {
            state.loading = false;
            state.data = action.payload.data;
            state.message = action.payload.message;
        },
        getCardBalanceFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getCardBalanceRequest,
    getCardBalanceSuccess,
    getCardBalanceFailure
} = cardBalanceSlice.actions;

export default cardBalanceSlice.reducer;