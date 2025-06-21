import { Contact } from "./contacts";
import { Paginate } from "./paginate";
import { Transaction } from "./transactions";

export interface PaginateIncomeRelations extends Paginate {
    data: IncomeRelation[] | null;
}

export interface IncomeRelation {
    id: number;
    amount: number | null;
    contact: Contact | null;
    from_transaction: Transaction | null;
    to_transaction: Transaction | null;
}

export interface IncomeRelationState {
    collection: PaginateIncomeRelations | null;
    totalIncomes: number | null;
    item: IncomeRelation | null;
    verified: boolean | null;
    stored: boolean | null;
    message: string | null;
    loading: boolean;
    error: string | null;
    successStore: boolean | null;
}

export interface StoreIncomeRelationParams {
    amount: number | undefined;
    contact_id: number | undefined;
    from_id: number | undefined;
    to_id: number | undefined;
}

export interface StoreIncomeRelationPayload {
    message: string | null;
    data: IncomeRelation | null;
}

export interface IndexIncomeRelationParams {
    contact_id: number | undefined;
    from_id: number | undefined;
    to_id: number | undefined;
}

export interface IndexIncomeRelationPayload {
    message: string | null;
    data: PaginateIncomeRelations | null;
    total_amount: number | null;
}

export interface VerifyIncomeRelationParams {
    amount: number | undefined;
    to_id: number | undefined;
}

export interface VerifyIncomeRelationPayload {
    message: string | null;
}

