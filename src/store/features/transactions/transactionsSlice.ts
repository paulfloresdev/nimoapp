import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreTransactionParams, StoreTransactionPayload, Transaction, TransactionState, UpdateTransactionPayload } from "../../../types/transactions";

const initialState: TransactionState = {
    data: null,
    message: null,
    loading: false,
    error: null,
}

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        //  Store
        storeTransactionsRequest: (state, action: PayloadAction<StoreTransactionParams>) => {
            state.loading = true;
            state.error = null;
        },
        storeTransactionsSuccess: (state, action: PayloadAction<StoreTransactionPayload>) => {
            state.loading = false;
            state.data = action.payload.data;
            state.message = action.payload.message;
        },
        storeTransactionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //  Update
        updateTransactionsRequest: (state, action: PayloadAction<UpdateTransactionPayload>) => {
            state.loading = true;
            state.error = null;
        },
        updateTransactionsSuccess: (state, action: PayloadAction<Transaction>) => {
            state.loading = false;
            state.data = action.payload;
        },
        updateTransactionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //  Destroy
        destroyTransactionsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        destroyTransactionsSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.message = action.payload;
        },
        destroyTransactionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
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