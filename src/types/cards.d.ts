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

export interface CardType extends Type { }

export interface Card {
    id: number;
    numbers: string | null;
    color: string | null;
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

export interface CardsState {
    credit: Card[] | null;
    debit: Card[] | null;
    data: Card | null;
    message: string | null;
    loading: boolean;
    error: string | null;
    storeSuccess: boolean | null;
    updateSuccess: boolean | null;
    destroySuccess: boolean | null;
}

export interface StoreCardsParams {
    numbers: string | null;
    color: string | null;
    type_id: number | null;
    bank_id: number | null;
    network_id: number | null;
}

export interface StoreCardsPayload {
    message: string | null;
    data: Card;
}

export interface UpdateCardsParams {
    id: string,
    data: StoreCardsParams,
}

export interface UpdateCardsPayload {
    message: string | null;
    data: Card;
}


