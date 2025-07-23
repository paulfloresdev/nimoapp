import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IncomeRelationState, IndexIncomeRelationData, IndexIncomeRelationPayload, StoreIncomeRelationParams, StoreIncomeRelationPayload, VerifyIncomeRelationParams, VerifyIncomeRelationPayload } from "../../../types/incomeRelations";

const initialState: IncomeRelationState = {
    collection: null,
    totalIncomes: null,
    item: null,
    message: null,
    verified: null,
    stored: null,
    loading: false,
    error: null,
    successStore: null,
}

const incomeRelationsSlice = createSlice({
    name: "income-relations",
    initialState,
    reducers: {
        resetIncomeRelationsRequest: (state) => {
            state.collection = null;
            state.totalIncomes = null;
            state.item = null;
            state.message = null;
            state.verified = null;
            state.stored = null;
            state.loading = false;
            state.error = null;
            state.successStore = null;
        },

        //  Index
        indexIncomeRelationsRequest: (state, action: PayloadAction<IndexIncomeRelationData>) => {
            state.loading = true;
            state.error = null;
            state.verified = null;
            state.stored = null;
            state.totalIncomes = null;
        },
        indexIncomeRelationsSuccess: (state, action: PayloadAction<IndexIncomeRelationPayload>) => {
            state.loading = false;
            state.collection = action.payload.data || null;
            state.message = action.payload.message;
            state.totalIncomes = action.payload.total_amount;
        },
        indexIncomeRelationsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //  Store
        storeIncomeRelationsRequest: (state, action: PayloadAction<StoreIncomeRelationParams>) => {
            state.loading = true;
            state.error = null;
            state.verified = null;
            state.stored = null;
            state.totalIncomes = null;

        },
        storeIncomeRelationsSuccess: (state, action: PayloadAction<StoreIncomeRelationPayload>) => {
            state.loading = false;
            state.item = action.payload.data;
            state.message = action.payload.message;
            state.stored = true;
            state.successStore = true;
        },
        storeIncomeRelationsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.stored = false;
            state.successStore = false;
        },

        //  Verify
        verifyIncomeRelationsRequest: (state, action: PayloadAction<VerifyIncomeRelationParams>) => {
            state.loading = true;
            state.error = null;
            state.verified = null;
            state.stored = null;
            state.totalIncomes = null;
        },
        verifyIncomeRelationsSuccess: (state, action: PayloadAction<VerifyIncomeRelationPayload>) => {
            state.loading = false;
            state.message = action.payload.message;
            state.verified = true;
        },
        verifyIncomeRelationsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.verified = false;
        },

    }
});

export const {
    resetIncomeRelationsRequest,
    indexIncomeRelationsRequest,
    indexIncomeRelationsSuccess,
    indexIncomeRelationsFailure,
    storeIncomeRelationsRequest,
    storeIncomeRelationsSuccess,
    storeIncomeRelationsFailure,
    verifyIncomeRelationsRequest,
    verifyIncomeRelationsSuccess,
    verifyIncomeRelationsFailure
} = incomeRelationsSlice.actions;

export default incomeRelationsSlice.reducer;