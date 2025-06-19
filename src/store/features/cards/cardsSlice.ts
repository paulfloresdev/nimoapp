import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cardsState, IndexCardsPayload } from "../../../types/cards";

const initialState: cardsState = {
    credit: null,
    debit: null,
    data: null,
    loading: false,
    error: null,
}

const cardsSlice = createSlice({
    name: "cards",
    initialState,
    reducers: {
        //  Index
        indexCardsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        indexCardsSuccess: (state, action: PayloadAction<IndexCardsPayload>) => {
            state.loading = false;
            state.credit = action.payload.credit;
            state.debit = action.payload.debit;
        },
        indexCardsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }

        //  Store


        //  Show


        //  Update


        //  Destroy

        
    }
});

export const {
    indexCardsRequest,
    indexCardsSuccess,
    indexCardsFailure,
} = cardsSlice.actions;

export default cardsSlice.reducer;