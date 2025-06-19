//import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {HeroUIProvider} from "@heroui/react";
import {ToastProvider} from "@heroui/toast";
import { Provider } from 'react-redux';
import store from './store/configStore/store';

interface ProviderProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProviderProps> = ({ children }) => (
    <Provider store={store}>
        <BrowserRouter>
            <HeroUIProvider >
                <ToastProvider />
                {children}
            </HeroUIProvider>
        </BrowserRouter>
    </Provider>
);

export default Providers;