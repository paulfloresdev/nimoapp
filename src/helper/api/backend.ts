import { LogInParams, SignUpParams, UpdateUserDataParams, UpdateUserPasswordParams } from "../../types/auth";
import { api } from "./configuration";
import * as url from "./url";

//  Auth
export const logInAPI = (data: LogInParams) => api.post(url.AUTH_LOGIN, data);
export const signUpAPI = (data: SignUpParams) => api.post(url.AUTH_SIGNUP, data);
export const logOutAPI = () => api.post(url.AUTH_LOGOUT, {});
export const meAPI = () => api.get(url.AUTH_ME);
export const updateUserDataAPI = (id: string, data: UpdateUserDataParams) => api.put(`${url.AUTH_UPDATE_DATA}/${id}`, data);
export const updateUserPasswordAPI = (id: string, data: UpdateUserPasswordParams) => api.put(`${url.AUTH_UPDATE_PASSWORD}/${id}`, data);

//  Transactions
export const getYearsWithAPI= () => api.get(url.GET_YEARS_WITH);