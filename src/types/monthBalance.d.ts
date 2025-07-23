export interface CreditMonthBalance {
    expenses: number | null;
    payments: number | null;
    initial_bills: number | null;
    final_bills: number | null;
}

export interface DebitMonthBalance {
    initial_balance: number | null;
    incomes: number | null;
    expenses: number | null;
    final_balance: number | null;
    difference: number | null;
    projected_final_balance: number | null;
    projected_difference: number | null;
}

export interface MonthBalance {
    credit: CreditMonthBalance | null;
    debit: DebitMonthBalance | null;
}

export interface MonthBalanceParams {
    year: number | undefined;
    month: number | undefined;
}

export interface MonthBalancePayload {
    message: string | null;
    data: MonthBalance | null;
}

export interface MonthBalanceState {
    data: MonthBalance | null;
    message: string | null;
    loading: boolean;
    error: string | null;
}