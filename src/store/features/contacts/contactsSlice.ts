import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContactState, IndexContactResponse, StoreAndUpdateContactPayload, StoreAndUpdateContactResponse, UpdateContactParams } from "../../../types/contacts";

const initialState: ContactState = {
    collection: null,
    item: null,
    error: null,
    loading: false,
    message: null,
    successStore: null,
    successUpdate: null,
    successDelete: null,
}

const contactsSlice = createSlice({
    name: "contacts",
    initialState,
    reducers: {
        // Reset state
        resetContactsState: (state) => {
            state.successStore = null;
            state.successUpdate = null;
            state.successDelete = null;
        },

        // Index
        indexContactRequest: (state, action: PayloadAction<string | undefined>) => {
            state.loading = true;
            state.error = null;
        },
        indexContactSuccess: (state, action: PayloadAction<IndexContactResponse>) => {
            state.loading = false;
            state.collection = action.payload.data;
            state.message = action.payload.message;
        },
        indexContactFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Store
        storeContactRequest: (state, action: PayloadAction<StoreAndUpdateContactPayload>) => {
            state.loading = true;
            state.error = null;
            state.successStore = null;
        },
        storeContactSuccess: (state, action: PayloadAction<StoreAndUpdateContactResponse>) => {
            state.loading = false;
            state.successStore = true;
            state.item = action.payload.data;
            state.message = action.payload.message;
        },
        storeContactFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.successStore = false;
        },

        // Update
        updateContactRequest: (state, action: PayloadAction<UpdateContactParams>) => {
            state.loading = true;
            state.error = null;
            state.successUpdate = null;
        },
        updateContactSuccess: (state, action: PayloadAction<StoreAndUpdateContactResponse>) => {
            state.loading = false;
            state.successUpdate = true;
            state.item = action.payload.data;
            state.message = action.payload.message;
        },
        updateContactFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.successUpdate = false;
        },

        // Destroy
        destroyContactRequest: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.error = null;
            state.successDelete = null;
        },
        destroyContactSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.successDelete = true;
            state.message = action.payload;
        },
        destroyContactFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.successDelete = false;
        },
    }
});

export const {
    resetContactsState,
    indexContactRequest,
    indexContactSuccess,
    indexContactFailure,
    storeContactRequest,
    storeContactSuccess,
    storeContactFailure,
    updateContactRequest,
    updateContactSuccess,
    updateContactFailure,
    destroyContactRequest,
    destroyContactSuccess,
    destroyContactFailure
} = contactsSlice.actions;

export default contactsSlice.reducer;