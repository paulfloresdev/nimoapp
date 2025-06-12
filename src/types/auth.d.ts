//  Models
export interface User {
    id: number;
    name: string | null;
    lastname: string | null;
    phone: string | null;
    email: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

//  Params
export interface LogInParams {
    email: string;
    password: string;
}

export interface SignUpParams {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
}

export interface UpdateUserDataParams {
    name: string;
    lastname: string;
    phone: string;
    email: string;
}

export interface UpdateUserPasswordParams {
    password: string;
}

//  Reponses y States
export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}