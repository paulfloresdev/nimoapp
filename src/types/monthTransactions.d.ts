import { Paginate } from "./paginate";
import { Transaction } from "./transactions";

export interface MonthTransactionsBody {
    concept?: string | undefined;
    amount?: number | undefined;
    category_id?: number | undefined;
    type_id?: number | undefined;
    card_id?: number | undefined;
    order_by: number;
    per_page?: number | undefined;
}

export interface MonthTransactionsParams {
    year: number | undefined;
    month: number | undefined;
    page?: number | undefined;
    body: MonthTransactionsBody;
}

export interface MonthTransactionsData extends Paginate {
    data: Transaction[] | null;
}

export interface MonthTransactionsPayload {
    message: string | null;
    data: MonthTransactionsData | null;
}

export interface MonthTransactionsState {
    data: MonthTransactionsData | null;
    message: string | null;
    loading: boolean;
    error: string | null;
}