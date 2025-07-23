
export interface BanksState {
    data: Bank[] | null;
    loading: boolean;
    error: string | null;
}