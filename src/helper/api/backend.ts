import { LogInParams, SignUpParams, UpdateUserDataParams, UpdateUserPasswordParams } from "../../types/auth";
import { IndexIncomeRelationParams, StoreIncomeRelationParams, VerifyIncomeRelationParams } from "../../types/incomeRelations";
import { StoreTransactionParams, UpdateTransactionParams } from "../../types/transactions";
import { api } from "./configuration";
import * as url from "./url";

//  Auth
export const logInAPI = (data: LogInParams) => api.post(url.AUTH_LOGIN, data);
export const signUpAPI = (data: SignUpParams) => api.post(url.AUTH_SIGNUP, data);
export const logOutAPI = () => api.post(url.AUTH_LOGOUT, {});
export const meAPI = () => api.get(url.AUTH_ME);
export const updateUserDataAPI = (id: string, data: UpdateUserDataParams) => api.put(`${url.AUTH_UPDATE_DATA}/${id}`, data);
export const updateUserPasswordAPI = (id: string, data: UpdateUserPasswordParams) => api.put(`${url.AUTH_UPDATE_PASSWORD}/${id}`, data);

//  Transactions - Operations
export const storeTransactionsAPI = (data: StoreTransactionParams) => api.post(url.TRANSACTIONS, data);
export const updateTransactionsAPI = (id: string, data: UpdateTransactionParams) => api.put(`${url.TRANSACTIONS}/${id}`, data);
export const destroyTransactionsAPI = (id: string) => api.delete(`${url.TRANSACTIONS}/${id}`);

// Transactions - Searchs
export const getYearsWithAPI = () => api.get(url.GET_YEARS_WITH);

//  Income Relations
export const storeIncomeRelationsAPI = (data: StoreIncomeRelationParams) => api.post(url.STORE_INCOME_RELATIONS, data);
export const indexIncomeRelationsAPI = (data: IndexIncomeRelationParams) => api.post(url.INDEX_INCOME_RELATIONS, data);
export const verifyIncomeRelationsAPI = (data: VerifyIncomeRelationParams) => api.post(url.VERIFY_INCOME_RELATIONS, data);


//  Cards
export const indexCardsAPI = () => api.get(url.CARDS);