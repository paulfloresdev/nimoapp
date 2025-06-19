import { Card, Type } from "./cards";


export interface Category {
    id: number;
    name: string | null;
    icon: string | null;
}

export interface TransactionType extends Type {}

export interface Transaction {
    id: number;
    concept: string | null;
    amount: number | null;
    transaction_date: string | null;
    accounting_date: string | null;
    place: string | null;
    notes: string | null;
    created_at: string | null;
    updated_at: string | null;
    category: Category | null;
    type: TransactionType | null;
    card: Card | null;
}

export interface TransactionState {
    data: Transaction | null;
    message: string | null;
    loading: boolean;
    error: string | null;
}

export interface StoreTransactionParams {
    concept: string | null;
    amount: number | null;
    transaction_date: string | null;
    accounting_date: string | null;
    place: string | null;
    notes: string | null;
    category_id: number | null;
    type_id: number | null;
    card_id: number | null;
}

export interface StoreTransactionPayload {
    message: string | null;
    data: Transaction | null;
}

export interface UpdateTransactionParams {
    concept: string | null;
    amount: number | null;
    transaction_date: string | null;
    accounting_date: string | null;
    place: string | null;
    notes: string | null;
    category_id: number | null;
    card_id: number | null;
}

interface UpdateTransactionPayload {
    id: string;
    data: UpdateTransactionParams;
}
