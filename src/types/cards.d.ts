export interface Network {
    id: number;
    name: string | null;
    img_path: string | null;
}

export interface Bank {
    id: number;
    name: string | null;
    img_path: string | null;
    type: string | null;
}

export interface Type {
    id: number;
    type: string | null;
}

export interface CardType extends Type {}

export interface Card {
    id: number;
    numbers: string | null;
    colors: string | null;
    created_at: string | null;
    updated_at: string | null;
    type: CardType | null;
    bank: Bank | null;
    network: Network | null;
}

export interface IndexCardsPayload {
    credit: Card[] | null;
    debit: Card[] | null;
}

export interface cardsState {
    credit: Card[] | null;
    debit: Card[] | null;
    data: Card | null;
    loading: boolean;
    error: string | null;
}