export interface Paginate {
    current_page: number | null;
    first_page_url: string | null;
    from: number | null;
    last_page: number | null;
    last_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }> | null;
    next_page_url: string | null;
    per_page: number | null;
    prev_page_url: string | null;
    to: number | null;
    total: number | null;
}