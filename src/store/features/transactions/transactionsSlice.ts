import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreTransactionParams, StoreTransactionPayload, Transaction, TransactionState, UpdateTransactionPayload } from "../../../types/transactions";

const initialState: TransactionState = {
    data: null,
    message: null,
    loading: false,
    error: null,
    storeSuccess: null,
    updateSuccess: null,
    destroySuccess: null,
}

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        resetTransactionsState: (state) => {
            state.data = null;
            state.message = null;
            state.loading = false;
            state.error = null;
            state.storeSuccess = null;
            state.updateSuccess = null;
            state.destroySuccess = null;
        },
        //  Store
        storeTransactionsRequest: (state, action: PayloadAction<StoreTransactionParams>) => {
            state.loading = true;
            state.error = null;
            state.storeSuccess = null;
        },
        storeTransactionsSuccess: (state, action: PayloadAction<StoreTransactionPayload>) => {
            state.loading = false;
            state.data = action.payload.data;
            state.message = action.payload.message;
            state.storeSuccess = true;
        },
        storeTransactionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.storeSuccess = false;
        },

        //  Update
        updateTransactionsRequest: (state, action: PayloadAction<UpdateTransactionPayload>) => {
            state.loading = true;
            state.error = null;
            state.updateSuccess = null;
        },
        updateTransactionsSuccess: (state, action: PayloadAction<Transaction>) => {
            state.loading = false;
            state.data = action.payload;
            state.updateSuccess = true;
        },
        updateTransactionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.updateSuccess = false;
        },

        //  Destroy
        destroyTransactionsRequest: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.error = null;
            state.destroySuccess = null;
        },
        destroyTransactionsSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.message = action.payload;
            state.destroySuccess = true;
        },
        destroyTransactionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.destroySuccess = false;
        },
    }
});

export const {
    resetTransactionsState,
    storeTransactionsRequest,
    storeTransactionsSuccess,
    storeTransactionsFailure,
    updateTransactionsRequest,
    updateTransactionsSuccess,
    updateTransactionsFailure,
    destroyTransactionsRequest,
    destroyTransactionsSuccess,
    destroyTransactionsFailure
} = transactionsSlice.actions;

export default transactionsSlice.reducer;