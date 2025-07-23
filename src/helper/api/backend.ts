import { LogInParams, SignUpParams, UpdateUserDataParams, UpdateUserPasswordParams } from "../../types/auth";
import { CardBalanceParams } from "../../types/cardBalance";
import { StoreCardsParams, UpdateCardsParams } from "../../types/cards";
import { StoreAndUpdateContactPayload, UpdateContactParams } from "../../types/contacts";
import { IndexIncomeRelationData, StoreIncomeRelationParams, VerifyIncomeRelationParams } from "../../types/incomeRelations";
import { MonthBalanceParams } from "../../types/monthBalance";
import { MonthTransactionsParams } from "../../types/monthTransactions";
import { MonthsWithParams, StoreTransactionParams, UpdateTransactionParams } from "../../types/transactions";
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
export const getMonthsWithAPI = (params: MonthsWithParams) => api.get(`${url.GET_MONTHS_WITH}?page=${params.page === undefined ? 1 : params.page}${params.year === undefined ? "" : `&year=${params.year}`}`);
export const getMonthBalanceAPI = (params: MonthBalanceParams) => api.get(`${url.GET_MONTH_BALANCE}/${params.year}/${params.month}`);
export const getCardBalanceAPI = (params: CardBalanceParams) => api.get(`${url.GET_CARDS_BALANCE}/${params.year}/${params.month}`);
export const getMonthTransactionsAPI = (params: MonthTransactionsParams) => api.post(`${url.GET_TRANSACTIONS}/${params.year}/${params.month}?page=${params.page}`, params.body);

//  Income Relations
export const storeIncomeRelationsAPI = (data: StoreIncomeRelationParams) => api.post(url.STORE_INCOME_RELATIONS, data);
export const indexIncomeRelationsAPI = (data: IndexIncomeRelationData) => api.post(`${url.INDEX_INCOME_RELATIONS}`, data);
export const verifyIncomeRelationsAPI = (data: VerifyIncomeRelationParams) => api.post(url.VERIFY_INCOME_RELATIONS, data);


//  Cards
export const indexCardsAPI = () => api.get(url.CARDS);
export const storeCardsAPI = (data: StoreCardsParams) => api.post(url.CARDS, data);
export const updateCardsAPI = (id: string, data: StoreCardsParams) => api.put(`${url.CARDS}/${id}`, data);
export const destroyCardsAPI = (id: string) => api.delete(`${url.CARDS}/${id}`);

// Contacts
export const indexContactsAPI = (page: string | undefined) => api.get(`${url.CONTACTS}?page=${page ?? 1}`);
export const storeContactsAPI = (data: StoreAndUpdateContactPayload) => api.post(url.CONTACTS, data);
export const updateContactsAPI = (params: UpdateContactParams) => api.put(`${url.CONTACTS}/${params.id}`, params.body);
export const destroyContactsAPI = (id: string) => api.delete(`${url.CONTACTS}/${id}`);

// Banks
export const indexBanksAPI = () => api.get(url.BANKS);