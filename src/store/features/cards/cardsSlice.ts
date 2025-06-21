import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardsState, IndexCardsPayload, StoreCardsParams, StoreCardsPayload, UpdateCardsParams, UpdateCardsPayload } from "../../../types/cards";

const initialState: CardsState = {
    credit: null,
    debit: null,
    data: null,
    message: null,
    loading: false,
    error: null,
    storeSuccess: null,
    updateSuccess: null,
    destroySuccess: null,
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
        },

        //  Store
        storeCardsRequest: (state, action: PayloadAction<StoreCardsParams>) => {
            state.loading = true;
            state.error = null;
            state.storeSuccess = null;
        },
        storeCardsSuccess: (state, action: PayloadAction<StoreCardsPayload>) => {
            state.loading = false;
            state.data = action.payload.data;
            state.message = action.payload.message;
            state.storeSuccess = true;
        },
        storeCardsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.storeSuccess = false;
        },

        //  Update
        updateCardsRequest: (state, action: PayloadAction<UpdateCardsParams>) => {
            state.loading = true;
            state.error = null;
            state.updateSuccess = null;
        },
        updateCardsSuccess: (state, action: PayloadAction<UpdateCardsPayload>) => {
            state.loading = false;
            state.message = action.payload.message;
            state.data = action.payload.data;
            state.updateSuccess = true;
        },
        updateCardsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.updateSuccess = false;
        },

        //  Destroy
        destroyCardsRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.destroySuccess = null;
        },
        destroyCardsSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.message = action.payload;
            state.destroySuccess = true;
        },
        destroyCardsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.destroySuccess = false;
        },

    }
});

export const {
    indexCardsRequest,
    indexCardsSuccess,
    indexCardsFailure,
    storeCardsRequest,
    storeCardsSuccess,
    storeCardsFailure,
    updateCardsRequest,
    updateCardsSuccess,
    updateCardsFailure,
    destroyCardsRequest,
    destroyCardsSuccess,
    destroyCardsFailure
} = cardsSlice.actions;

export default cardsSlice.reducer;