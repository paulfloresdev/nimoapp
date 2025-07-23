import { Pagination } from "@heroui/react";

export interface Contact {
    id: number;
    alias: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface StoreAndUpdateContactPayload {
    alias: string | null;
}

export interface UpdateContactParams {
    id: number;
    body: StoreAndUpdateContactPayload;
}

export interface StoreAndUpdateContactResponse {
    message: string | null;
    data: Contact | null;
}

export interface IndexContactData extends Pagination {
    data: Contact[] | null;
}

export interface IndexContactResponse {
    message: string | null;
    data: IndexContactData | null;
}

export interface ShowContactResponse {
    message: string | null;
    data: Contact | null;
}

export interface ContactState {
    collection: IndexContactData | null;
    item: Contact | null;
    message: string | null;
    loading: boolean;
    error: string | null;
    successStore: boolean | null;
    successUpdate: boolean | null;
    successDelete: boolean | null;
}