import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import qs from 'qs';
//import createAuthRefreshInterceptor from 'axios-auth-refresh'

const autoApi = import.meta.env.VITE_SITE_BASE_API_URL_BACKEND;

const axiosInstance = axios.create({
    baseURL: autoApi,
    headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: false
});

axiosInstance.interceptors.response.use(
    function (response: AxiosResponse) {
        return response.data;
    },
    function (error: any) {
        // Obtener mensaje personalizado según el código de estado
        let message: string;
        switch (error.response?.status) {
            case 500:
                message = "Internal Server Error";
                break;
            case 401:
                // console.log("Hola desde axios")
                message = "Invalid credentials";
                localStorage.removeItem("user");
                break;
            case 404:
                message = "Sorry! the data you are looking for could not be found";
                break;
            case 400:
                const errors = error.response?.data;
                message = errors && errors.length > 0 ? errors[0] : "Bad Request";
                break;
            default:
                message = error.response?.data?.errors || error.message || "An unknown error occurred";
        }

        // Adjunta el mensaje al objeto original y reenvíalo
        error.customMessage = message;
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        config.headers['Accept-Language'] = 'es-MX';
        return config;
    },
    function (error: any) {
        return Promise.reject(error);
    }
);

/*
const refreshAuthLogic = (failedRequest: any) =>
    axios.post(autoApi + 'auth/refresh', {
        refresh_token: localStorage.getItem('token_refresh') ?? ''
    }).then((reponse) => {
        const {
            access_token: accessToken,
            refresh_token: refreshToken,
        } = reponse?.data?.token;

        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + accessToken

        localStorage.setItem('token', accessToken || '');
        localStorage.setItem('token_refresh', refreshToken || '');
        return Promise.resolve()
    }, () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_refresh');
        window.location.href = '/'; // Redirigir al login
        return Promise.reject()
    });

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    statusCodes: [401],
    retryInstance: axiosInstance,
    pauseInstanceWhileRefreshing: true,
    shouldRefresh: (error) => {
        return (error?.response?.data as { message?: string })?.message == 'Unauthenticated.'
    }
});

*/

class APIClient {
    get = <T = any>(
        url: string, 
        params?: Record<string, any>, 
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
        const query = params ? `?${qs.stringify(params, { arrayFormat: 'comma' })}` : '';
        return axiosInstance.get(`${url}${query}`, config);
    };

    post = <T = any>(
        url: string, 
        data?: any, 
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
        return axiosInstance.post(url, data, config);
    };

    put = <T = any>(
        url: string, 
        data?: any, 
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
        return axiosInstance.put(url, data, config);
    };

    patch = <T = any>(
        url: string, 
        data?: any, 
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
        return axiosInstance.patch(url, data, config);
    };

    delete = <T = any>(
        url: string, 
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
        return axiosInstance.delete(url, config);
    };
}

export const api = new APIClient();