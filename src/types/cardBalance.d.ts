export interface DebitCardBalance {
    card: Card | null;
    initial_balance: number | null;
    final_balance: number | null;
    difference: number | null;
    incomes: number | null;
    expenses: number | null;
    payments: number | null;
}

export interface CreditCardBalance {
    card: Card | null;
    initial_balance: number | null;
    bills: number | null;
    payments: number | null;
    final_balance: number | null;
}

export interface CardBalanceData {
    credit: CreditCardBalance[] | null;
    debit: DebitCardBalance[] | null;
}

export interface CardBalancePayload {
    message: string | null;
    data: CardBalanceData | null;
}

export interface CardBalanceParams {
    year: number | undefined;
    month: number | undefined;
}

export interface CardBalanceState {
    data: CardBalanceData | null;
    message: string | null;
    loading: boolean;
    error: string | null;
}