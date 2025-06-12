import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LogInParams, User } from "../../../types/auth";

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //  LogIn
        logInRequest: (state, action: PayloadAction<LogInParams>) => {
            state.loading = true;
            state.error = null;
        },
        logInSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },
        logInFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //  SignUp
        signUpRequest: (state, _action) => {
            state.loading = true;
            state.error = null;
        },
        signUpSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        signUpFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //  LogOut
        logOutRequest: (state) => {
            state.loading = true;
        },
        logOutSuccess: (state) => {
            state.loading = false;
            state.user = null;
            state.token = null;
        },
        logOutFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //  Me
        meRequest: (state) => {
            state.loading = true;
        },
        meSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            const newUser = action.payload;

            if (
                !state.user ||
                state.user.id !== newUser.id ||
                state.user.name !== newUser.name ||
                state.user.lastname !== newUser.lastname
                // compara solo campos que importen
            ) {
                state.user = newUser;
            }
            // si no cambió, no actualizamos para evitar re-render
        },
        meFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
    logInRequest,
    logInSuccess,
    logInFailure,
    signUpRequest,
    signUpSuccess,
    signUpFailure,
    logOutRequest,
    logOutSuccess,
    logOutFailure,
    meRequest,
    meSuccess,
    meFailure
} = authSlice.actions;

export default authSlice.reducer;